"use client";

import { motion } from "framer-motion";
import { Flame, Star, Award, BookOpen, Trophy, Zap, ExternalLink } from "lucide-react";
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
  reward: "🏅 Rare badge + 50 coins",
  current: 1,
  target: 3,
};

export default function DashboardClient({ profile, mySkills, certificates, recentSessions, userId }: DashboardClientProps) {
  const teachSkills = mySkills.filter(s => s.skill_type === "teach");
  const learnSkills = mySkills.filter(s => s.skill_type === "learn");
  const verifiedCount = teachSkills.filter(s => s.is_verified).length;

  const stats = [
    { label: "Sessions taught", value: profile?.total_sessions_taught || 0, icon: BookOpen, color: "from-brand-400 to-brand-600" },
    { label: "Sessions learned", value: profile?.total_sessions_learned || 0, icon: Zap, color: "from-accent-400 to-accent-600" },
    { label: "Avg. rating", value: profile?.average_rating ? `${profile.average_rating} ★` : "—", icon: Star, color: "from-amber-400 to-amber-600" },
    { label: "Day streak", value: profile?.streak_days || 0, icon: Flame, color: "from-red-400 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-64 pb-20 md:pb-0 px-6 py-8 max-w-4xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black">
            Hey {profile?.full_name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            {profile?.streak_days > 0
              ? `You're on a ${profile.streak_days}-day streak 🔥`
              : "Ready to swap today?"}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Weekly challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={18} className="text-amber-400" />
                <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">Weekly Challenge</span>
              </div>
              <h3 className="text-lg font-bold">{WEEKLY_CHALLENGE.title}</h3>
              <p className="text-slate-400 text-sm mt-1">Reward: {WEEKLY_CHALLENGE.reward}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-amber-400">{WEEKLY_CHALLENGE.current}/{WEEKLY_CHALLENGE.target}</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(WEEKLY_CHALLENGE.current / WEEKLY_CHALLENGE.target) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
            />
          </div>
        </motion.div>

        {/* My skills with progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">My teaching skills</h2>
            <div className="text-sm text-slate-400">{verifiedCount}/{teachSkills.length} verified</div>
          </div>

          {teachSkills.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p>No teaching skills yet.</p>
              <Link href="/profile" className="text-brand-400 hover:text-brand-300 text-sm mt-2 inline-block">Add skills →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {teachSkills.map((skill, i) => {
                const sessionsToExpert = Math.max(0, 10 - skill.sessions_count);
                const progress = Math.min(100, (skill.sessions_count / 10) * 100);
                const level = skill.sessions_count >= 10 ? "Expert" : skill.sessions_count >= 5 ? "Intermediate" : "Beginner";

                return (
                  <motion.div
                    key={skill.skill_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{getSkillEmoji(skill.skill_name)}</span>
                        <span className="font-semibold">{skill.skill_name}</span>
                        {skill.is_verified && <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">✅ Verified</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{level}</span>
                        {!skill.is_verified && (
                          <Link
                            href={`/quiz?skill=${encodeURIComponent(skill.skill_name)}`}
                            className="text-xs bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full hover:bg-brand-500/30 transition-colors"
                          >
                            Get verified →
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.06 }}
                        className="h-1.5 rounded-full bg-gradient-to-r from-brand-400 to-accent-400"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {skill.sessions_count} sessions taught
                      {sessionsToExpert > 0 && ` · ${sessionsToExpert} to Expert`}
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
            <h2 className="text-xl font-black mb-4">🏆 Your certificates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative overflow-hidden p-5 rounded-2xl border border-amber-500/30"
                  style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,70,239,0.05))" }}
                >
                  <div className="absolute top-3 right-3 text-2xl">🏅</div>
                  <div className="text-2xl mb-2">{getSkillEmoji(cert.skill_name)}</div>
                  <div className="font-black text-lg">{cert.skill_name}</div>
                  <div className="text-sm text-slate-400 mt-1">{cert.sessions_count} sessions completed</div>
                  <button className="mt-3 flex items-center gap-2 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    <ExternalLink size={12} />
                    Share on LinkedIn
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/feed" className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 transition-all group">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-bold">Find matches</div>
            <div className="text-xs text-slate-400 mt-1">Browse people to swap with</div>
          </Link>
          <Link href={`/quiz?skill=${encodeURIComponent(teachSkills[0]?.skill_name || "Python")}`} className="p-5 rounded-2xl bg-accent-500/10 border border-accent-500/20 hover:bg-accent-500/20 transition-all">
            <div className="text-2xl mb-2">✅</div>
            <div className="font-bold">Get verified</div>
            <div className="text-xs text-slate-400 mt-1">Take a skill quiz</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
