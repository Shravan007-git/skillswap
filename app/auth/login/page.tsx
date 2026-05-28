"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/feed");
      router.refresh();
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg)" }}>
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb animate-pulse-slow"
          style={{ width: 480, height: 480, top: "10%", left: "-15%", background: "radial-gradient(circle, rgba(155,27,48,0.10) 0%, transparent 70%)" }}
        />
        <div
          className="orb animate-pulse-slow"
          style={{ width: 360, height: 360, bottom: "10%", right: "-12%", background: "radial-gradient(circle, rgba(78,111,133,0.07) 0%, transparent 70%)", animationDelay: "1.5s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #9B1B30, #620018)", boxShadow: "0 2px 16px rgba(155,27,48,0.45)" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h5M9 8h5M8 2v5M8 9v5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight gradient-text">Skill Swap</span>
          </Link>
          <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text)" }}>Welcome back</h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>Sign in to continue swapping</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}
        >
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all mb-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-2)"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
            }}
          >
            <Chrome size={17} />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
            <span className="text-sm" style={{ color: "var(--text-3)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-soft)" }} />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="input-base pl-11"
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} />
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="input-base pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "var(--text-3)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div
                className="text-sm rounded-xl px-4 py-3"
                style={{ background: "rgba(155,27,48,0.10)", border: "1px solid rgba(155,27,48,0.22)", color: "#E07080" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: "0.85rem" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>Sign in <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-3)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-semibold transition-colors" style={{ color: "var(--burg-bright)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--burg-bright)"; }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
