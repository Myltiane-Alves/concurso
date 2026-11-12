import { NextResponse } from "next/server";
import { registerSchema } from "@/features/auth/schemas/auth.schema";
import { registerUser } from "@/features/auth/services/register.service";
import { AppError } from "@/lib/errors";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser(parsed.data);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
