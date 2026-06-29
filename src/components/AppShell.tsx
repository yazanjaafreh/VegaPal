import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmEmailPending } from "@/components/auth/ConfirmEmailPending";
import { auth, useSession } from "@/lib/vegapal-store";
import { LayoutDashboard, FilePlus2, Settings, LogOut, FileText, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/lib/theme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading, pendingEmailConfirmation, authEmail } = useSession();
  const { t } = useTranslation("common");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user && !pendingEmailConfirmation) navigate({ to: "/login" });
  }, [loading, user, pendingEmailConfirmation, navigate]);

  if (loading) return null;
  if (pendingEmailConfirmation) return <ConfirmEmailPending email={authEmail} />;
  if (!user) return null;

  const nav = [
    { to: "/dashboard", label: t("nav.overview"), icon: LayoutDashboard, exact: true },
    { to: "/invoices", label: t("nav.invoices"), icon: FileText, exact: true },
    { to: "/invoices/new", label: t("nav.createInvoice"), icon: FilePlus2 },
    { to: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  const isActive = (n: typeof nav[number]) =>
    n.exact ? pathname === n.to : pathname === n.to || pathname.startsWith(n.to + "/");

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-background sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/dashboard"><Logo /></Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => {
            const active = isActive(n);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <n.icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 pb-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3 flex items-start gap-2.5">
            <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold">{t("securePayments.title")}</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{t("securePayments.tagline")}</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-navy text-navy-foreground flex items-center justify-center text-sm font-semibold">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name || user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            onClick={async () => { await auth.signOut(); navigate({ to: "/" }); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full px-2 py-1.5 rounded-md hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> {t("nav.signOut")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-30">
          <Link to="/dashboard"><Logo /></Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur flex pb-[env(safe-area-inset-bottom,0px)]" aria-label="App navigation">
          {nav.map((n) => {
            const active = isActive(n);
            return (
              <Link
                key={n.to}
                to={n.to}
                aria-current={active ? "page" : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 min-h-[3.5rem] text-[10px] font-medium leading-tight ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span className="max-w-[4.5rem] truncate text-center">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
