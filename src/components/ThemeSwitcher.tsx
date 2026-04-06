import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { THEMES, useTheme, type ThemeId } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Change theme"
        aria-label="Change theme"
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          border: "1.5px solid var(--card-border)",
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--primary)",
          transition: "all 0.2s",
          boxShadow: open ? "0 0 0 3px var(--primary-light)" : "none",
        }}
      >
        <Palette size={15} strokeWidth={2} />
      </button>

      {/* Dropdown palette */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            background: "var(--card-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--card-border)",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            padding: "12px",
            zIndex: 200,
            minWidth: 200,
            animation: "fadeIn 0.15s ease",
          }}
        >
          <p style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: 10,
            paddingLeft: 4,
          }}>
            Choose Theme
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id as ThemeId); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: theme === t.id
                    ? `2px solid ${t.primary}`
                    : "2px solid transparent",
                  background: theme === t.id
                    ? t.bg + "cc"
                    : "rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
              >
                {/* Color dot */}
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: t.primary,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 2px 6px ${t.primary}55`,
                }}>
                  {theme === t.id && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                <div>
                  <div style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: theme === t.id ? t.primary : "var(--text-main)",
                    lineHeight: 1.2,
                  }}>
                    {t.emoji} {t.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
