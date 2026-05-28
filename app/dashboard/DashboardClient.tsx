"use client";

import { motion } from "framer-motion";
import { Flame, Star, BookOpen, Trophy, Zap, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import { getSkillEmoji } from "@/lib/utils";
import Link from "next/link";

interface DashboardClientProps {
  profile: Profile;
  mySkills: { skill_name: string; skill_type: string; is_verified: boolean; sessions_count: number }[];
  certificates: { id: string; skill_name: string; sessions_count: number; issued_at: string }[];
  recentSessions: { id: string; skill_name: string; status: string; teacher_id: string }[];
  userId: string;
}

const WEEKLY_CHALLENGE = {
  title: "Teach 3 sessions this week",
  reward: "Rare badge + 50 coins",
  current: 1,
  target: 3,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export default function DashboardClient({ profile, mySkills, certificates, userId }: DashboardClientProps) {
  const teachSkills    = mySkills.filter(s => s.skill_type === "teach");
  const learnSkills    = mySkills.filter(s => s.skill_type === "learn");
  const verifiedCount  = teachSkills.filter(s => s.is_verified).length;

  const stats = [
    { label: "Sessions taught",  value: profile?.total_sessions_taught  || 0,               icon: BookOpen },
    { label: "Sessions learned", value: profile?.total_sessions_learned || 0,               icon: Zap },
    { label: "Avg. rating",      value: profile?.average_rating ? `${profile.average_rating}` : "—", icon: Star },
    { label: "Day streak",       value: profile?.streak_days || 0,                           icon: Flame },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-56 pb-20 md:pb-0 px-6 py-8 max-w-3xl">

        {/* Welcome */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black mb-1" style={{ color: "var(--text)" }}>
            Hey {profile?.full_name?.split(" ")[0] || "there"}
          </h1>
          <p style={{ color: "var(--text-2)" }}>
            {profile?.streak_days > 0
              ? `You're on a ${profile.streak_days}-day streak`
              : "Ready to swap today?"}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "rgba(155,27,48,0.10)", border: "1px solid rgba(155,27,48,0.18)" }}
              >
                <s.icon size={16} style={{ color: "var(--burg-bright)" }} />
              </div>
              <div className="text-2xl font-black" style={{ color: "var(--text)" }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-3)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly challenge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 p-6 rounded-xl"
          style={{
            background: "rgba(200,169,110,0.04)",
            border: "1px solid rgba(200,169,110,0.14)"
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} style={{ color: "var(--coin)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--coin)" }}>
                  Weekly Challenge
                </span>
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>{WEEKLY_CHALLENGE.title}</h3>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Reward: {WEEKLY_CHALLENGE.reward}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: "var(--coin)" }}>
                {WEEKLY_CHALLENGE.current}/{WEEKLY_CHALLENGE.target}
              </div>
            </div>
          </div>
          <div className="rounded-full h-1.5" style={{ background: "rgba(200,169,110,0.12)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(WEEKLY_CHALLENGE.current / WEEKLY_CHALLENGE.target) * 100}%` }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-1.5 rounded-full"
              style={{ background: "linear-gradient(90deg, #C8A96E, #E4C890)" }}
            />
          </div>
        </motion.div>

        {/* My teaching skills */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black" style={{ color: "var(--text)" }}>My teaching skills</h2>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>{verifiedCount}/{teachSkills.length} verified</div>
          </div>

          {teachSkills.length === 0 ? (
            <div className="text-center py-10" style={{ color: "var(--text-3)" }}>
              <p className="text-sm mb-2">No teaching skills yet.</p>
              <Link href="/profile" className="text-sm" style={{ color: "var(--burg-bright)" }}>Add skills from your profile</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {teachSkills.map((skill, i) => {
                const progress         = Math.min(100, (skill.sessions_count / 10) * 100);
                const sessionsToExpert = Math.max(0, 10 - skill.sessions_count);
                const level            = skill.sessions_count >= 10 ? "Expert" : skill.sessions_count >= 5 ? "Mid-level" : "Beginner";

                return (
                  <motion.div
                    key={skill.skill_name}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                    className="p-4 rounded-xl"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getSkillEmoji(skill.skill_name)}</span>
                        <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>{skill.skill_name}</span>
                        {skill.is_verified && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-lg font-medium"
                            style={{ background: "rgba(155,27,48,0.10)", color: "#E07080", border: "1px solid rgba(155,27,48,0.20)" }}
                          >
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: "var(--text-3)" }}>{level}</span>
                        {!skill.is_verified && (
                          <Link
                            href={`/quiz?skill=${encodeURIComponent(skill.skill_name)}`}
                            className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all"
                            style={{ background: "rgba(155,27,48,0.08)", color: "var(--burg-bright)", border: "1px solid rgba(155,27,48,0.18)" }}
                          >
                            Get verified
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="rounded-full h-1.5 mb-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.9, delay: 0.6 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className="h-1.5 rounded-full"
                        style={{ background: "linear-gradient(90deg, #9B1B30, #4e6f85)" }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>
                      {skill.sessions_count} sessions taught
                      {sessionsToExpert > 0 && ` · ${sessionsToExpert} more to Expert`}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-black mb-4" style={{ color: "var(--text)" }}>Your certificates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative overflow-hidden p-5 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,169,110,0.08), rgba(155,27,48,0.04))",
                    border: "1px solid rgba(200,169,110,0.18)"
                  }}
                >
                  <div className="text-2xl mb-2">{getSkillEmoji(cert.skill_name)}</div>
                  <div className="font-black text-base mb-1" style={{ color: "var(--text)" }}>{cert.skill_name}</div>
                  <div className="text-xs mb-3" style={{ color: "var(--text-3)" }}>{cert.sessions_count} sessions completed</div>
                  <button
                    className="flex items-center gap-1.5 text-xs font-medium transition-all"
                    style={{ color: "var(--coin)" }}
                  >
                    <ExternalLink size={11} />
                    Share on LinkedIn
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/feed"
            className="p-5 rounded-xl transition-all"
            style={{ background: "rgba(155,27,48,0.06)", border: "1px solid rgba(155,27,48,0.14)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(155,27,48,0.10)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,27,48,0.24)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(155,27,48,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,27,48,0.14)";
            }}
          >
            <div className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Find matches</div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>Browse people to swap with</div>
          </Link>
          <Link
            href={`/quiz?skill=${encodeURIComponent(teachSkills[0]?.skill_name || "Python")}`}
            className="p-5 rounded-xl transition-all"
            style={{ background: "rgba(78,111,133,0.06)", border: "1px solid rgba(78,111,133,0.14)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(78,111,133,0.10)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(78,111,133,0.24)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(78,111,133,0.06)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(78,111,133,0.14)";
            }}
          >
            <div className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Get verified</div>
            <div className="text-xs" style={{ color: "var(--text-3)" }}>Take a skill quiz</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
