import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <main className="auth-page">
      <div className="auth-theme">
        <ThemeToggle />
      </div>
      {children}
    </main>
  );
}
