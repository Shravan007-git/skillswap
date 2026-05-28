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
  const router       = useRouter();
  const skill        = searchParams.get("skill") || "";
  const supabase     = createClient();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading]     = useState(true);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [answers, setAnswers]     = useState<(number | null)[]>([]);
  const [revealed, setRevealed]   = useState(false);
  const [finished, setFinished]   = useState(false);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (!skill) return;
    fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill }),
    })
      .then(r => r.json())
      .then(d => { setQuestions(d.questions || []); setLoading(false); });
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
      const score = newAnswers.filter((a, i) => a === questions[i].correct).length;
      setFinished(true);
      saveResult(score);
    } else {
      setCurrent(c => c + 1);
    }
  }

  async function saveResult(score: number) {
    setSaving(true);
    const passed = score >= 3;
    const { data: { user } } = await supabase.auth.getUser();
    if (user && passed) {
      await supabase.from("user_skills").upsert({
        user_id: user.id,
        skill_name: skill,
        skill_type: "teach",
        is_verified: true,
        level: score === 5 ? "expert" : score === 4 ? "intermediate" : "beginner",
      }, { onConflict: "user_id,skill_name,skill_type" });
    }
    setSaving(false);
  }

  const score  = answers.filter((a, i) => a === questions[i]?.correct).length;
  const passed = finished && score >= 3;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="text-center">
        <Loader2 size={44} className="animate-spin mx-auto mb-4" style={{ color: "var(--burg-bright)" }} />
        <p className="text-sm" style={{ color: "var(--text-2)" }}>Generating your {skill} quiz…</p>
        <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>Crafting 5 skill-check questions</p>
      </div>
    </div>
  );

  if (finished) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center"
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
          style={{
            background: passed ? "rgba(155,27,48,0.12)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${passed ? "rgba(155,27,48,0.28)" : "var(--border-soft)"}`
          }}
        >
          {passed ? <Trophy size={36} style={{ color: "var(--coin)" }} /> : <span>—</span>}
        </div>

        <h2 className="text-3xl font-black mb-3" style={{ color: "var(--text)" }}>
          {passed ? "You're verified!" : "Not quite yet"}
        </h2>
        <p className="mb-6" style={{ color: "var(--text-2)" }}>
          You scored{" "}
          <span className="font-bold" style={{ color: "var(--text)" }}>{score}/5</span>
          {" "}on the {skill} quiz.
          {passed ? " Your verified badge is live." : " Score 3 or more to get verified."}
        </p>

        {/* Score bar */}
        <div className="rounded-full h-2.5 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="h-2.5 rounded-full"
            style={{ background: passed ? "linear-gradient(90deg, #9B1B30, #C8A96E)" : "linear-gradient(90deg, #4e6f85, #8896A6)" }}
          />
        </div>

        {passed && (
          <div
            className="flex items-center justify-center gap-2 mb-8 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(155,27,48,0.10)", border: "1px solid rgba(155,27,48,0.24)", color: "#E07080" }}
          >
            <Check size={16} />
            {getSkillEmoji(skill)} {skill} — Verified
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl transition-all text-sm font-medium"
            style={{ border: "1px solid var(--border-soft)", color: "var(--text-2)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}
          >
            Back to profile
          </button>
          {!passed && (
            <button
              onClick={() => {
                setCurrent(0); setAnswers([]); setSelected(null); setFinished(false); setLoading(true);
                fetch("/api/quiz/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skill }) })
                  .then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); });
              }}
              className="flex-1 btn-primary py-3 text-sm"
            >
              Try again
            </button>
          )}
          {passed && (
            <button
              onClick={() => router.push("/feed")}
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 text-sm"
            >
              Go to feed <ArrowRight size={15} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );

  const q = questions[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">{getSkillEmoji(skill)}</div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "var(--text)" }}>{skill} Verification</h2>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>Question {current + 1} of {questions.length}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i < current ? "rgba(155,27,48,0.6)" : i === current ? "var(--burg-bright)" : "rgba(255,255,255,0.12)",
                transform: i === current ? "scale(1.35)" : "scale(1)"
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Question */}
            <div
              className="p-6 rounded-xl mb-5"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
            >
              <p className="text-base font-medium leading-relaxed" style={{ color: "var(--text)" }}>{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect  = i === q.correct;
                const showResult = revealed;

                let optStyle: React.CSSProperties;
                if (showResult && isCorrect) {
                  optStyle = { background: "rgba(155,27,48,0.14)", border: "1px solid rgba(155,27,48,0.32)", color: "#E07080" };
                } else if (showResult && isSelected && !isCorrect) {
                  optStyle = { background: "rgba(78,111,133,0.10)", border: "1px solid rgba(78,111,133,0.28)", color: "var(--steel)" };
                } else if (isSelected) {
                  optStyle = { background: "rgba(155,27,48,0.08)", border: "1px solid rgba(155,27,48,0.28)", color: "var(--text)" };
                } else {
                  optStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-soft)", color: "var(--text-2)" };
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className="w-full text-left px-5 py-4 rounded-xl transition-all font-medium text-sm"
                    style={optStyle}
                    onMouseEnter={e => {
                      if (!isSelected && !revealed) {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(155,27,48,0.24)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected && !revealed) {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                      }
                    }}
                  >
                    <span className="flex items-center justify-between">
                      {opt}
                      {showResult && isCorrect  && <Check size={16} style={{ color: "#E07080" }} />}
                      {showResult && isSelected && !isCorrect && <X size={16} style={{ color: "var(--steel)" }} />}
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
              className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: "0.75rem 2rem" }}
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
              style={{ padding: "0.75rem 2rem" }}
            >
              {current + 1 === questions.length ? (
                <><Trophy size={16} /> See results</>
              ) : (
                <>Next <ArrowRight size={16} /></>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <Loader2 size={44} className="animate-spin" style={{ color: "var(--burg-bright)" }} />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
