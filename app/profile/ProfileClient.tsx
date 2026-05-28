"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Edit2, Check, Plus, X, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import type { Profile } from "@/lib/types";
import { getSkillEmoji, SKILL_CATEGORIES } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface ProfileClientProps {
  profile: Profile;
  mySkills: { skill_name: string; skill_type: string; is_verified: boolean; sessions_count: number }[];
  ratings: { id: string; stars: number; review?: string; rater: { full_name: string } | null }[];
  userId: string;
}

export default function ProfileClient({ profile, mySkills, ratings, userId }: ProfileClientProps) {
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [addingSkill, setAddingSkill] = useState<"teach" | "learn" | null>(null);
  const [saving, setSaving] = useState(false);
  const [localSkills, setLocalSkills] = useState(mySkills);

  const teachSkills = localSkills.filter(s => s.skill_type === "teach");
  const learnSkills = localSkills.filter(s => s.skill_type === "learn");

  async function saveBio() {
    setSaving(true);
    await supabase.from("profiles").update({ bio }).eq("id", userId);
    setSaving(false);
    setEditing(false);
  }

  async function addSkill(skill: string, type: "teach" | "learn") {
    if (localSkills.find(s => s.skill_name === skill && s.skill_type === type)) return;
    await supabase.from("user_skills").upsert({
      user_id: userId,
      skill_name: skill,
      skill_type: type,
      is_verified: false,
    }, { onConflict: "user_id,skill_name,skill_type" });
    setLocalSkills(prev => [...prev, { skill_name: skill, skill_type: type, is_verified: false, sessions_count: 0 }]);
    setAddingSkill(null);
  }

  async function removeSkill(skill: string, type: string) {
    await supabase.from("user_skills").delete()
      .eq("user_id", userId).eq("skill_name", skill).eq("skill_type", type);
    setLocalSkills(prev => prev.filter(s => !(s.skill_name === skill && s.skill_type === type)));
  }

  const avgStars = ratings.length
    ? (ratings.reduce((a, r) => a + r.stars, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-64 pb-20 md:pb-0 px-6 py-8 max-w-3xl mx-auto">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-3xl font-black flex-shrink-0">
              {profile?.full_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black">{profile?.full_name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                {(profile?.college || profile?.company) && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {profile.college || profile.company}
                  </span>
                )}
                {profile?.city && <span>{profile.city}</span>}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {avgStars && (
                  <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                    <Star size={14} fill="currentColor" />
                    {avgStars} ({ratings.length} reviews)
                  </span>
                )}
                <span className="coin-badge">🪙 {profile?.swapcoin_balance || 0}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-5">
            {editing ? (
              <div className="flex gap-2">
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Write a short bio…"
                  rows={2}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm resize-none"
                />
                <div className="flex flex-col gap-2">
                  <button onClick={saveBio} disabled={saving} className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all">
                    {saving ? <span className="w-4 h-4 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin inline-block" /> : <Check size={16} />}
                  </button>
                  <button onClick={() => setEditing(false)} className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-all">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-slate-400 text-sm flex-1">{bio || "Add a short bio to tell others about yourself."}</p>
                <button onClick={() => setEditing(true)} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all flex-shrink-0">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skills sections */}
        {[
          { type: "teach" as const, skills: teachSkills, label: "Skills I can teach", color: "emerald", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
          { type: "learn" as const, skills: learnSkills, label: "Skills I want to learn", color: "violet", bg: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
        ].map(section => (
          <motion.div
            key={section.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black">{section.label}</h2>
              <button
                onClick={() => setAddingSkill(section.type)}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {section.skills.map(skill => (
                <div key={skill.skill_name} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${section.bg} text-sm font-medium`}>
                  <span>{getSkillEmoji(skill.skill_name)}</span>
                  <span>{skill.skill_name}</span>
                  {skill.is_verified && <span className="text-xs">✅</span>}
                  {section.type === "teach" && !skill.is_verified && (
                    <Link href={`/quiz?skill=${encodeURIComponent(skill.skill_name)}`} className="text-xs opacity-70 hover:opacity-100">verify→</Link>
                  )}
                  <button onClick={() => removeSkill(skill.skill_name, section.type)} className="opacity-50 hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {section.skills.length === 0 && (
                <p className="text-slate-500 text-sm">No skills added yet.</p>
              )}
            </div>

            {/* Add skill picker */}
            <AnimatePresence>
              {addingSkill === section.type && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-slate-300">Pick a skill</p>
                      <button onClick={() => setAddingSkill(null)} className="text-slate-500 hover:text-white">
                        <X size={16} />
                      </button>
                    </div>
                    {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                      <div key={cat} className="mb-4">
                        <p className="text-xs text-slate-500 mb-2">{cat}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills
                            .filter(s => !localSkills.find(ls => ls.skill_name === s && ls.skill_type === section.type))
                            .map(s => (
                              <button
                                key={s}
                                onClick={() => addSkill(s, section.type)}
                                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all"
                              >
                                {getSkillEmoji(s)} {s}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Reviews */}
        {ratings.length > 0 && (
          <div>
            <h2 className="text-xl font-black mb-4">Reviews</h2>
            <div className="space-y-3">
              {ratings.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{r.rater?.full_name || "Anonymous"}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} fill={j < r.stars ? "#f59e0b" : "none"} className={j < r.stars ? "text-amber-400" : "text-slate-600"} />
                      ))}
                    </div>
                  </div>
                  {r.review && <p className="text-slate-400 text-sm">{r.review}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
