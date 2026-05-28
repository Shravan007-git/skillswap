"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Building2, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SKILL_CATEGORIES, getSkillEmoji } from "@/lib/utils";

const STEPS = ["Profile", "I can teach", "I want to learn"];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    user_type: "student" as "student" | "professional",
    college: "",
    company: "",
    city: "",
    bio: "",
  });
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);

  function toggleSkill(skill: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(skill) ? list.filter(s => s !== skill) : [...list, skill]);
  }

  async function finish() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      await supabase.from("profiles").update({
        full_name: profile.full_name,
        user_type: profile.user_type,
        college: profile.college,
        company: profile.company,
        city: profile.city,
        bio: profile.bio,
        onboarding_complete: true,
      }).eq("id", user.id);

      const skillInserts = [
        ...teachSkills.map(s => ({ user_id: user.id, skill_name: s, skill_type: "teach" as const, is_verified: false })),
        ...learnSkills.map(s => ({ user_id: user.id, skill_name: s, skill_type: "learn" as const, is_verified: false })),
      ];
      if (skillInserts.length > 0) {
        await supabase.from("user_skills").upsert(skillInserts, { onConflict: "user_id,skill_name,skill_type" });
      }
    } catch (e) {
      console.error("Onboarding error:", e);
    } finally {
      router.push("/feed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Top bar */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", boxShadow: "0 2px 12px rgba(155,27,48,0.45)" }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold gradient-text">Skill Swap</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                style={
                  i < step  ? { background: "rgba(155,27,48,0.20)", color: "#E07080", border: "1px solid rgba(155,27,48,0.30)" } :
                  i === step ? { background: "var(--burg)",          color: "white",   border: "1px solid var(--burg)" } :
                               { background: "rgba(255,255,255,0.05)", color: "var(--text-3)", border: "1px solid var(--border-soft)" }
                }
              >
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span
                className="text-sm font-medium hidden md:block"
                style={{ color: i === step ? "var(--text)" : "var(--text-3)" }}
              >{s}</span>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-px rounded-full transition-all"
                  style={{ background: i < step ? "rgba(155,27,48,0.40)" : "var(--border-soft)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>Set up your profile</h2>
              <p className="mb-8" style={{ color: "var(--text-2)" }}>This helps others know who they're swapping with.</p>

              <div className="space-y-5">
                {/* User type */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: "var(--text-2)" }}>I am a…</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["student", "professional"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setProfile(p => ({ ...p, user_type: t }))}
                        className="flex items-center gap-3 p-4 rounded-xl transition-all"
                        style={profile.user_type === t
                          ? { background: "rgba(155,27,48,0.12)", border: "1px solid rgba(155,27,48,0.30)", color: "var(--text)" }
                          : { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-soft)", color: "var(--text-2)" }
                        }
                      >
                        {t === "student" ? <GraduationCap size={19} /> : <Building2 size={19} />}
                        <span className="font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-2)" }}>Full name</label>
                  <input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Arjun Kumar" className="input-base" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-2)" }}>
                    {profile.user_type === "student" ? "College / University" : "Company"}
                  </label>
                  <input
                    value={profile.user_type === "student" ? profile.college : profile.company}
                    onChange={e => setProfile(p =>
                      p.user_type === "student" ? { ...p, college: e.target.value } : { ...p, company: e.target.value }
                    )}
                    placeholder={profile.user_type === "student" ? "IIT Delhi, BITS Pilani…" : "Google, TCS, startup…"}
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-2)" }}>City</label>
                  <input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Hyderabad, Bangalore, Delhi…" className="input-base" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-2)" }}>Short bio (optional)</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="CSE student who loves coding and wants to learn design…"
                    rows={3}
                    className="input-base resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>What can you teach?</h2>
              <p className="mb-2" style={{ color: "var(--text-2)" }}>Pick skills you're confident enough to teach someone else.</p>
              {teachSkills.length > 0 && (
                <p className="text-sm font-medium mb-6" style={{ color: "var(--burg-bright)" }}>{teachSkills.length} selected</p>
              )}
              {teachSkills.length === 0 && <div className="mb-6" />}

              <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                  <div key={cat}>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>{cat}</div>
                    <div className="flex flex-wrap gap-2">
                      {(skills as string[]).map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, teachSkills, setTeachSkills)}
                          className="skill-chip transition-all"
                          style={teachSkills.includes(skill)
                            ? { background: "rgba(155,27,48,0.18)", color: "#E07080", border: "1px solid rgba(155,27,48,0.36)", transform: "scale(1.04)" }
                            : { background: "rgba(255,255,255,0.03)", color: "var(--text-2)", border: "1px solid var(--border-soft)" }
                          }
                        >
                          {getSkillEmoji(skill)} {skill}
                          {teachSkills.includes(skill) && <Check size={11} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl font-black mb-2" style={{ color: "var(--text)" }}>What do you want to learn?</h2>
              <p className="mb-2" style={{ color: "var(--text-2)" }}>Pick skills you're excited to learn from someone else.</p>
              {learnSkills.length > 0 && (
                <p className="text-sm font-medium mb-6" style={{ color: "var(--steel)" }}>{learnSkills.length} selected</p>
              )}
              {learnSkills.length === 0 && <div className="mb-6" />}

              <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                  <div key={cat}>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>{cat}</div>
                    <div className="flex flex-wrap gap-2">
                      {(skills as string[]).map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, learnSkills, setLearnSkills)}
                          className="skill-chip transition-all"
                          style={learnSkills.includes(skill)
                            ? { background: "rgba(78,111,133,0.18)", color: "var(--steel)", border: "1px solid rgba(78,111,133,0.36)", transform: "scale(1.04)" }
                            : { background: "rgba(255,255,255,0.03)", color: "var(--text-2)", border: "1px solid var(--border-soft)" }
                          }
                        >
                          {getSkillEmoji(skill)} {skill}
                          {learnSkills.includes(skill) && <Check size={11} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all disabled:opacity-0 disabled:pointer-events-none"
          style={{ border: "1px solid var(--border-soft)", color: "var(--text-2)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 0 && !profile.full_name}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={17} />
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={saving || (teachSkills.length === 0 && learnSkills.length === 0)}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up…
              </span>
            ) : (
              <>Start swapping <ArrowRight size={17} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
