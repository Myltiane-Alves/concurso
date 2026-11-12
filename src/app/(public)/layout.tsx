import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return <main className="auth-page">{children}</main>;
}
