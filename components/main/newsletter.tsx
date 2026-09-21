"use client";

import { Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";

const NewsletterComponent = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to subscribe. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      setErrorMessage(msg);
    }
  };

  return (
    <section id="newsletter" className="w-full py-12 md:py-16 scroll-mt-20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-slate-50 dark:bg-zinc-900 dark:border dark:border-zinc-800 p-8 sm:p-12 shadow-xl">
        {/* Subtle background glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Newsletter</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            High Contrast Newsletter
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
            Get practical engineering leadership thoughts, architectural patterns,
            and writing craftsmanship delivered straight to your inbox every two weeks.
          </p>

          {status === "success" ? (
            <div className="flex items-center gap-2 px-6 py-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-medium mt-4 animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>You&apos;re in! Check your inbox for the confirmation note.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md mt-4 flex flex-col sm:flex-row items-center gap-2.5"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all shrink-0 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-2">
            Zero spam. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterComponent;
