"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, MapPin, Zap, Send, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getSkillEmoji, calculateCompatibility } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface FeedClientProps {
  profile: Profile;
  mySkills: { skill_name: string; skill_type: string; is_verified: boolean }[];
  allUsers: (Profile & { user_skills: { skill_name: string; skill_type: string }[] })[];
}

export default function FeedClient({ profile, mySkills, allUsers }: FeedClientProps) {
  const supabase = createClient();
  const [search, setSearch] = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const myTeach = mySkills.filter(s => s.skill_type === "teach").map(s => s.skill_name);
  const myLearn = mySkills.filter(s => s.skill_type === "learn").map(s => s.skill_name);

  const matches = allUsers
    .map(u => {
      const theirTeach = u.user_skills?.filter(s => s.skill_type === "teach").map(s => s.skill_name) || [];
      const theirLearn = u.user_skills?.filter(s => s.skill_type === "learn").map(s => s.skill_name) || [];
      const teachOverlap = myLearn.filter(s => theirTeach.includes(s));
      const learnOverlap = myTeach.filter(s => theirLearn.includes(s));
      const compat = calculateCompatibility(myTeach, myLearn, theirTeach, theirLearn);
      return { user: u, teachOverlap, learnOverlap, compat };
    })
    .filter(m => m.teachOverlap.length + m.learnOverlap.length > 0 || allUsers.length < 10)
    .sort((a, b) => b.compat - a.compat);

  const filtered = matches.filter(m =>
    !search ||
    m.user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    m.teachOverlap.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    m.learnOverlap.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  async function requestSwap(toUserId: string, skillOffered: string, skillWanted: string) {
    setRequesting(toUserId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("swap_requests").insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      skill_offered: skillOffered,
      skill_wanted: skillWanted,
      message: `Hey! I'd love to swap ${skillOffered} for ${skillWanted}. Let's connect!`,
    });

    setRequested(prev => new Set([...prev, toUserId]));
    setRequesting(null);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-64 pb-20 md:pb-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-white/10 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or skill…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm transition-all"
              />
            </div>
            <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* My skills summary */}
          {(myTeach.length > 0 || myLearn.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">I can teach</p>
                  <div className="flex flex-wrap gap-2">
                    {myTeach.slice(0, 4).map(s => (
                      <span key={s} className="skill-chip skill-chip-teach">
                        {getSkillEmoji(s)} {s}
                        {mySkills.find(ms => ms.skill_name === s && ms.skill_type === "teach")?.is_verified && " ✅"}
                      </span>
                    ))}
                    {myTeach.length > 4 && <span className="text-slate-400 text-sm">+{myTeach.length - 4} more</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">I want to learn</p>
                  <div className="flex flex-wrap gap-2">
                    {myLearn.slice(0, 4).map(s => (
                      <span key={s} className="skill-chip skill-chip-learn">
                        {getSkillEmoji(s)} {s}
                      </span>
                    ))}
                    {myLearn.length > 4 && <span className="text-slate-400 text-sm">+{myLearn.length - 4} more</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">Your matches</h1>
              <p className="text-slate-400 text-sm mt-1">{filtered.length} people want to swap with you</p>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No matches yet</h3>
              <p className="text-slate-400 mb-6">Invite friends or update your skills to find matches.</p>
              <Link href="/profile" className="btn-primary inline-flex">Update my skills</Link>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {filtered.map(({ user: u, teachOverlap, learnOverlap, compat }, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card-hover p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/30"
                >
                  {/* User header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {u.full_name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{u.full_name || "Anonymous"}</div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {(u.college || u.company) && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={11} />
                            {u.college || u.company}
                          </span>
                        )}
                        {u.average_rating > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star size={11} fill="currentColor" />
                            {u.average_rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-black gradient-text">{compat}%</div>
                      <div className="text-xs text-slate-500">match</div>
                    </div>
                  </div>

                  {/* Swap preview */}
                  <div className="flex gap-3 mb-4">
                    {learnOverlap.length > 0 && (
                      <div className="flex-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 mb-2 font-medium">They teach you</p>
                        <div className="flex flex-wrap gap-1">
                          {learnOverlap.slice(0, 2).map(s => (
                            <span key={s} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                              {getSkillEmoji(s)} {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {teachOverlap.length > 0 && (
                      <div className="flex-1 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs text-violet-400 mb-2 font-medium">You teach them</p>
                        <div className="flex flex-wrap gap-1">
                          {teachOverlap.slice(0, 2).map(s => (
                            <span key={s} className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full">
                              {getSkillEmoji(s)} {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => requestSwap(
                        u.id,
                        learnOverlap[0] || myTeach[0] || "",
                        teachOverlap[0] || myLearn[0] || ""
                      )}
                      disabled={!!requesting || requested.has(u.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        requested.has(u.id)
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "btn-primary"
                      }`}
                    >
                      {requesting === u.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : requested.has(u.id) ? (
                        <><Check size={14} /> Requested</>
                      ) : (
                        <><Send size={14} /> Request Swap</>
                      )}
                    </button>
                    <Link
                      href={`/profile/${u.id}`}
                      className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all"
                    >
                      View
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
