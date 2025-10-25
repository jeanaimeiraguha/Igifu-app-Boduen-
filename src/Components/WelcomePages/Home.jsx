import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";

/**
 * Helper: 3D tilt on hover using mouse position
 */
function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [8, -8]);
  const rotateY = useTransform(x, [-50, 50], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX / 3);
    y.set(relY / 3);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated stat/number counter
 */
function useCounter(target = 0, duration = 1.2) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      setValue(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ====================================================================================
// --- Igifu Digital Card: Holographic, animated, dark/light-aware, reduced-motion friendly
// ====================================================================================
function IgifuDigitalCard({ startBalance = 25000, name = "Student Name", campus = "Kigali Campus" }) {
  const shouldReduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [mouse, setMouse] = useState({ x: 160, y: 110 });
  const [ripple, setRipple] = useState(null);
  const cardRef = useRef(null);

  // Animated balance counter
  const balance = useCounter(startBalance, 1.2);

  // Random sparkles around the card
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 2,
        dur: 2 + Math.random() * 2.5,
      })),
    []
  );

  // Simple QR data matrix (static per mount)
  const qr = useMemo(
    () =>
      Array.from({ length: 18 }, () =>
        Array.from({ length: 18 }, () => Math.random() > 0.52)
      ),
    []
  );

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const handlePointerDown = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const id = Date.now();
    setRipple({ id, x, y });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Floating sparkles */}
      {!shouldReduce && (
        <div className="pointer-events-none absolute -inset-8 z-0">
          {sparkles.map((s) => (
            <motion.span
              key={s.id}
              className="absolute rounded-full"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
                background: "radial-gradient(white, rgba(255,255,255,0.2))",
              }}
              initial={{ scale: 0.6, opacity: 0.0 }}
              animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.2, 0.9, 0.2] }}
              transition={{ repeat: Infinity, duration: s.dur, delay: s.delay, ease: "easeInOut" }}
              aria-hidden
            />
          ))}
        </div>
      )}

      {/* Idle bob for the whole card */}
      <motion.div
        className="relative z-10"
        animate={shouldReduce ? {} : { y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Holographic animated border */}
        <motion.div
          className="relative p-[2px] rounded-[26px]"
          style={{
            background:
              "conic-gradient(from 0deg, #22d3ee, #6366f1, #10b981, #f59e0b, #ef4444, #22d3ee)",
          }}
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          {/* Soft outer glow */}
          {!shouldReduce && (
            <motion.div
              aria-hidden
              className="absolute -inset-2 rounded-[28px] blur-xl opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(99,102,241,0.4), transparent 60%), radial-gradient(circle at 70% 80%, rgba(16,185,129,0.35), transparent 60%)",
              }}
              animate={{ opacity: [0.2, 0.35, 0.2] }}
              transition={{ repeat: Infinity, duration: 6 }}
            />
          )}

          {/* Tilt + click/flip + ripple */}
          <TiltCard className="relative rounded-[24px] overflow-hidden bg-white dark:bg-[#0d0d18]">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onPointerDown={handlePointerDown}
              onClick={() => setFlipped((v) => !v)}
              className="relative w-[320px] sm:w-[360px] h-[200px] sm:h-[220px] rounded-[24px] cursor-pointer select-none"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              aria-label="Igifu Digital Card"
            >
              {/* 3D flipper */}
              <motion.div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* FRONT */}
                <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(99,102,241,0.95), rgba(16,185,129,0.95))",
                      backgroundSize: "200% 200%",
                      mixBlendMode: "normal",
                    }}
                    animate={
                      shouldReduce
                        ? {}
                        : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
                    }
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    aria-hidden
                  />
                  {/* Subtle texture */}
                  <div
                    className="absolute inset-0 mix-blend-overlay opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px)",
                      backgroundSize: "6px 6px",
                    }}
                    aria-hidden
                  />
                  {/* Shine follows cursor */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(380px circle at ${mouse.x}px ${mouse.y}px, rgba(255,255,255,0.18), transparent 40%)`,
                    }}
                    aria-hidden
                  />
                  {/* Diagonal sweep */}
                  {!shouldReduce && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-120%" }}
                      animate={{ x: ["-120%", "120%"] }}
                      transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.8 }}
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.28) 50%, transparent 60%)",
                      }}
                      aria-hidden
                    />
                  )}

                  {/* Top row: brand + balance */}
                  <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-xl" aria-hidden>🍽️</span>
                      <span className="font-semibold tracking-wide">igifu</span>
                    </div>
                    <motion.div
                      className="bg-white/20 backdrop-blur-md text-white text-xs rounded-full px-3 py-1.5 border border-white/30 shadow"
                      animate={shouldReduce ? {} : { scale: [1, 1.04, 1] }}
                      transition={{ repeat: Infinity, duration: 2.8 }}
                    >
                      Balance: RWF {balance.toLocaleString()}
                    </motion.div>
                  </div>

                  {/* Middle row: chip + contactless */}
                  <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 mt-2 sm:mt-3 text-white">
                    <motion.div
                      className="flex items-center gap-3"
                      animate={shouldReduce ? {} : { x: [0, 0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                    >
                      {/* Chip */}
                      <motion.div
                        className="w-10 h-7 rounded-md border border-yellow-500/50 shadow-inner"
                        style={{
                          background:
                            "linear-gradient(135deg,#ffe29a,#f7c948,#d97706)",
                        }}
                        animate={
                          shouldReduce ? {} : { filter: ["saturate(1)", "saturate(1.15)", "saturate(1)"] }
                        }
                        transition={{ repeat: Infinity, duration: 3.2 }}
                        aria-hidden
                      />
                      <div className="text-white/95 text-[11px] sm:text-xs">
                        <div className="uppercase tracking-wider font-semibold">
                          Digital Meal Card
                        </div>
                        <div className="opacity-85">{campus}</div>
                      </div>
                    </motion.div>

                    {/* Contactless waves */}
                    {!shouldReduce && (
                      <div className="text-white/90" aria-label="Contactless ready">
                        <motion.svg
                          width="30" height="20" viewBox="0 0 30 20" fill="none"
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 2.4 }}
                        >
                          <path d="M2 10c2-5 7-5 9 0" stroke="white" strokeOpacity=".85" strokeWidth="1.6" strokeLinecap="round">
                            <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" repeatCount="indefinite" />
                          </path>
                          <path d="M11 10c2-5 7-5 9 0" stroke="white" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round">
                            <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" begin=".25s" repeatCount="indefinite" />
                          </path>
                          <path d="M20 10c2-5 7-5 9 0" stroke="white" strokeOpacity=".35" strokeWidth="1.6" strokeLinecap="round">
                            <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" begin=".5s" repeatCount="indefinite" />
                          </path>
                        </motion.svg>
                      </div>
                    )}
                  </div>

                  {/* Card number + holder */}
                  <div className="relative z-10 px-4 sm:px-5 mt-4 text-white">
                    <motion.div
                      className="tracking-[0.22em] font-semibold text-sm sm:text-base"
                      animate={shouldReduce ? {} : { letterSpacing: ["0.22em", "0.28em", "0.22em"] }}
                      transition={{ repeat: Infinity, duration: 6 }}
                    >
                      IGIFU • 1234 • 5678
                    </motion.div>
                    <div className="mt-2 flex items-center justify-between text-xs sm:text-sm opacity-95">
                      <div>
                        <div className="uppercase opacity-70">Cardholder</div>
                        <div className="font-semibold">{name}</div>
                      </div>
                      <div className="text-right">
                        <div className="uppercase opacity-70">Valid Thru</div>
                        <div className="font-semibold">12/26</div>
                      </div>
                    </div>
                  </div>

                  {/* Holo foil overlay */}
                  {!shouldReduce && (
                    <motion.div
                      className="absolute inset-0 mix-blend-screen opacity-20"
                      style={{
                        background:
                          "conic-gradient(from 0deg, rgba(255,255,255,0.15), rgba(255,255,255,0.0) 35%, rgba(255,255,255,0.25) 60%, rgba(255,255,255,0.0) 85%)",
                      }}
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
                      aria-hidden
                    />
                  )}

                  {/* Tap ripple */}
                  {ripple && (
                    <motion.span
                      key={ripple.id}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 12,
                        height: 12,
                        background: "radial-gradient(rgba(255,255,255,0.6), transparent 60%)",
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ scale: 0.2, opacity: 0.9 }}
                      animate={{ scale: 8, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      aria-hidden
                    />
                  )}
                </div>

                {/* BACK (QR) */}
                <div
                  className="absolute inset-0 p-5 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 text-white"
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-semibold tracking-wide">igifu • Pay</div>
                    <div className="text-xs opacity-80">Card ID: IG-9X72</div>
                  </div>

                  {/* QR with scanning line */}
                  <div className="mt-6 relative p-3 rounded-xl bg-white/10 border border-white/15 w-[160px] h-[160px] overflow-hidden">
                    <div
                      className="grid w-full h-full"
                      style={{
                        gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
                        gridTemplateRows: "repeat(18, minmax(0, 1fr))",
                        gap: "2px",
                      }}
                    >
                      {qr.flatMap((row, rIdx) =>
                        row.map((filled, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={filled ? "bg-white" : "bg-transparent"}
                          />
                        ))
                      )}
                    </div>
                    {!shouldReduce && (
                      <motion.div
                        className="absolute left-0 right-0 h-[2px] bg-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                        initial={{ top: "-2%" }}
                        animate={{ top: ["-2%", "102%"] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                      />
                    )}
                  </div>

                  <p className="mt-4 text-xs text-white/80">
                    Show this code at the register or tap your card on NFC terminals.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </TiltCard>
        </motion.div>
      </motion.div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 z-10">
        <Link
          to="/signup"
          className="px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 shadow active:scale-95 transition"
        >
          Use this card
        </Link>
        <motion.button
          whileHover={shouldReduce ? {} : { y: -2 }}
          className="px-4 py-2 rounded-full border border-gray-300 text-gray-800 bg-white/70 backdrop-blur hover:bg-white shadow-sm active:scale-95 transition dark:border-white/20 dark:text-white/90 dark:bg-white/10"
          onClick={() => alert("Added to wallet")}
        >
          Add to Wallet
        </motion.button>
        <motion.button
          whileHover={shouldReduce ? {} : { y: -2 }}
          className="px-4 py-2 rounded-full border border-white/20 text-white bg-black/30 hover:bg-black/40 shadow-sm active:scale-95 transition"
          onClick={() => alert("Top-up coming soon")}
        >
          Top up
        </motion.button>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 z-10">
        Tip: Click the card to flip. Hover to tilt and see the shine.
      </p>
    </div>
  );
}

/**
 * Loader with progress + reduced-motion friendly
 */
function LoadingScreen() {
  const shouldReduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const msgs = useMemo(
    () => [
      "Cooking up components…",
      "Sautéing state…",
      "Simmering springs…",
      "Plating pixels…",
    ],
    []
  );
  const msg = msgs[Math.min(Math.floor(progress / 25), msgs.length - 1)];

  useEffect(() => {
    const id = setInterval(
      () => setProgress((p) => Math.min(p + 2 + Math.random() * 6, 100)),
      80
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a23] text-yellow-400 relative overflow-hidden"
      style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
      aria-busy="true"
    >
      <motion.div
        className="w-40 h-40 border-4 border-yellow-400 rounded-full flex items-center justify-center relative"
        animate={shouldReduce ? {} : { rotate: 360 }}
        transition={shouldReduce ? {} : { repeat: Infinity, duration: 3, ease: "linear" }}
        style={{ boxShadow: "0 0 30px #facc15, inset 0 0 20px #facc15" }}
      >
        <div
          className="absolute w-36 h-36 border-t-4 border-yellow-400 rounded-full"
          style={{ transform: "rotate(45deg)" }}
        />
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold">igifu</p>
          <div className="text-2xl" aria-hidden>🍽️</div>
        </div>
        <div className="absolute text-lg" style={{ top: "-10px", left: "45%" }} aria-hidden>
          🍴
        </div>
        <div className="absolute text-lg" style={{ bottom: "-10px", left: "45%" }} aria-hidden>
          🥄
        </div>
      </motion.div>
      <p className="mt-5 text-xs tracking-widest">{msg}</p>
      <div className="w-64 h-2 bg-yellow-900/40 rounded mt-4 overflow-hidden">
        <motion.div
          className="h-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
      <motion.div
        className="absolute w-60 h-60 bg-yellow-400 rounded-full opacity-20 blur-3xl"
        animate={shouldReduce ? {} : { scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        aria-hidden
      />
    </div>
  );
}

/**
 * Small testimonial slider
 */
function TestimonialSlider() {
  const items = [
    {
      quote:
        "I loaded my Igifu card in seconds—and used it to buy lunch right away.",
      who: "Maya • Freshman",
    },
    { quote: "Secure and easy. This is the campus food wallet I actually use.", who: "Owen • Senior" },
    { quote: "No more lost meal swipes. Everything is on the card.", who: "Priya • Sophomore" },
  ];
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % items.length);
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-500">What students say</h3>
        <div className="flex gap-2">
          <button onClick={prev} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50" aria-label="Previous testimonial">←</button>
          <button onClick={next} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50" aria-label="Next testimonial">→</button>
        </div>
      </div>
      <div className="relative h-24">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            className="absolute inset-0 bg-white/70 dark:bg-white/5 backdrop-blur rounded-xl p-4 border border-gray-200 dark:border-white/10"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">“{items[i].quote}”</p>
            <footer className="mt-2 text-xs text-gray-500 dark:text-gray-400">— {items[i].who}</footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
    </div>
  );
}

const WelcomePage = () => {
  const [loading, setLoading] = useState(true);

  // Theme: read from localStorage or system preference by default
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const shouldReduce = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Apply theme to <html> and persist
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Optional: sync theme across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "theme" && e.newValue) {
        document.documentElement.classList.toggle("dark", e.newValue === "dark");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Scroll progress bar
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrollPct((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stats
  const meals = useCounter(12400, 1.6);
  const students = useCounter(3200, 1.6);
  const campuses = useCounter(28, 1.6);

  if (loading) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen bg-white text-gray-800 dark:bg-[#0b0b12] dark:text-gray-100 font-sans overflow-hidden selection:bg-blue-600/20 transition-colors duration-300">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-blue-600 focus:text-white focus:px-3 focus:py-2 focus:rounded">Skip to content</a>

      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"
          style={{ width: `${scrollPct}%` }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Background orbs */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.5), transparent)",
        }}
        animate={shouldReduce ? {} : { y: [0, 10, 0], x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(closest-side, rgba(234,179,8,0.45), transparent)",
        }}
        animate={shouldReduce ? {} : { y: [0, -12, 0], x: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
        aria-hidden
      />

      {/* Header */}
      <header className="relative z-10 w-full flex items-center justify-between px-6 pt-6">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl" aria-hidden>🍽️</span>
          <span className="font-semibold tracking-tight">Igifu</span>
        </motion.div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-gray-600 dark:text-gray-300">Welcome 🙂</span>

          <motion.button
            whileTap={{ scale: 0.95, rotate: 10 }}
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            className="rounded-full border border-gray-300 dark:border-white/20 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </motion.button>

          <Link
            to="/signup"
            className="bg-yellow-400 text-gray-900 font-semibold px-4 py-1 rounded-full shadow hover:bg-yellow-500 transition-transform active:scale-95"
            aria-label="Go to next section"
          >
            Next
          </Link>
        </div>
      </header>

      {/* Main */}
      <main id="main" className="relative z-10 flex flex-col items-center mt-16 px-6">
        {/* Hero: Digital Card */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <IgifuDigitalCard startBalance={25000} name="Student Name" campus="Kigali Campus" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-gray-800 dark:text-gray-100">The Only Card You Need for </span>
          <motion.span
            className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#2563eb,45%,#7c3aed,65%,#10b981)]"
            animate={shouldReduce ? {} : { backgroundPositionX: ["0%", "100%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            style={{ backgroundSize: "200% 100%" }}
          >
            Campus Dining
          </motion.span>
        </motion.h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-300 text-base max-w-xl">
          Tap into a seamless dining experience. The Igifu card makes campus meals digital, fast, and secure. Your all-access pass to food, right in your pocket.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <motion.div whileHover={shouldReduce ? {} : { y: -2 }}>
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-full font-semibold bg-blue-600 text-white shadow hover:shadow-lg hover:bg-blue-700 active:scale-95 transition"
            >
              Get Your Card — it’s free
            </Link>
          </motion.div>
          <motion.div whileHover={shouldReduce ? {} : { y: -2 }}>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-full font-semibold border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-white/5 active:scale-95 transition"
            >
              Log In
            </Link>
          </motion.div>
        </div>

        {/* Feature cards */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
          {[
            { title: "Load Instantly", body: "Top up your card from anywhere, anytime.", emoji: "⚡️" },
            { title: "Tap & Pay", body: "Secure, contactless payments at all vendors.", emoji: "💳" },
            { title: "Track Spending", body: "See history, budgets & get insights.", emoji: "📊" },
          ].map((f) => (
            <TiltCard key={f.title}>
              <motion.div
                className="h-full bg-white dark:bg-[#0d0d18] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-xl"
                whileHover={{ y: -4 }}
              >
                <div className="text-2xl mb-2" aria-hidden>{f.emoji}</div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.body}</p>
              </motion.div>
            </TiltCard>
          ))}
        </section>

        {/* Stats */}
        <section className="mt-10 w-full max-w-4xl grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{meals.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Meals Served</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{students.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Active Students</div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 bg-white/70 dark:bg-white/5 backdrop-blur">
            <div className="text-2xl font-extrabold tabular-nums">{campuses}</div>
            <div className="text-xs text-gray-500">Partner Campuses</div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialSlider />

        <div className="h-16" />
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center pb-6 text-gray-500 text-xs">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          © {new Date().getFullYear()} Igifu Digital Meals — All Rights Reserved 🍴
        </motion.p>
      </footer>
    </div>
  );
};

export default WelcomePage;