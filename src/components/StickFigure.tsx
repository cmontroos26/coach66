"use client";

import { getPattern } from "@/logic/program";

const KF = `
@keyframes kBarUp     { 0%,100%{transform:translateY(5px)}  50%{transform:translateY(-7px)} }
@keyframes kBodyUp    { 0%,100%{transform:translateY(8px)}  50%{transform:translateY(0px)}  }
@keyframes kArmRaise  { 0%,100%{transform:rotate(60deg)}   50%{transform:rotate(-5deg)}    }
@keyframes kArmRaiseL { 0%,100%{transform:rotate(-60deg)}  50%{transform:rotate(5deg)}     }
@keyframes kSquat     { 0%,100%{transform:translateY(0)}   50%{transform:translateY(9px)}  }
@keyframes kKneeR     { 0%,100%{transform:rotate(0deg)}    50%{transform:rotate(30deg)}    }
@keyframes kKneeL     { 0%,100%{transform:rotate(0deg)}    50%{transform:rotate(-30deg)}   }
@keyframes kHinge     { 0%,100%{transform:rotate(0deg)}    50%{transform:rotate(55deg)}    }
@keyframes kCalfUp    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-8px)} }
@keyframes kLegRaise  { 0%,100%{transform:rotate(0deg)}    50%{transform:rotate(-70deg)}   }
`;

const T = (name: string) => ({ animation: `${name} 1.5s ease-in-out infinite` } as React.CSSProperties);

// ─── 1. PRESS — barbell moving up, arms tracking ──────────────────────────────
function IconPress() {
  return (
    <svg viewBox="0 0 52 60" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Bar + plates (animated up) */}
      <g style={T("kBarUp")}>
        <rect x="0"  y="20" width="7" height="10" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="45" y="20" width="7" height="10" rx="2" fill="currentColor" opacity="0.5" />
        <rect x="7"  y="22" width="38" height="6"  rx="3" fill="currentColor" opacity="0.35"/>
        {/* Arms from shoulder to bar */}
        <line x1="17" y1="25" x2="19" y2="34" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="35" y1="25" x2="33" y2="34" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {/* Static body */}
      <circle cx="26" cy="10" r="6.5" fill="currentColor" />
      <line x1="26" y1="17" x2="26" y2="38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="26" y1="38" x2="18" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="26" y1="38" x2="34" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ─── 2. PULL — fixed bar at top, whole body rising ────────────────────────────
function IconPull() {
  return (
    <svg viewBox="0 0 52 62" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Fixed bar */}
      <rect x="4" y="2" width="44" height="6" rx="3" fill="currentColor" opacity="0.3" />
      {/* Body rises */}
      <g style={T("kBodyUp")}>
        <circle cx="26" cy="24" r="6.5" fill="currentColor" />
        {/* Arms up to bar */}
        <line x1="26" y1="18" x2="14" y2="8"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="18" x2="38" y2="8"  stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Torso */}
        <line x1="26" y1="31" x2="26" y2="48" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Legs bent up (dead hang style) */}
        <line x1="26" y1="48" x2="20" y2="58" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="48" x2="32" y2="58" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ─── 3. RAISE — bilateral lateral raise, both arms spread ────────────────────
function IconRaise() {
  return (
    <svg viewBox="0 0 64 58" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Head + torso (static) */}
      <circle cx="32" cy="10" r="6.5" fill="currentColor" />
      <line x1="32" y1="17" x2="32" y2="38" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="32" y1="38" x2="24" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="38" x2="40" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Right arm raises */}
      <g style={{ transformOrigin: "32px 22px", ...T("kArmRaise") }}>
        <line x1="32" y1="22" x2="58" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="58" cy="30" r="3.5" fill="currentColor" opacity="0.5" />
      </g>
      {/* Left arm raises (mirrored) */}
      <g style={{ transformOrigin: "32px 22px", ...T("kArmRaiseL") }}>
        <line x1="32" y1="22" x2="6"  y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <circle cx="6" cy="30" r="3.5" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
}

