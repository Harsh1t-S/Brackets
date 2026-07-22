import prisma from "../../prisma/prisma";
import { generateToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import bcrypt from "bcrypt";

interface LoginInput {
  email: string;
  password: string;
}

/**
 * A valid bcrypt hash of a value nobody can supply. Comparing against it on
 * the "no such user" path keeps the response time of an unknown email in the
 * same ballpark as a known one — otherwise a miss returns in ~1ms and a hit
 * in ~80ms, which is enough to enumerate registered addresses despite the
 * deliberately vague error message.
 */
const DUMMY_HASH = bcrypt.hashSync("no-such-user-placeholder", 10);

export const login = async ({
  email,
  password,
}: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  const isMatch = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_HASH
  );

  if (!user || !isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const register = async ({
  name,
  email,
  password,
}: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};