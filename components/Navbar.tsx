"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Search, Wallet, User, LogOut, Coins } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/feed",      icon: Search,          label: "Discover" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/wallet",    icon: Wallet,          label: "Wallet" },
  { href: "/profile",   icon: User,            label: "Profile" },
];

export default function Navbar({ coins = 0 }: { coins?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40 py-6 px-4" style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)" }}>
        <Link href="/feed" className="flex items-center gap-2.5 px-3 mb-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand)" }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight">Skill Swap</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith(item.href)
                  ? "text-white"
                  : "hover:text-white hover:bg-white/5"
              )}
              style={pathname.startsWith(item.href) ? {
                background: "rgba(0,200,150,0.12)",
                color: "#4de4c3",
                border: "1px solid rgba(0,200,150,0.2)"
              } : { color: "var(--text-secondary)" }}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Coin balance */}
        <div className="px-4 py-3 rounded-xl mb-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <div className="flex items-center gap-2">
            <Coins size={15} style={{ color: "#F59E0B" }} />
            <span className="font-bold text-sm" style={{ color: "#F59E0B" }}>{coins} coins</span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Teach a session to earn more</p>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around py-2 px-2" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)" }}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs font-medium"
            )}
            style={{ color: pathname.startsWith(item.href) ? "#00C896" : "var(--text-muted)" }}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
