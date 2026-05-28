"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

interface Session {
  id: string;
  skill_name: string;
  status: string;
  teacher_id: string;
  learner_id: string;
  teacher_confirmed: boolean;
  learner_confirmed: boolean;
  coin_deposit: number;
  teacher: { full_name: string } | null;
  learner: { full_name: string } | null;
}

interface WalletClientProps {
  profile: Profile;
  transactions: Transaction[];
  sessions: Session[];
  userId: string;
}

export default function WalletClient({ profile, transactions, sessions, userId }: WalletClientProps) {
  const supabase = createClient();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [localSessions, setLocalSessions] = useState(sessions);
  const [showConfetti, setShowConfetti] = useState(false);

  async function confirmSession(sessionId: string, isTeacher: boolean) {
    setConfirming(sessionId);
    const field = isTeacher ? "teacher_confirmed" : "learner_confirmed";
    await supabase.from("sessions").update({ [field]: true }).eq("id", sessionId);

    // Optimistic update
    setLocalSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, [field]: true } : s
    ));

    // Check if both confirmed — mark complete
    const session = localSessions.find(s => s.id === sessionId);
    const otherConfirmed = isTeacher ? session?.learner_confirmed : session?.teacher_confirmed;
    if (otherConfirmed) {
      await supabase.from("sessions").update({ status: "completed" }).eq("id", sessionId);
      // Award coins
      await supabase.from("swapcoin_transactions").insert([
        {
          user_id: session?.teacher_id,
          amount: 20,
          type: "earn",
          description: `Taught ${session?.skill_name} ✅`,
          session_id: sessionId,
        },
        {
          user_id: session?.teacher_id,
          amount: 10,
          type: "refund",
          description: `Deposit refunded — ${session?.skill_name}`,
          session_id: sessionId,
        },
        {
          user_id: session?.learner_id,
          amount: 10,
          type: "refund",
          description: `Deposit refunded — ${session?.skill_name}`,
          session_id: sessionId,
        },
      ]);
      setLocalSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, status: "completed" } : s
      ));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setConfirming(null);
  }

  const pendingSessions = localSessions.filter(s => s.status !== "completed" && s.status !== "cancelled");
  const completedSessions = localSessions.filter(s => s.status === "completed");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar coins={profile?.swapcoin_balance || 0} />

      {/* Confetti burst */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                background: ["#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444"][i % 5],
                animation: `confettiFall ${1 + Math.random() * 2}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <main className="md:ml-64 pb-20 md:pb-0 px-6 py-8 max-w-4xl mx-auto">
        {/* Coin balance hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8 mb-8"
          style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)" }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)" }} />
          <div className="relative">
            <p className="text-white/70 font-medium mb-2">Your SwapCoin balance</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-6xl font-black text-white">{profile?.swapcoin_balance || 0}</span>
              <span className="text-2xl font-bold text-white/80 mb-2">🪙</span>
            </div>
            <div className="flex gap-6 text-sm text-white/80">
              <div>
                <span className="text-white font-bold">{completedSessions.filter(s => s.teacher_id === userId).length}</span>
                <span className="ml-1">sessions taught</span>
              </div>
              <div>
                <span className="text-white font-bold">+20</span>
                <span className="ml-1">coins per session</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How coins work */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🎓", label: "Teach", desc: "Earn +20 coins", color: "emerald" },
            { icon: "📚", label: "Learn", desc: "Spend coins", color: "violet" },
            { icon: "🔒", label: "Deposit", desc: "10 held on book", color: "amber" },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-bold text-sm">{item.label}</div>
              <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Pending sessions */}
        {pendingSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black mb-4">Sessions to confirm</h2>
            <div className="space-y-3">
              {pendingSessions.map(session => {
                const isTeacher = session.teacher_id === userId;
                const myConfirmed = isTeacher ? session.teacher_confirmed : session.learner_confirmed;
                const otherName = isTeacher
                  ? session.learner?.full_name
                  : session.teacher?.full_name;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{session.skill_name}</div>
                      <div className="text-sm text-slate-400 mt-0.5">
                        {isTeacher ? `Teaching ${otherName}` : `Learning from ${otherName}`}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          session.teacher_confirmed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
                        }`}>
                          {session.teacher_confirmed ? "✓" : "○"} Teacher
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          session.learner_confirmed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-400"
                        }`}>
                          {session.learner_confirmed ? "✓" : "○"} Learner
                        </span>
                      </div>
                    </div>
                    {!myConfirmed ? (
                      <button
                        onClick={() => confirmSession(session.id, isTeacher)}
                        disabled={confirming === session.id}
                        className="btn-primary text-sm py-2.5 px-5 flex-shrink-0"
                      >
                        {confirming === session.id ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : "Confirm session ✅"}
                      </button>
                    ) : (
                      <div className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={16} />
                        Confirmed
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transaction history */}
        <div>
          <h2 className="text-xl font-black mb-4">Transaction history</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Coins size={40} className="mx-auto mb-3 opacity-40" />
              <p>No transactions yet. Start a session to earn coins!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => {
                const isPositive = tx.amount > 0;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPositive ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {isPositive
                        ? <ArrowDownLeft size={18} className="text-emerald-400" />
                        : <ArrowUpRight size={18} className="text-red-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{tx.description}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className={`font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                      {isPositive ? "+" : ""}{tx.amount} 🪙
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
