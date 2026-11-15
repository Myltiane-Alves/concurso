import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { resolveView } from "@/features/views/resolvers";

export async function GET(req: Request, ctx: { params: Promise<{ name: string[] }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ message: "Não autenticado" }, { status: 401 });

  try {
    const { name } = await ctx.params;
    const data = await resolveView(name, userId, new URL(req.url).searchParams);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
