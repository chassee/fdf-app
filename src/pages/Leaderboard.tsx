import { useFDF, DNA_LEVEL_META, type DNALevel } from "@/contexts/FDFContext";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDNALevel(dnaScore: number): DNALevel {
  if (dnaScore >= 1000) return "Elite";
  if (dnaScore >= 500)  return "Operator";
  if (dnaScore >= 250)  return "Builder";
  if (dnaScore >= 100)  return "Growth";
  return "Seed";
}

const MEDAL: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Leaderboard() {
  const { dnaScore: myDnaScore } = useFDF();
  const [myUserId, setMyUserId] = useState<string | null>(null);

  // Get current Supabase user ID for highlighting
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setMyUserId(session.user.id);
    });
  }, []);

  const [entries, setEntries] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("fdf_users")
      .select("auth_user_id, name, xp, streak_days, dna_score, level, dawg_class")
      .eq("graduated", false)
      .order("dna_score", { ascending: false })
      .limit(10)
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); }
        else {
          setEntries((data ?? []).map((u, i) => ({
            position: i + 1,
            userId: u.auth_user_id,
            name: u.name ?? "Dawg",
            dnaScore: u.dna_score ?? 0,
            streakDays: u.streak_days ?? 0,
            level: u.level ?? 1,
            dawgClass: u.dawg_class ?? "builder",
          })));
        }
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f8fafc 0%, #eef2ff 50%, #f0fdf4 100%)",
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        padding: "32px 20px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🏆</div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.625rem",
            fontWeight: 800,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.03em",
          }}>
            Leaderboard
          </h1>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.875rem",
            color: "#94a3b8",
            marginTop: 6,
          }}>
            Top Dawgs ranked by DNA Score
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 0" }}>
        {/* My position card */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          borderRadius: 16,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: 4,
            }}>
              Your DNA Score
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "2rem",
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}>
              {myDnaScore.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: "1.5rem",
              marginBottom: 4,
            }}>
              {DNA_LEVEL_META[getDNALevel(myDnaScore)].emoji}
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: DNA_LEVEL_META[getDNALevel(myDnaScore)].color,
            }}>
              {getDNALevel(myDnaScore)}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 40, height: 40,
              border: "3px solid #e2e8f0",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#94a3b8", fontSize: "0.875rem" }}>
              Loading rankings...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "center",
          }}>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#ef4444", fontSize: "0.875rem" }}>
              Could not load leaderboard. Try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && entries && entries.length === 0 && (
          <div style={{
            background: "white",
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🌱</div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 8px",
            }}>
              No rankings yet
            </h3>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.875rem",
              color: "#64748b",
              margin: 0,
            }}>
              Be the first to complete missions and claim your spot.
            </p>
          </div>
        )}

        {/* Leaderboard entries */}
        {!isLoading && !error && entries && entries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {entries.map((entry, idx) => {
              const isMe = entry.userId === myUserId;
              const dnaLvl = getDNALevel(entry.dnaScore);
              const meta = DNA_LEVEL_META[dnaLvl];
              const isTop3 = entry.position <= 3;

              return (
                <div
                  key={entry.userId}
                  style={{
                    background: isMe
                      ? "linear-gradient(135deg, #1e293b, #0f172a)"
                      : "white",
                    borderRadius: 14,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    border: isMe
                      ? "1.5px solid rgba(99,102,241,0.5)"
                      : isTop3
                        ? "1.5px solid rgba(245,158,11,0.2)"
                        : "1px solid #e2e8f0",
                    boxShadow: isMe
                      ? "0 4px 20px rgba(99,102,241,0.15)"
                      : isTop3
                        ? "0 4px 16px rgba(245,158,11,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    transform: isMe ? "scale(1.01)" : "scale(1)",
                    transition: "all 0.2s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Glow for top 3 */}
                  {isTop3 && !isMe && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, transparent, ${meta.color}66, transparent)`,
                    }} />
                  )}

                  {/* Position */}
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    background: isTop3
                      ? `linear-gradient(135deg, ${meta.gradientFrom}33, ${meta.gradientTo}33)`
                      : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontSize: isTop3 ? "1.25rem" : "0.875rem",
                    fontWeight: 800,
                    color: isMe ? "#f8fafc" : "#475569",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {MEDAL[entry.position] ?? entry.position}
                  </div>

                  {/* Name + streak */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      color: isMe ? "#f8fafc" : "#1e293b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {entry.name}
                      {isMe && (
                        <span style={{
                          marginLeft: 8,
                          fontSize: "0.6875rem",
                          fontWeight: 700,
                          color: "#818cf8",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}>
                          You
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.75rem",
                      color: isMe ? "#94a3b8" : "#94a3b8",
                      marginTop: 2,
                    }}>
                      🔥 {entry.streakDays} day streak · Lv.{entry.level}
                    </div>
                  </div>

                  {/* DNA Score + level */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "1.125rem",
                      fontWeight: 900,
                      color: isMe ? "#f8fafc" : "#1e293b",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}>
                      {entry.dnaScore.toLocaleString()}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      color: meta.color,
                      marginTop: 3,
                    }}>
                      {meta.emoji} {dnaLvl}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer note */}
        {!isLoading && entries && entries.length > 0 && (
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.75rem",
            color: "#94a3b8",
            textAlign: "center",
            marginTop: 20,
            lineHeight: 1.6,
          }}>
            Rankings update in real time. Complete missions and maintain your streak to climb.
          </p>
        )}
      </div>
    </div>
  );
}
