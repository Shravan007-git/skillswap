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
  const [editing, setEditing]       = useState(false);
  const [bio, setBio]               = useState(profile?.bio || "");
  const [addingSkill, setAddingSkill] = useState<"teach" | "learn" | null>(null);
  const [saving, setSaving]         = useState(false);
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
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar coins={profile?.swapcoin_balance || 0} />

      <main className="md:ml-56 pb-20 md:pb-0 px-6 py-8 max-w-2xl mx-auto">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", color: "white" }}
            >
              {profile?.full_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>{profile?.full_name}</h1>
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--text-3)" }}>
                {(profile?.college || profile?.company) && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {profile.college || profile.company}
                  </span>
                )}
                {profile?.city && <span>{profile.city}</span>}
              </div>
              <div className="flex items-center gap-3">
                {avgStars && (
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--coin)" }}>
                    <Star size={13} fill="currentColor" />
                    {avgStars}
                    <span style={{ color: "var(--text-3)", fontWeight: 400 }}>({ratings.length} reviews)</span>
                  </span>
                )}
                <div className="coin-badge">{profile?.swapcoin_balance || 0} coins</div>
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
                  className="input-base text-sm resize-none"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={saveBio}
                    disabled={saving}
                    className="p-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(155,27,48,0.12)", color: "#E07080", border: "1px solid rgba(155,27,48,0.22)" }}
                  >
                    {saving
                      ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                      : <Check size={15} />
                    }
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="p-2.5 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-3)", border: "1px solid var(--border-soft)" }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm flex-1 leading-relaxed" style={{ color: bio ? "var(--text-2)" : "var(--text-3)" }}>
                  {bio || "Add a short bio to tell others about yourself."}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="p-2 rounded-lg transition-all flex-shrink-0"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Skills sections */}
        {([
          { type: "teach" as const, skills: teachSkills, label: "Skills I can teach" },
          { type: "learn" as const, skills: learnSkills, label: "Skills I want to learn" },
        ] as const).map(section => (
          <motion.div
            key={section.type}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{section.label}</h2>
              <button
                onClick={() => setAddingSkill(section.type)}
                className="flex items-center gap-1 text-xs font-medium transition-all"
                style={{ color: "var(--text-3)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {section.skills.map(skill => (
                <div
                  key={skill.skill_name}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                    section.type === "teach" ? "skill-chip-teach" : "skill-chip-learn"
                  }`}
                >
                  <span>{getSkillEmoji(skill.skill_name)}</span>
                  <span>{skill.skill_name}</span>
                  {skill.is_verified && (
                    <span className="text-xs font-semibold" style={{ color: "var(--burg-bright)" }}>✓</span>
                  )}
                  {section.type === "teach" && !skill.is_verified && (
                    <Link
                      href={`/quiz?skill=${encodeURIComponent(skill.skill_name)}`}
                      className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--burg-bright)" }}
                    >
                      verify
                    </Link>
                  )}
                  <button
                    onClick={() => removeSkill(skill.skill_name, section.type)}
                    className="opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {section.skills.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-3)" }}>No skills added yet.</p>
              )}
            </div>

            {/* Skill picker */}
            <AnimatePresence>
              {addingSkill === section.type && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-4 rounded-xl max-h-64 overflow-y-auto"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>Pick a skill</p>
                      <button onClick={() => setAddingSkill(null)} style={{ color: "var(--text-3)" }}>
                        <X size={15} />
                      </button>
                    </div>
                    {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                      <div key={cat} className="mb-4">
                        <p className="text-xs mb-2 font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>{cat}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(skills as string[])
                            .filter(s => !localSkills.find(ls => ls.skill_name === s && ls.skill_type === section.type))
                            .map(s => (
                              <button
                                key={s}
                                onClick={() => addSkill(s, section.type)}
                                className="text-xs px-2.5 py-1 rounded-lg transition-all"
                                style={{
                                  background: "rgba(255,255,255,0.03)",
                                  border: "1px solid var(--border-soft)",
                                  color: "var(--text-2)"
                                }}
                                onMouseEnter={e => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,27,48,0.28)";
                                  (e.currentTarget as HTMLElement).style.color = "var(--text)";
                                }}
                                onMouseLeave={e => {
                                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
                                  (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                                }}
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
            <h2 className="text-base font-black mb-4" style={{ color: "var(--text)" }}>Reviews</h2>
            <div className="space-y-3">
              {ratings.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {r.rater?.full_name || "Anonymous"}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          size={13}
                          fill={j < r.stars ? "currentColor" : "none"}
                          style={{ color: j < r.stars ? "var(--coin)" : "var(--text-3)" }}
                        />
                      ))}
                    </div>
                  </div>
                  {r.review && <p className="text-sm" style={{ color: "var(--text-2)" }}>{r.review}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
