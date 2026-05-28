"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Send, Check } from "lucide-react";
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
  const [search, setSearch]       = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);
  const [requested, setRequested]   = useState<Set<string>>(new Set());

  const myTeach = mySkills.filter(s => s.skill_type === "teach").map(s => s.skill_name);
  const myLearn = mySkills.filter(s => s.skill_type === "learn").map(s => s.skill_name);

  const matches = allUsers
    .map(u => {
      const theirTeach  = u.user_skills?.filter(s => s.skill_type === "teach").map(s => s.skill_name) || [];
      const theirLearn  = u.user_skills?.filter(s => s.skill_type === "learn").map(s => s.skill_name) || [];
      const teachOverlap = myLearn.filter(s => theirTeach.includes(s));
      const learnOverlap = myTeach.filter(s => theirLearn.includes(s));
      const compat       = calculateCompatibility(myTeach, myLearn, theirTeach, theirLearn);
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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-56 pb-20 md:pb-0">
        {/* Sticky search header */}
        <div
          className="sticky top-0 z-30 px-6 py-4"
          style={{
            background: "rgba(8,12,16,0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-soft)"
          }}
        >
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or skill…"
                className="input-base pl-10 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">

          {/* My skills summary */}
          {(myTeach.length > 0 || myLearn.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-5 rounded-xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              <div className="flex flex-wrap gap-6">
                {myTeach.length > 0 && (
                  <div>
                    <p className="section-label mb-2.5">I can teach</p>
                    <div className="flex flex-wrap gap-2">
                      {myTeach.slice(0, 4).map(s => (
                        <span key={s} className="skill-chip skill-chip-teach">
                          {getSkillEmoji(s)} {s}
                          {mySkills.find(ms => ms.skill_name === s && ms.skill_type === "teach")?.is_verified && (
                            <span style={{ color: "var(--burg-bright)" }}>✓</span>
                          )}
                        </span>
                      ))}
                      {myTeach.length > 4 && <span className="text-sm" style={{ color: "var(--text-3)" }}>+{myTeach.length - 4}</span>}
                    </div>
                  </div>
                )}
                {myLearn.length > 0 && (
                  <div>
                    <p className="section-label mb-2.5">I want to learn</p>
                    <div className="flex flex-wrap gap-2">
                      {myLearn.slice(0, 4).map(s => (
                        <span key={s} className="skill-chip skill-chip-learn">
                          {getSkillEmoji(s)} {s}
                        </span>
                      ))}
                      {myLearn.length > 4 && <span className="text-sm" style={{ color: "var(--text-3)" }}>+{myLearn.length - 4}</span>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>Your matches</h1>
              <p className="text-sm" style={{ color: "var(--text-2)" }}>{filtered.length} people want to swap with you</p>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: "var(--text-3)" }}>
              <div className="text-4xl mb-4 opacity-30">
                <Search size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-2)" }}>No matches yet</h3>
              <p className="text-sm mb-6">Update your skills to find better matches.</p>
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
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="card p-5"
                >
                  {/* User header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", color: "white" }}
                    >
                      {u.full_name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate" style={{ color: "var(--text)" }}>
                        {u.full_name || "Anonymous"}
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                        {(u.college || u.company) && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={10} />
                            {u.college || u.company}
                          </span>
                        )}
                        {u.average_rating > 0 && (
                          <span className="flex items-center gap-1" style={{ color: "var(--coin)" }}>
                            <Star size={10} fill="currentColor" />
                            {u.average_rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-black gradient-text">{compat}%</div>
                      <div className="text-xs" style={{ color: "var(--text-3)" }}>match</div>
                    </div>
                  </div>

                  {/* Skill overlap panels */}
                  <div className="flex gap-2 mb-4">
                    {learnOverlap.length > 0 && (
                      <div
                        className="flex-1 p-3 rounded-xl"
                        style={{ background: "rgba(155,27,48,0.06)", border: "1px solid rgba(155,27,48,0.14)" }}
                      >
                        <p className="text-xs mb-2 font-medium" style={{ color: "var(--burg-bright)" }}>They teach you</p>
                        <div className="flex flex-wrap gap-1">
                          {learnOverlap.slice(0, 2).map(s => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-lg"
                              style={{ background: "rgba(155,27,48,0.12)", color: "#E07080", border: "1px solid rgba(155,27,48,0.20)" }}
                            >
                              {getSkillEmoji(s)} {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {teachOverlap.length > 0 && (
                      <div
                        className="flex-1 p-3 rounded-xl"
                        style={{ background: "rgba(78,111,133,0.06)", border: "1px solid rgba(78,111,133,0.14)" }}
                      >
                        <p className="text-xs mb-2 font-medium" style={{ color: "var(--steel)" }}>You teach them</p>
                        <div className="flex flex-wrap gap-1">
                          {teachOverlap.slice(0, 2).map(s => (
                            <span
                              key={s}
                              className="text-xs px-2 py-0.5 rounded-lg"
                              style={{ background: "rgba(78,111,133,0.12)", color: "var(--steel)", border: "1px solid rgba(78,111,133,0.20)" }}
                            >
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
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={requested.has(u.id)
                        ? { background: "rgba(155,27,48,0.10)", color: "#E07080", border: "1px solid rgba(155,27,48,0.22)" }
                        : undefined
                      }
                    >
                      {requesting === u.id ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : requested.has(u.id) ? (
                        <><Check size={13} /> Requested</>
                      ) : (
                        <span className="btn-primary w-full flex items-center justify-center gap-2" style={{ padding: "0.6rem" }}>
                          <Send size={13} /> Request Swap
                        </span>
                      )}
                    </button>
                    <Link
                      href={`/profile/${u.id}`}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: "var(--bg-card-2)", border: "1px solid var(--border-soft)", color: "var(--text-2)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
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
