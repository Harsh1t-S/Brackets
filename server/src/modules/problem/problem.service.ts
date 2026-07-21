import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

const DIFFICULTIES = new Set(["EASY", "MEDIUM", "HARD"]);

// Whitelisted sort orders — never interpolate user input into ORDER BY.
const SORTS: Record<string, Prisma.Sql> = {
  number: Prisma.raw(`"number" ASC`),
  acceptance: Prisma.raw(`"acceptance" DESC`),
  likes: Prisma.raw(`"likes" DESC`),
  newest: Prisma.raw(`"createdAt" DESC`),
};

/** `["a","b"]` -> SQL `ARRAY['a','b']::text[]` (values stay bound params). */
const textArray = (values: string[]) =>
  Prisma.sql`ARRAY[${Prisma.join(values.map((v) => Prisma.sql`${v}`))}]::text[]`;

export const getProblems = async ({
  page = 1,
  limit = 10,
  search,
  difficulties = [],
  tags = [],
  companies = [],
  match = "any",
  status,
  sort,
  userId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  /** Combinable difficulty filters — empty means "all". */
  difficulties?: string[];
  tags?: string[];
  companies?: string[];
  /** How to combine multiple tags/companies: every one, or any one. */
  match?: "all" | "any";
  /** Personal filters — need a signed-in user, ignored otherwise. */
  status?: "solved" | "unsolved" | "bookmarked";
  sort?: string;
  userId?: string;
}) => {
  const skip = (page - 1) * limit;
  const filters: Prisma.Sql[] = [];

  const term = search?.trim();

  // With a search term, rank by how well each row matches: exact title >
  // title prefix > title contains > tag > company. Only meaningful with a
  // term, so any other sort (or no term) falls back to the whitelist.
  const orderBy =
    term && (!sort || sort === "relevance")
      ? Prisma.sql`
          CASE
            WHEN lower("title") = lower(${term}) THEN 0
            WHEN "title" ILIKE ${term + "%"} THEN 1
            WHEN "title" ILIKE ${`%${term}%`} THEN 2
            WHEN EXISTS (
              SELECT 1 FROM unnest("tags") AS t WHERE t ILIKE ${`%${term}%`}
            ) THEN 3
            ELSE 4
          END ASC, "number" ASC`
      : SORTS[sort ?? "number"] ?? SORTS.number;
  if (term) {
    // Match the term against the title, any tag, or any company — all
    // case-insensitive and partial (ILIKE).
    const like = `%${term}%`;
    filters.push(Prisma.sql`(
      "title" ILIKE ${like}
      OR EXISTS (SELECT 1 FROM unnest("tags") AS tg WHERE tg ILIKE ${like})
      OR EXISTS (SELECT 1 FROM unnest("companies") AS co WHERE co ILIKE ${like})
    )`);
  }

  const validDifficulties = difficulties.filter((d) => DIFFICULTIES.has(d));
  if (validDifficulties.length) {
    filters.push(
      Prisma.sql`"difficulty"::text = ANY(${textArray(validDifficulties)})`
    );
  }

  // `@>` = has every selected value, `&&` = overlaps any of them.
  if (tags.length) {
    filters.push(
      match === "all"
        ? Prisma.sql`"tags" @> ${textArray(tags)}`
        : Prisma.sql`"tags" && ${textArray(tags)}`
    );
  }

  if (companies.length) {
    filters.push(
      match === "all"
        ? Prisma.sql`"companies" @> ${textArray(companies)}`
        : Prisma.sql`"companies" && ${textArray(companies)}`
    );
  }

  if (userId && status) {
    const solvedExists = Prisma.sql`EXISTS (
      SELECT 1 FROM "SolvedProblem" sp
      WHERE sp."problemId" = "Problem"."id" AND sp."userId" = ${userId}
    )`;
    if (status === "solved") filters.push(solvedExists);
    if (status === "unsolved") filters.push(Prisma.sql`NOT ${solvedExists}`);
    if (status === "bookmarked") {
      filters.push(Prisma.sql`EXISTS (
        SELECT 1 FROM "Bookmark" bm
        WHERE bm."problemId" = "Problem"."id" AND bm."userId" = ${userId}
      )`);
    }
  }

  const whereSql = filters.length
    ? Prisma.sql`WHERE ${Prisma.join(filters, " AND ")}`
    : Prisma.empty;

  const [problems, countRows] = await Promise.all([
    // Explicit column list: the public list must never ship solutionCode
    // (or starterCode — the editor loads it from the detail endpoint).
    prisma.$queryRaw`
      SELECT "id", "number", "title", "slug", "difficulty", "tags",
             "companies", "acceptance", "likes", "dislikes",
             "createdAt", "updatedAt",
             ${
               userId
                 ? Prisma.sql`EXISTS (
                     SELECT 1 FROM "SolvedProblem" sp2
                     WHERE sp2."problemId" = "Problem"."id"
                       AND sp2."userId" = ${userId}
                   )`
                 : Prisma.sql`false`
             } AS "solved"
      FROM "Problem"
      ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${skip}
    `,
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count FROM "Problem"
      ${whereSql}
    `,
  ]);

  const total = Number(countRows[0]?.count ?? 0);

  return {
    problems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

/** A random problem — powers the shuffle button in the problem header. */
export const getRandomProblem = async () => {
  const rows = await prisma.$queryRaw<
    { number: number; slug: string }[]
  >`SELECT "number", "slug" FROM "Problem" ORDER BY random() LIMIT 1`;
  return rows[0] ?? null;
};

/**
 * Neighbours by problem number, plus a few problems sharing tags — lets a
 * solver keep moving instead of bouncing back to the list.
 */
export const getProblemContext = async (problemId: string) => {
  const current = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { number: true, tags: true },
  });

  if (!current) return { prev: null, next: null, related: [] };

  const summary = {
    id: true,
    number: true,
    title: true,
    slug: true,
    difficulty: true,
  } as const;

  const [prev, next, related] = await Promise.all([
    prisma.problem.findFirst({
      where: { number: { lt: current.number } },
      orderBy: { number: "desc" },
      select: summary,
    }),
    prisma.problem.findFirst({
      where: { number: { gt: current.number } },
      orderBy: { number: "asc" },
      select: summary,
    }),
    current.tags.length
      ? prisma.problem.findMany({
          where: {
            id: { not: problemId },
            tags: { hasSome: current.tags },
          },
          orderBy: { number: "asc" },
          take: 5,
          select: summary,
        })
      : Promise.resolve([]),
  ]);

  return { prev, next, related };
};

/**
 * Every tag and company in use, with problem counts — powers the filter
 * panel so users pick from real values instead of guessing.
 */
export const getFilterFacets = async () => {
  const [tags, companies] = await Promise.all([
    prisma.$queryRaw<{ value: string; count: bigint }[]>`
      SELECT tg AS value, COUNT(*)::bigint AS count
      FROM "Problem", unnest("tags") AS tg
      GROUP BY tg ORDER BY count DESC, value ASC
    `,
    prisma.$queryRaw<{ value: string; count: bigint }[]>`
      SELECT co AS value, COUNT(*)::bigint AS count
      FROM "Problem", unnest("companies") AS co
      GROUP BY co ORDER BY count DESC, value ASC
    `,
  ]);

  const toPlain = (rows: { value: string; count: bigint }[]) =>
    rows.map((r) => ({ value: r.value, count: Number(r.count) }));

  return { tags: toPlain(tags), companies: toPlain(companies) };
};

/** Fetch by problem number ("1") or slug ("two-sum"). */
export const getProblem = async (key: string) => {
  if (/^\d+$/.test(key)) {
    return prisma.problem.findUnique({
      where: { number: Number(key) },
    });
  }
  return prisma.problem.findUnique({
    where: { slug: key },
  });
};

export const setVote = async (
  userId: string,
  problemId: string,
  value: 1 | -1
) => {
  const existing = await prisma.problemVote.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  const old = existing?.value ?? 0;
  // Clicking the same reaction again clears it (toggle), like LeetCode.
  const next = old === value ? 0 : value;

  const likesDelta = (next === 1 ? 1 : 0) - (old === 1 ? 1 : 0);
  const dislikesDelta = (next === -1 ? 1 : 0) - (old === -1 ? 1 : 0);

  const [problem] = await prisma.$transaction([
    prisma.problem.update({
      where: { id: problemId },
      data: {
        likes: { increment: likesDelta },
        dislikes: { increment: dislikesDelta },
      },
      select: { likes: true, dislikes: true },
    }),
    next === 0
      ? prisma.problemVote.delete({
          where: { userId_problemId: { userId, problemId } },
        })
      : prisma.problemVote.upsert({
          where: { userId_problemId: { userId, problemId } },
          update: { value: next },
          create: { userId, problemId, value: next },
        }),
  ]);

  return { likes: problem.likes, dislikes: problem.dislikes, myVote: next };
};

export const toggleSolved = async (userId: string, problemId: string) => {
  const existing = await prisma.solvedProblem.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (existing) {
    await prisma.solvedProblem.delete({ where: { id: existing.id } });
    return { solved: false };
  }

  await prisma.solvedProblem.create({ data: { userId, problemId } });
  return { solved: true };
};

export const getMySolved = async (userId: string, problemId: string) => {
  const row = await prisma.solvedProblem.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
  return !!row;
};

export const getMyVote = async (userId: string, problemId: string) => {
  const vote = await prisma.problemVote.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });
  return vote?.value ?? 0;
};

export const getStats = async () => {
  const [total, easy, medium, hard] = await Promise.all([
    prisma.problem.count(),
    prisma.problem.count({ where: { difficulty: "EASY" } }),
    prisma.problem.count({ where: { difficulty: "MEDIUM" } }),
    prisma.problem.count({ where: { difficulty: "HARD" } }),
  ]);

  // Distinct tags across all problems — counted in the DB rather than pulling
  // every problem's tags into memory (set-returning functions in FROM are
  // implicitly LATERAL in Postgres, so unnest can reference "tags").
  const topicRows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(DISTINCT tag)::bigint AS count
    FROM "Problem", unnest("tags") AS tag
  `;
  const totalTopics = Number(topicRows[0]?.count ?? 0);

  return {
    totalProblems: total,
    easyProblems: easy,
    mediumProblems: medium,
    hardProblems: hard,
    totalTopics,
  };
};
