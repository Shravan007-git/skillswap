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
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-slate-900 border-r border-white/10 z-40 py-6 px-4">
        <Link href="/feed" className="flex items-center gap-2 px-3 mb-10">
          <span className="text-2xl">🔄</span>
          <span className="text-xl font-bold gradient-text">Skill Swap</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith(item.href)
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Coin balance */}
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-amber-400" />
            <span className="text-amber-300 font-bold">{coins} SwapCoins</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Teach to earn more</p>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 text-sm transition-all"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-900 border-t border-white/10 flex items-center justify-around py-2 px-2">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all text-xs font-medium",
              pathname.startsWith(item.href)
                ? "text-brand-300"
                : "text-slate-500"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
