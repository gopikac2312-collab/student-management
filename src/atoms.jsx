import React from "react";
import { X } from "lucide-react";
import { COLORS } from "./constants.jsx";

export function ChalkButton({ children, onClick, variant = "chalk", type = "button", disabled, title }) {
  const styles = {
    chalk: { border: `2px dashed ${COLORS.chalk}`, color: COLORS.chalk, background: "transparent" },
    yellow: { border: `2px dashed ${COLORS.yellow}`, color: COLORS.yellow, background: "transparent" },
    coral: { border: `2px dashed ${COLORS.coral}`, color: COLORS.coral, background: "transparent" },
    solidYellow: { border: `2px solid ${COLORS.yellow}`, color: COLORS.boardDark, background: COLORS.yellow },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...styles[variant],
        borderRadius: 8,
        padding: "8px 14px",
        fontFamily: "'Work Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "transform 0.12s ease, background 0.12s ease",
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

export function ChalkInput({ label, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "'Work Sans', sans-serif" }}>
      {label && <span style={{ fontSize: 12, color: COLORS.chalkDim, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>}
      <input
        {...props}
        style={{
          background: "rgba(46,58,50,0.05)",
          border: `1px solid ${COLORS.chalkDim}`,
          borderRadius: 6,
          padding: "8px 10px",
          color: COLORS.chalk,
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 14,
          outline: "none",
          ...(props.style || {}),
        }}
      />
    </label>
  );
}

export function ChalkSelect({ label, children, ...props }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "'Work Sans', sans-serif" }}>
      {label && <span style={{ fontSize: 12, color: COLORS.chalkDim, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>}
      <select
        {...props}
        style={{
          background: COLORS.boardDark,
          border: `1px solid ${COLORS.chalkDim}`,
          borderRadius: 6,
          padding: "8px 10px",
          color: COLORS.chalk,
          fontFamily: "'Work Sans', sans-serif",
          fontSize: 14,
          outline: "none",
        }}
      >
        {children}
      </select>
    </label>
  );
}

export function Modal({ title, onClose, children, width = 440 }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,16,12,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width,
          maxWidth: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          background: COLORS.board,
          border: `3px solid ${COLORS.woodLight}`,
          borderRadius: 10,
          padding: 20,
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, color: COLORS.yellow, fontSize: 20, margin: 0 }}>{title}</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: COLORS.chalk, cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyNote({ text }) {
  return (
    <div
      style={{
        fontFamily: "'Work Sans', sans-serif",
        color: COLORS.chalkDim,
        fontSize: 15,
        textAlign: "center",
        padding: "40px 20px",
        border: `2px dashed ${COLORS.chalkDim}`,
        borderRadius: 10,
        opacity: 0.8,
      }}
    >
      {text}
    </div>
  );
}

export function StatCard({ icon, label, value, accent }) {
  return (
    <div
      style={{
        background: "rgba(46,58,50,0.045)",
        border: `1px solid ${accent}55`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 130,
      }}
    >
      <div style={{ color: accent, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'Work Sans', sans-serif", fontWeight: 600, letterSpacing: 0.3 }}>
        {icon} {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: COLORS.chalk, fontSize: 26, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
      <div>
        <h2 style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, color: COLORS.chalk, fontSize: 26, margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ color: COLORS.chalkDim, fontSize: 13, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

export function ChalkCheck({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 13.5L9.5 19L20.5 5" stroke={COLORS.chalk} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    </svg>
  );
}

export function ChalkCross({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 5L19 19M19 5L5 19" stroke={COLORS.chalk} strokeWidth="3" strokeLinecap="round" opacity="0.95" />
    </svg>
  );
}

export function ChalkLate({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={COLORS.chalk} strokeWidth="2.5" opacity="0.9" />
      <path d="M12 8V12L15 14" stroke={COLORS.chalk} strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}