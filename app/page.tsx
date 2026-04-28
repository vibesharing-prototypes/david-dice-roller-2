"use client";

import { useState, useCallback } from "react";

const DICE_COLORS = [
  "#4F46E5", "#DC2626", "#059669", "#D97706", "#7C3AED",
  "#DB2777", "#0891B2", "#CA8A04", "#6366F1", "#E11D48",
];

function DiceFace({ value, sides, color, rolling }: { value: number; sides: number; color: string; rolling: boolean }) {
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: sides <= 6 ? 16 : 50,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: 36,
        fontWeight: 800,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        transition: "transform 0.15s",
        transform: rolling ? `rotate(${Math.random() * 40 - 20}deg) scale(1.1)` : "rotate(0deg) scale(1)",
        userSelect: "none",
        position: "relative",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {value}
    </div>
  );
}

export default function DiceSimulator() {
  const [numDice, setNumDice] = useState(2);
  const [numSides, setNumSides] = useState(6);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);

  const roll = useCallback(() => {
    setRolling(true);
    setHasRolled(true);

    let ticks = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      setResults(
        Array.from({ length: numDice }, () => Math.floor(Math.random() * numSides) + 1)
      );
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  }, [numDice, numSides]);

  const total = results.reduce((a, b) => a + b, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      color: "#e2e8f0",
    }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 8, letterSpacing: -1 }}>
        Dice Roller
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 16 }}>
        Select your dice, then roll!
      </p>

      {/* Controls */}
      <div style={{
        display: "flex",
        gap: 24,
        marginBottom: 40,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-end",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            Number of dice
          </label>
          <select
            value={numDice}
            onChange={(e) => setNumDice(Number(e.target.value))}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
            Sides per die
          </label>
          <select
            value={numSides}
            onChange={(e) => setNumSides(Number(e.target.value))}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 18,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {[4, 6, 8, 10, 12, 20, 100].map((n) => (
              <option key={n} value={n}>d{n}</option>
            ))}
          </select>
        </div>

        <button
          onClick={roll}
          disabled={rolling}
          style={{
            padding: "12px 36px",
            borderRadius: 12,
            border: "none",
            background: rolling ? "#475569" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontSize: 18,
            fontWeight: 700,
            cursor: rolling ? "not-allowed" : "pointer",
            boxShadow: rolling ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
            transition: "all 0.2s",
            letterSpacing: 0.5,
          }}
        >
          {rolling ? "Rolling..." : "Roll!"}
        </button>
      </div>

      {/* Dice display */}
      {hasRolled && (
        <>
          <div style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 32,
            minHeight: 120,
          }}>
            {results.map((val, i) => (
              <DiceFace
                key={i}
                value={val}
                sides={numSides}
                color={DICE_COLORS[i % DICE_COLORS.length]}
                rolling={rolling}
              />
            ))}
          </div>

          {/* Total */}
          {!rolling && results.length > 1 && (
            <div style={{
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 14,
              padding: "12px 32px",
              fontSize: 22,
              fontWeight: 700,
            }}>
              Total: {total}
            </div>
          )}
        </>
      )}
    </div>
  );
}
