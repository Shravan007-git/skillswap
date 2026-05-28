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
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-40 py-6 px-4"
        style={{
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-soft)"
        }}
      >
        <Link href="/feed" className="flex items-center gap-2.5 px-3 mb-10">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #C42B2B, #8B1A1A)",
              boxShadow: "0 2px 10px rgba(196,43,43,0.35)"
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>Skill Swap</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={active ? {
                  background: "rgba(196,43,43,0.10)",
                  color: "#E07070",
                  border: "1px solid rgba(196,43,43,0.18)"
                } : {
                  color: "var(--text-2)",
                  border: "1px solid transparent"
                }}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Coin balance */}
        <div
          className="px-4 py-3 rounded-xl mb-3"
          style={{
            background: "rgba(212,168,83,0.06)",
            border: "1px solid rgba(212,168,83,0.14)"
          }}
        >
          <div className="flex items-center gap-2">
            <Coins size={13} style={{ color: "var(--coin)" }} />
            <span className="font-semibold text-xs" style={{ color: "var(--coin)" }}>{coins} coins</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>Teach to earn more</p>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all w-full text-left"
          style={{ color: "var(--text-3)" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--text)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-3)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      {/* Mobile bottom bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around py-2 px-2"
        style={{
          background: "rgba(16,8,8,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border-soft)"
        }}
      >
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs font-medium"
              style={{ color: active ? "var(--blood)" : "var(--text-3)" }}
            >
              <item.icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
