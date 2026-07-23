/**
 * One-off: give every user a Favourites list and move their bookmarks into it.
 *
 * Idempotent — safe to re-run. The Bookmark rows are deliberately left in
 * place as a fallback until lists have been live long enough to trust; the
 * model can be dropped from the schema later.
 *
 *   npx tsx prisma/migrateBookmarks.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_NAME = "Favourites";

function makeSlug(name: string, seed: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
  return `${base}-${seed.slice(-6)}`;
}

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log(`users: ${users.length}`);

  let listsCreated = 0;
  let itemsCopied = 0;
  let alreadyThere = 0;

  for (const user of users) {
    let list = await prisma.problemList.findFirst({
      where: { userId: user.id, isDefault: true },
      select: { id: true },
    });

    if (!list) {
      list = await prisma.problemList.create({
        data: {
          userId: user.id,
          name: DEFAULT_NAME,
          slug: makeSlug(DEFAULT_NAME, user.id),
          isDefault: true,
        },
        select: { id: true },
      });
      listsCreated++;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      select: { problemId: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    for (const [index, bookmark] of bookmarks.entries()) {
      const exists = await prisma.problemListItem.findUnique({
        where: {
          listId_problemId: { listId: list.id, problemId: bookmark.problemId },
        },
        select: { id: true },
      });

      if (exists) {
        alreadyThere++;
        continue;
      }

      await prisma.problemListItem.create({
        data: {
          listId: list.id,
          problemId: bookmark.problemId,
          position: index,
          createdAt: bookmark.createdAt,
        },
      });
      itemsCopied++;
    }
  }

  const totalBookmarks = await prisma.bookmark.count();
  const totalItems = await prisma.problemListItem.count();

  console.log(`lists created:      ${listsCreated}`);
  console.log(`bookmarks copied:   ${itemsCopied}`);
  console.log(`already present:    ${alreadyThere}`);
  console.log(`--`);
  console.log(`Bookmark rows:      ${totalBookmarks} (left intact)`);
  console.log(`ProblemListItems:   ${totalItems}`);
  console.log(
    totalItems >= totalBookmarks
      ? "OK: every bookmark has a list item"
      : "WARNING: fewer list items than bookmarks"
  );
}

main().finally(() => prisma.$disconnect());
