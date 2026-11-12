import bcrypt from "bcryptjs";
import { AppError } from "@/lib/errors";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import type { RegisterInput } from "../schemas/auth.schema";

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw new AppError("Este e-mail já está cadastrado", 409);

  const passwordHash = await bcrypt.hash(input.password, 12);
  return createUser({ name: input.name, email: input.email, passwordHash });
}
