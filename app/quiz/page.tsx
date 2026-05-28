"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getSkillEmoji } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const skill = searchParams.get("skill") || "";
  const supabase = createClient();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!skill) return;
    fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill }),
    })
      .then(r => r.json())
      .then(d => {
        setQuestions(d.questions || []);
        setLoading(false);
      });
  }, [skill]);

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setRevealed(false);
    setSelected(null);

    if (current + 1 >= questions.length) {
      // Calculate score and finish
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      setFinished(true);
      saveResult(score, newAnswers);
    } else {
      setCurrent(c => c + 1);
    }
  }

  async function saveResult(score: number, finalAnswers: (number | null)[]) {
    setSaving(true);
    const passed = score >= 3;
    const { data: { user } } = await supabase.auth.getUser();
    if (user && passed) {
      await supabase.from("user_skills")
        .upsert({
          user_id: user.id,
          skill_name: skill,
          skill_type: "teach",
          is_verified: true,
          level: score === 5 ? "expert" : score === 4 ? "intermediate" : "beginner",
        }, { onConflict: "user_id,skill_name,skill_type" });
    }
    setSaving(false);
  }

  const score = answers.filter((a, i) => a === questions[i]?.correct).length;
  const passed = finished && score >= 3;

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-brand-400 mx-auto mb-4" />
        <p className="text-slate-400">Generating your {skill} quiz…</p>
        <p className="text-slate-600 text-sm mt-2">Claude is crafting 5 smart questions</p>
      </div>
    </div>
  );

  if (finished) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="text-6xl mb-6">{passed ? "🏆" : "😅"}</div>
        <h2 className="text-3xl font-black mb-3">
          {passed ? "You're verified!" : "Not quite yet"}
        </h2>
        <p className="text-slate-400 mb-6">
          You scored <span className="text-white font-bold">{score}/5</span> on the {skill} quiz.
          {passed
            ? " You've earned the Verified badge! 🎉"
            : " Score 3+ to get verified. Try again!"}
        </p>

        {/* Score bar */}
        <div className="bg-white/5 rounded-full h-3 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${passed ? "bg-gradient-to-r from-emerald-400 to-brand-400" : "bg-gradient-to-r from-red-400 to-amber-400"}`}
          />
        </div>

        {passed && (
          <div className="flex items-center justify-center gap-2 mb-8 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <Check size={18} />
            <span className="font-semibold">{getSkillEmoji(skill)} {skill} — Verified ✅</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            Back to profile
          </button>
          {!passed && (
            <button
              onClick={() => { setCurrent(0); setAnswers([]); setSelected(null); setFinished(false); setLoading(true);
                fetch("/api/quiz/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skill }) })
                  .then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); });
              }}
              className="flex-1 btn-primary py-3"
            >
              Try again
            </button>
          )}
          {passed && (
            <button onClick={() => router.push("/feed")} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
              Go to feed <ArrowRight size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );

  const q = questions[current];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{getSkillEmoji(skill)}</div>
          <h2 className="text-2xl font-black">{skill} Verification</h2>
          <p className="text-slate-400 text-sm mt-1">Question {current + 1} of {questions.length}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              i < current ? "bg-emerald-400" :
              i === current ? "bg-brand-400 scale-125" :
              "bg-white/20"
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Question */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
              <p className="text-lg font-medium leading-relaxed">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = i === q.correct;
                const showResult = revealed;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium ${
                      showResult && isCorrect
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                        : showResult && isSelected && !isCorrect
                        ? "border-red-500 bg-red-500/20 text-red-300"
                        : isSelected
                        ? "border-brand-500 bg-brand-500/20 text-brand-300"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      {opt}
                      {showResult && isCorrect && <Check size={18} className="text-emerald-400" />}
                      {showResult && isSelected && !isCorrect && <X size={18} className="text-red-400" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action button */}
        <div className="mt-8 flex justify-end">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              disabled={selected === null}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check answer
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary px-8 py-3 flex items-center gap-2">
              {current + 1 === questions.length ? (
                <><Trophy size={18} /> See results</>
              ) : (
                <>Next <ArrowRight size={18} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-brand-400" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
