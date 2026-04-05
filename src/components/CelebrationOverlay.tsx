import { useEffect, useRef, useState } from "react";
import { useFDF, RANK_META, DNA_LEVEL_META, type DNALevel, type RankId } from "@/contexts/FDFContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type CelebrationEvent =
  | { type: "levelup"; level: number; rankId: RankId }
  | { type: "dna"; dnaLevel: DNALevel };

// ─────────────────────────────────────────────────────────────────────────────
// Overlay UI
// ─────────────────────────────────────────────────────────────────────────────

function LevelUpOverlay({ level, rankId, onDone }: { level: number; rankId: RankId; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const rank = RANK_META[rankId];

  useEffect(() => {
    // Fade in
    const t1 = setTimeout(() => setVisible(true), 30);
    // Auto-dismiss after 2.5s
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onDone, 400); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        cursor: "pointer",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Glow ring */}
      <div style={{
        position: "absolute",
        width: 280, height: 280,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${rank.glowColor.replace("0.2", "0.35")} 0%, transparent 70%)`,
        animation: visible ? "celebPulse 1.5s ease-in-out infinite" : "none",
      }} />

      {/* Content card */}
      <div style={{
        position: "relative",
        transform: visible ? "scale(1)" : "scale(0.7)",
        transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Emoji */}
        <div style={{
          fontSize: "4rem",
          marginBottom: 16,
          filter: `drop-shadow(0 0 20px ${rank.color})`,
          animation: visible ? "celebBounce 0.6s ease-out" : "none",
        }}>
          {rank.emoji}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: rank.color,
          marginBottom: 8,
        }}>
          Level Up
        </div>

        {/* Level number */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "5rem",
          fontWeight: 900,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${rank.gradientFrom}, ${rank.gradientTo})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 12,
          letterSpacing: "-0.04em",
        }}>
          {level}
        </div>

        {/* Rank name */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.375rem",
          fontWeight: 800,
          color: "#f8fafc",
          marginBottom: 6,
          letterSpacing: "-0.02em",
        }}>
          {rank.label}
        </div>

        <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
          Tap to continue
        </div>
      </div>

      <style>{`
        @keyframes celebPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes celebBounce {
          0% { transform: scale(0.5) rotate(-10deg); }
          60% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

function DNAEvolvedOverlay({ dnaLevel, onDone }: { dnaLevel: DNALevel; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  const meta = DNA_LEVEL_META[dnaLevel];

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 30);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onDone, 400); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        cursor: "pointer",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Outer glow */}
      <div style={{
        position: "absolute",
        width: 320, height: 320,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${meta.color}44 0%, transparent 70%)`,
        animation: visible ? "dnaPulse 2s ease-in-out infinite" : "none",
      }} />

      {/* Inner glow */}
      <div style={{
        position: "absolute",
        width: 160, height: 160,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${meta.color}88 0%, transparent 70%)`,
        animation: visible ? "dnaPulse 1.5s ease-in-out infinite reverse" : "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(30px)",
        transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Emoji */}
        <div style={{
          fontSize: "5rem",
          marginBottom: 16,
          filter: `drop-shadow(0 0 30px ${meta.color})`,
          animation: visible ? "dnaFloat 2s ease-in-out infinite" : "none",
        }}>
          {meta.emoji}
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.8125rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: meta.color,
          marginBottom: 10,
        }}>
          DNA Evolved
        </div>

        {/* Level name */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "3.5rem",
          fontWeight: 900,
          lineHeight: 1,
          background: `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 14,
          letterSpacing: "-0.03em",
        }}>
          {dnaLevel}
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: "0.9375rem",
          color: "#cbd5e1",
          lineHeight: 1.6,
          maxWidth: 260,
          margin: "0 auto 16px",
          fontStyle: "italic",
        }}>
          "{meta.tagline}"
        </div>

        <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
          Tap to continue
        </div>
      </div>

      <style>{`
        @keyframes dnaPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes dnaFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main controller — watches for level/DNA changes and queues celebrations
// ─────────────────────────────────────────────────────────────────────────────

export function CelebrationOverlay() {
  const { level, rankId, dnaLevel, xp } = useFDF();

  const prevLevelRef  = useRef<number | null>(null);
  const prevDNARef    = useRef<DNALevel | null>(null);
  const initializedRef = useRef(false);

  const [queue, setQueue] = useState<CelebrationEvent[]>([]);

  useEffect(() => {
    // Skip on first render (don't celebrate on page load)
    if (!initializedRef.current) {
      prevLevelRef.current = level;
      prevDNARef.current   = dnaLevel;
      initializedRef.current = true;
      return;
    }

    // Only trigger if user has some XP (not on initial hydration from 0)
    if (xp === 0) return;

    const events: CelebrationEvent[] = [];

    if (prevLevelRef.current !== null && level > prevLevelRef.current) {
      events.push({ type: "levelup", level, rankId });
    }
    if (prevDNARef.current !== null && dnaLevel !== prevDNARef.current) {
      events.push({ type: "dna", dnaLevel });
    }

    prevLevelRef.current = level;
    prevDNARef.current   = dnaLevel;

    if (events.length > 0) {
      setQueue(prev => [...prev, ...events]);
    }
  }, [level, dnaLevel]);

  const dismissFirst = () => {
    setQueue(prev => prev.slice(1));
  };

  const current = queue[0];
  if (!current) return null;

  if (current.type === "levelup") {
    return <LevelUpOverlay level={current.level} rankId={current.rankId} onDone={dismissFirst} />;
  }
  return <DNAEvolvedOverlay dnaLevel={current.dnaLevel} onDone={dismissFirst} />;
}
