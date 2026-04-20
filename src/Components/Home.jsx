import { useState } from "react";

const API_URL = "http://localhost:5000/predict";

export function Home() {
    const [text, setText]         = useState("");
    const [result, setResult]     = useState(null);   // { prediction, label, confidence }
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res  = await fetch(API_URL, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong.");
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fillerTexts = ["Try a political headline", "Paste a viral story", "Enter a news article"];

    return (
        <section
            id="home"
            className="flex relative min-h-screen px-5 md:px-15 pt-20 pb-10 items-center justify-center w-full z-0 overflow-hidden"
        >
            <div className="relative flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-0">

                <div className="flex items-center gap-2 border border-(--accent)/30 px-5 py-1 rounded-full mb-10">
                    <span className="w-1.5 h-1.5 bg-(--accent) rounded-full" />
                    <span className="text-(--accent) font-dm-mono text-[0.7rem] tracking-wide font-medium capitalize">
                        AI-powered fact checking
                    </span>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-row items-center bg-(--card) border border-(--border) rounded-xl p-3.5 transition-all focus-within:border-gray-500 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)] shadow-lg mb-6"
                >
                    {/* Search icon */}
                    <div className="hidden sm:flex pl-3 pr-2 text-(--muted)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste a news article to analyze..."
                        className="flex-1 w-full bg-transparent border-none outline-none text-(--text) placeholder-(--muted) font-dm-sans min-w-0 px-2 py-3 text-base"
                    />

                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="w-auto mt-0 px-6 py-3 border border-(--border) hover:border-(--text)/50 rounded-lg sm:rounded-xl text-white font-dm-sans font-medium hover:bg-[rgba(255,255,255,0.08)] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 14,
                                        height: 14,
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTop: "2px solid white",
                                        borderRadius: "50%",
                                        animation: "spin 0.7s linear infinite",
                                    }}
                                />
                                Analyzing…
                            </span>
                        ) : (
                            "Analyze →"
                        )}
                    </button>
                </form>

                {/* ── Result card ─────────────────────────────────────────── */}
                {result && (
                    <div
                        style={{
                            width: "100%",
                            marginBottom: "1.5rem",
                            padding: "1.25rem 1.5rem",
                            borderRadius: "0.75rem",
                            border: `1px solid ${result.prediction ? "rgba(91,255,195,0.35)" : "rgba(255,107,107,0.35)"}`,
                            background: result.prediction
                                ? "rgba(91,255,195,0.06)"
                                : "rgba(255,107,107,0.06)",
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            animation: "fadeup 0.4s ease both",
                        }}
                    >
                        {/* Icon */}
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                background: result.prediction
                                    ? "rgba(91,255,195,0.15)"
                                    : "rgba(255,107,107,0.15)",
                            }}
                        >
                            {result.prediction ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5bffc3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1 }}>
                            <p
                                style={{
                                    fontFamily: "var(--font-syne, Syne, sans-serif)",
                                    fontWeight: 700,
                                    fontSize: "1.15rem",
                                    color: result.prediction ? "#5bffc3" : "#ff6b6b",
                                    marginBottom: "0.15rem",
                                }}
                            >
                                {result.prediction ? "✓ Real News" : "✗ Fake News"}
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                                    fontSize: "0.85rem",
                                    color: "#6a6a8a",
                                }}
                            >
                                Model confidence: <strong style={{ color: "#e8e8f0" }}>{result.confidence}%</strong>
                                &nbsp;·&nbsp;
                                Prediction: <strong style={{ color: "#e8e8f0" }}>{result.prediction ? "True" : "False"}</strong>
                            </p>
                        </div>
                    </div>
                )}

                {/* Error card */}
                {error && (
                    <div
                        style={{
                            width: "100%",
                            marginBottom: "1.5rem",
                            padding: "1rem 1.25rem",
                            borderRadius: "0.75rem",
                            border: "1px solid rgba(255,209,102,0.35)",
                            background: "rgba(255,209,102,0.06)",
                            color: "#ffd166",
                            fontFamily: "var(--font-dm-sans, DM Sans, sans-serif)",
                            fontSize: "0.875rem",
                            animation: "fadeup 0.4s ease both",
                        }}
                    >
                        ⚠ {error}
                    </div>
                )}

                <h1 className="text-(--text) font-syne text-2xl font-bold text-center leading-[1.1] tracking-tight">
                    Stop <span className="text-(--accent)">fake news</span> before it
                    <br className="hidden sm:block" /> spreads
                </h1>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                    {fillerTexts.map((t) => (
                        <button
                            key={t}
                            onClick={() => setText(t)}
                            className="px-6 py-1 rounded-full border border-(--border) bg-(--card) text-(--muted) text-[0.8rem] font-dm-sans hover:text-(--text) hover:border-(--muted) transition-colors cursor-pointer"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* spinner keyframe */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </section>
    );
}