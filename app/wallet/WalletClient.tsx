"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, CheckCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
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
  const [confirming, setConfirming]       = useState<string | null>(null);
  const [localSessions, setLocalSessions] = useState(sessions);
  const [showConfetti, setShowConfetti]   = useState(false);

  async function confirmSession(sessionId: string, isTeacher: boolean) {
    setConfirming(sessionId);
    const field = isTeacher ? "teacher_confirmed" : "learner_confirmed";
    await supabase.from("sessions").update({ [field]: true }).eq("id", sessionId);

    setLocalSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, [field]: true } : s
    ));

    const session = localSessions.find(s => s.id === sessionId);
    const otherConfirmed = isTeacher ? session?.learner_confirmed : session?.teacher_confirmed;
    if (otherConfirmed) {
      await supabase.from("sessions").update({ status: "completed" }).eq("id", sessionId);
      await supabase.from("swapcoin_transactions").insert([
        { user_id: session?.teacher_id, amount: 20, type: "earn",   description: `Taught ${session?.skill_name}`,              session_id: sessionId },
        { user_id: session?.teacher_id, amount: 10, type: "refund", description: `Deposit refunded — ${session?.skill_name}`,  session_id: sessionId },
        { user_id: session?.learner_id, amount: 10, type: "refund", description: `Deposit refunded — ${session?.skill_name}`,  session_id: sessionId },
      ]);
      setLocalSessions(prev => prev.map(s =>
        s.id === sessionId ? { ...s, status: "completed" } : s
      ));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setConfirming(null);
  }

  const pendingSessions   = localSessions.filter(s => s.status !== "completed" && s.status !== "cancelled");
  const completedSessions = localSessions.filter(s => s.status === "completed");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar coins={profile?.swapcoin_balance || 0} />

      {/* Confetti burst */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                background: ["#9B1B30", "#C8A96E", "#4e6f85", "#C83850", "#8896A6"][i % 5],
                animation: `confettiFall ${1 + Math.random() * 2}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <main className="md:ml-56 pb-20 md:pb-0 px-6 py-8 max-w-3xl">

        {/* Balance hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl p-8 mb-8"
          style={{
            background: "linear-gradient(135deg, #1C2A36 0%, #161D27 50%, #111820 100%)",
            border: "1px solid rgba(155,27,48,0.18)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(155,27,48,0.06)"
          }}
        >
          {/* Subtle burgundy glow accent */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(155,27,48,0.14) 0%, transparent 70%)",
              transform: "translate(30%, -30%)"
            }}
          />
          <div className="relative">
            <p className="text-sm font-medium mb-3" style={{ color: "var(--text-2)" }}>SwapCoin balance</p>
            <div className="flex items-end gap-3 mb-5">
              <span className="font-black" style={{ fontSize: "clamp(3rem, 8vw, 4.5rem)", color: "var(--text)", lineHeight: 1 }}>
                {profile?.swapcoin_balance || 0}
              </span>
              <Coins size={28} style={{ color: "var(--coin)", marginBottom: "8px" }} />
            </div>
            <div className="flex gap-6 text-sm" style={{ color: "var(--text-2)" }}>
              <div>
                <span className="font-bold" style={{ color: "var(--text)" }}>
                  {completedSessions.filter(s => s.teacher_id === userId).length}
                </span>
                <span className="ml-1.5">sessions taught</span>
              </div>
              <div>
                <span className="font-bold" style={{ color: "var(--coin)" }}>+20</span>
                <span className="ml-1.5">coins per session</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How coins work */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Teach", desc: "Earn +20 coins", color: "var(--burg-bright)" },
            { label: "Learn", desc: "Spend coins",    color: "var(--steel)" },
            { label: "Deposit", desc: "10 held on book", color: "var(--coin)" },
          ].map(item => (
            <div
              key={item.label}
              className="p-4 rounded-xl text-center"
              style={{ background: "var(--bg-card-2)", border: "1px solid var(--border-soft)" }}
            >
              <div className="font-bold text-sm mb-1" style={{ color: item.color }}>{item.label}</div>
              <div className="text-xs" style={{ color: "var(--text-3)" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Pending sessions */}
        {pendingSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>Sessions to confirm</h2>
            <div className="space-y-3">
              {pendingSessions.map(session => {
                const isTeacher    = session.teacher_id === userId;
                const myConfirmed  = isTeacher ? session.teacher_confirmed : session.learner_confirmed;
                const otherName    = isTeacher ? session.learner?.full_name : session.teacher?.full_name;

                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 rounded-xl flex items-center gap-4"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{session.skill_name}</div>
                      <div className="text-xs mt-0.5 mb-3" style={{ color: "var(--text-3)" }}>
                        {isTeacher ? `Teaching ${otherName}` : `Learning from ${otherName}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={session.teacher_confirmed
                            ? { background: "rgba(155,27,48,0.12)", color: "#E07080", border: "1px solid rgba(155,27,48,0.22)" }
                            : { background: "rgba(255,255,255,0.04)", color: "var(--text-3)", border: "1px solid var(--border-soft)" }
                          }
                        >
                          {session.teacher_confirmed ? "Teacher confirmed" : "Teacher pending"}
                        </span>
                        <span
                          className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={session.learner_confirmed
                            ? { background: "rgba(155,27,48,0.12)", color: "#E07080", border: "1px solid rgba(155,27,48,0.22)" }
                            : { background: "rgba(255,255,255,0.04)", color: "var(--text-3)", border: "1px solid var(--border-soft)" }
                          }
                        >
                          {session.learner_confirmed ? "Learner confirmed" : "Learner pending"}
                        </span>
                      </div>
                    </div>
                    {!myConfirmed ? (
                      <button
                        onClick={() => confirmSession(session.id, isTeacher)}
                        disabled={confirming === session.id}
                        className="btn-primary text-sm flex-shrink-0"
                        style={{ padding: "0.55rem 1.1rem" }}
                      >
                        {confirming === session.id ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        ) : "Confirm session"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-sm font-medium flex-shrink-0" style={{ color: "#E07080" }}>
                        <CheckCircle size={15} />
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
          <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>Transaction history</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-14" style={{ color: "var(--text-3)" }}>
              <Coins size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No transactions yet. Start a session to earn coins.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => {
                const isPositive = tx.amount > 0;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isPositive ? "rgba(155,27,48,0.10)" : "rgba(78,111,133,0.10)",
                        border: `1px solid ${isPositive ? "rgba(155,27,48,0.20)" : "rgba(78,111,133,0.20)"}`
                      }}
                    >
                      {isPositive
                        ? <ArrowDownLeft size={16} style={{ color: "#E07080" }} />
                        : <ArrowUpRight  size={16} style={{ color: "var(--steel)" }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{tx.description}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                        {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="font-bold text-sm flex-shrink-0" style={{ color: isPositive ? "#E07080" : "var(--steel)" }}>
                      {isPositive ? "+" : ""}{tx.amount}
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
