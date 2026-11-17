import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Providers } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <Providers>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <header className="app-header">
            <span>Olá, {session.user.name}</span>
            <div className="header-actions">
              <ThemeToggle />
              <form action={logout}>
                <button type="submit" className="btn-ghost">
                  <LogOut size={16} /> Sair
                </button>
              </form>
            </div>
          </header>
          <section className="app-content">{children}</section>
        </div>
      </div>
    </Providers>
  );
}