// ─── 4. SQUAT — whole body sinks, knees track out ────────────────────────────
function IconSquat() {
  return (
    <svg viewBox="0 0 52 64" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Bar on back */}
      <rect x="2" y="18" width="48" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      {/* Head + upper body sinks */}
      <g style={T("kSquat")}>
        <circle cx="26" cy="10" r="6.5" fill="currentColor" />
        <line x1="26" y1="17" x2="26" y2="34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Arms holding bar */}
        <line x1="26" y1="22" x2="10" y2="22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="26" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        {/* Right leg */}
        <g style={{ transformOrigin: "26px 34px", ...T("kKneeR") }}>
          <line x1="26" y1="34" x2="34" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="34" y1="50" x2="36" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </g>
        {/* Left leg */}
        <g style={{ transformOrigin: "26px 34px", ...T("kKneeL") }}>
          <line x1="26" y1="34" x2="18" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <line x1="18" y1="50" x2="16" y2="60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

// ─── 5. HINGE — torso rotates forward from hip ───────────────────────────────
function IconHinge() {
  return (
    <svg viewBox="0 0 60 58" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Legs static */}
      <line x1="28" y1="36" x2="20" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="36" x2="36" y2="54" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Torso + head hinge forward */}
      <g style={{ transformOrigin: "28px 36px", ...T("kHinge") }}>
        <line x1="28" y1="36" x2="28" y2="14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <circle cx="28" cy="8" r="6.5" fill="currentColor" />
        {/* Arms hang / hold bar */}
        <line x1="28" y1="26" x2="16" y2="36" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="28" y1="26" x2="40" y2="36" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        {/* Bar in hands */}
        <rect x="12" y="34" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
}

// ─── 6. CALF RISE — heels lifting off ground ─────────────────────────────────
function IconCalfRise() {
  return (
    <svg viewBox="0 0 52 58" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Upper body static */}
      <circle cx="26" cy="8"  r="6.5" fill="currentColor" />
      <line x1="26" y1="15" x2="26" y2="34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="26" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="26" y1="22" x2="38" y2="28" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Whole lower body rises */}
      <g style={T("kCalfUp")}>
        <line x1="26" y1="34" x2="20" y2="48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="34" x2="32" y2="48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        {/* Feet (angled up = on toes) */}
        <line x1="20" y1="48" x2="14" y2="46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="32" y1="48" x2="38" y2="46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ─── 7. CORE RAISE — legs lifting from hanging / V-sit ───────────────────────
function IconCoreRaise() {
  return (
    <svg viewBox="0 0 52 62" width="38" height="38" style={{ display: "block", overflow: "visible" }}>
      {/* Bar at top */}
      <rect x="6" y="2" width="40" height="6" rx="3" fill="currentColor" opacity="0.3" />
      {/* Upper body hanging static */}
      <line x1="26" y1="8"  x2="16" y2="14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="26" y1="8"  x2="36" y2="14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="26" cy="20" r="6.5" fill="currentColor" />
      <line x1="26" y1="27" x2="26" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* Legs raise */}
      <g style={{ transformOrigin: "26px 40px", ...T("kLegRaise") }}>
        <line x1="26" y1="40" x2="20" y2="56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="26" y1="40" x2="32" y2="56" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ─── Map pattern → component ──────────────────────────────────────────────────
const ICON_MAP: Record<string, () => React.ReactElement> = {
  press:     IconPress,
  pull:      IconPull,
  raise:     IconRaise,
  squatDip:  IconSquat,
  hinge:     IconHinge,
  calfRise:  IconCalfRise,
  coreRaise: IconCoreRaise,
};

export function StickFigure({ exerciseId }: { exerciseId: string }) {
  const pattern = getPattern(exerciseId);
  const Icon = ICON_MAP[pattern] ?? IconPress;
  return (
    <>
      <style>{KF}</style>
      <Icon />
    </>
  );
}
