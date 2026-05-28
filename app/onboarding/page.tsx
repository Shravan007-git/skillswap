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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").update({
      ...profile,
      onboarding_complete: true,
    }).eq("id", user.id);

    const skillInserts = [
      ...teachSkills.map(s => ({ user_id: user.id, skill_name: s, skill_type: "teach" as const })),
      ...learnSkills.map(s => ({ user_id: user.id, skill_name: s, skill_type: "learn" as const })),
    ];
    if (skillInserts.length > 0) {
      await supabase.from("user_skills").upsert(skillInserts, { onConflict: "user_id,skill_name,skill_type" });
    }

    router.push("/feed");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-10">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🔄</span>
          <span className="font-bold gradient-text text-xl">Skill Swap</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                i < step ? "bg-emerald-500 text-white" :
                i === step ? "bg-brand-500 text-white" :
                "bg-white/10 text-slate-500"
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden md:block ${i === step ? "text-white" : "text-slate-500"}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? "bg-emerald-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-black mb-2">Let&apos;s set up your profile</h2>
              <p className="text-slate-400 mb-8">This helps others know who they&apos;re swapping with.</p>

              <div className="space-y-5">
                {/* User type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["student", "professional"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setProfile(p => ({ ...p, user_type: t }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          profile.user_type === t
                            ? "border-brand-500 bg-brand-500/10 text-white"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        {t === "student" ? <GraduationCap size={20} /> : <Building2 size={20} />}
                        <span className="font-medium capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
                  <input
                    value={profile.full_name}
                    onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Arjun Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {profile.user_type === "student" ? "College / University" : "Company"}
                  </label>
                  <input
                    value={profile.user_type === "student" ? profile.college : profile.company}
                    onChange={e => setProfile(p =>
                      p.user_type === "student"
                        ? { ...p, college: e.target.value }
                        : { ...p, company: e.target.value }
                    )}
                    placeholder={profile.user_type === "student" ? "IIT Delhi, BITS Pilani…" : "Google, TCS, startup…"}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                  <input
                    value={profile.city}
                    onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                    placeholder="Hyderabad, Bangalore, Delhi…"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Short bio (optional)</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    placeholder="CSE student who loves coding and wants to learn design…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-black mb-2">What can you teach? 🎓</h2>
              <p className="text-slate-400 mb-2">Pick skills you&apos;re confident enough to teach someone else.</p>
              {teachSkills.length > 0 && (
                <p className="text-brand-400 text-sm font-medium mb-6">{teachSkills.length} selected</p>
              )}
              {teachSkills.length === 0 && <div className="mb-6" />}

              <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                  <div key={cat}>
                    <div className="text-sm font-semibold text-slate-400 mb-3">{cat}</div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, teachSkills, setTeachSkills)}
                          className={`skill-chip transition-all ${
                            teachSkills.includes(skill)
                              ? "bg-emerald-500 text-white border-emerald-500 scale-105"
                              : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/30"
                          }`}
                        >
                          {getSkillEmoji(skill)} {skill}
                          {teachSkills.includes(skill) && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-black mb-2">What do you want to learn? 🚀</h2>
              <p className="text-slate-400 mb-2">Pick skills you&apos;re excited to learn from someone else.</p>
              {learnSkills.length > 0 && (
                <p className="text-accent-400 text-sm font-medium mb-6">{learnSkills.length} selected</p>
              )}
              {learnSkills.length === 0 && <div className="mb-6" />}

              <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                {Object.entries(SKILL_CATEGORIES).map(([cat, skills]) => (
                  <div key={cat}>
                    <div className="text-sm font-semibold text-slate-400 mb-3">{cat}</div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill, learnSkills, setLearnSkills)}
                          className={`skill-chip transition-all ${
                            learnSkills.includes(skill)
                              ? "bg-accent-500 text-white border-accent-500 scale-105"
                              : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/30"
                          }`}
                        >
                          {getSkillEmoji(skill)} {skill}
                          {learnSkills.includes(skill) && <Check size={12} />}
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
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {step < 2 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 0 && !profile.full_name}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={18} />
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
              <>
                Start swapping 🚀
                <ArrowRight size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
