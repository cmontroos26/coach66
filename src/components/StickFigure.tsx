"use client";

import { getPattern } from "@/logic/program";

const KF = `
@keyframes kPress { 0%,100%{transform:translateY(8px)}  50%{transform:translateY(-8px)} }
@keyframes kPull  { 0%,100%{transform:translateY(11px)} 50%{transform:translateY(0)}    }
@keyframes kArmR  { 0%,100%{transform:rotate(44deg)}    50%{transform:rotate(-6deg)}    }
@keyframes kArmL  { 0%,100%{transform:rotate(-44deg)}   50%{transform:rotate(6deg)}     }
@keyframes kSquat { 0%,100%{transform:translateY(0)}    50%{transform:translateY(10px)} }
@keyframes kHinge { 0%,100%{transform:rotate(0deg)}     50%{transform:rotate(60deg)}    }
@keyframes kCalf  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-7px)} }
@keyframes kLegUp { 0%,100%{transform:rotate(0deg)}     50%{transform:rotate(-82deg)}   }
`;

const T = (n: string): React.CSSProperties => ({ animation: `${n} 1.8s ease-in-out infinite` });

const SVG_PROPS = { style: { display: "block", overflow: "visible" } as React.CSSProperties };

function line(x1: number, y1: number, x2: number, y2: number, w = 4) {
  return { x1, y1, x2, y2, stroke: "currentColor", strokeWidth: w, strokeLinecap: "round" as const };
}

// ─── 1. PRESS — bar lifts from chest to overhead ─────────────────────────────
function IconPress() {
  return (
    <svg viewBox="0 0 40 56" width="36" height="36" {...SVG_PROPS}>
      <circle cx="20" cy="8" r="6" fill="currentColor" />
      <line {...line(20, 14, 20, 33, 5)} />
      <line {...line(20, 33, 13, 50)} />
      <line {...line(20, 33, 27, 50)} />
      <g style={T("kPress")}>
        <rect x="0"  y="0" width="4"  height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="36" y="0" width="4"  height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="4"  y="1" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.4"  />
        <line {...line(20, 18, 8,  6, 3.5)} />
        <line {...line(20, 18, 32, 6, 3.5)} />
      </g>
    </svg>
  );
}

// ─── 2. PULL — whole body rises to fixed bar ─────────────────────────────────
function IconPull() {
  return (
    <svg viewBox="0 0 40 60" width="36" height="36" {...SVG_PROPS}>
      <rect x="2" y="1" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      <g style={T("kPull")}>
        <line {...line(20, 6,  11, 13, 3.5)} />
        <line {...line(20, 6,  29, 13, 3.5)} />
        <circle cx="20" cy="19" r="6" fill="currentColor" />
        <line {...line(20, 25, 20, 42, 5)} />
        <line {...line(20, 42, 13, 56)} />
        <line {...line(20, 42, 27, 56)} />
      </g>
    </svg>
  );
}

// ─── 3. RAISE — arms sweep out to sides ──────────────────────────────────────
function IconRaise() {
  return (
    <svg viewBox="0 0 68 56" width="36" height="36" {...SVG_PROPS}>
      <circle cx="34" cy="8"  r="6" fill="currentColor" />
      <line {...line(34, 14, 34, 33, 5)} />
      <line {...line(34, 33, 27, 50)} />
      <line {...line(34, 33, 41, 50)} />
      <g style={{ transformOrigin: "34px 20px", ...T("kArmR") }}>
        <line {...line(34, 20, 60, 28, 3.5)} />
        <circle cx="60" cy="28" r="3.5" fill="currentColor" opacity="0.6" />
      </g>
      <g style={{ transformOrigin: "34px 20px", ...T("kArmL") }}>
        <line {...line(34, 20, 8, 28, 3.5)} />
        <circle cx="8" cy="28" r="3.5" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  );
}

// ─── 4. SQUAT — full body descends with bar on back ──────────────────────────
function IconSquat() {
  return (
    <svg viewBox="0 0 44 60" width="36" height="36" {...SVG_PROPS}>
      <rect x="0" y="14" width="44" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      <g style={T("kSquat")}>
        <circle cx="22" cy="6" r="6" fill="currentColor" />
        <line {...line(22, 12, 22, 19, 5)} />
        <line {...line(22, 19, 10, 19, 3)} />
        <line {...line(22, 19, 34, 19, 3)} />
        <line {...line(22, 19, 22, 33, 5)} />
        <line {...line(22, 33, 30, 46)} />
        <line {...line(30, 46, 32, 56)} />
        <line {...line(22, 33, 14, 46)} />
        <line {...line(14, 46, 12, 56)} />
      </g>
    </svg>
  );
}

// ─── 5. HINGE — torso pivots forward at hip, bar hangs in hands ──────────────
function IconHinge() {
  return (
    <svg viewBox="0 0 56 58" width="36" height="36" {...SVG_PROPS}>
      <line {...line(24, 34, 18, 52)} />
      <line {...line(24, 34, 30, 52)} />
      <g style={{ transformOrigin: "24px 34px", ...T("kHinge") }}>
        <line {...line(24, 34, 24, 12, 5)} />
        <circle cx="24" cy="6" r="6" fill="currentColor" />
        <line {...line(24, 24, 13, 33, 3.5)} />
        <line {...line(24, 24, 35, 33, 3.5)} />
        <rect x="10" y="31" width="30" height="5" rx="2.5" fill="currentColor" opacity="0.45" />
      </g>
    </svg>
  );
}

// ─── 6. CALF RISE — lower body lifts onto toes ───────────────────────────────
function IconCalfRise() {
  return (
    <svg viewBox="0 0 40 56" width="36" height="36" {...SVG_PROPS}>
      <circle cx="20" cy="8" r="6" fill="currentColor" />
      <line {...line(20, 14, 20, 33, 5)} />
      <line {...line(20, 22, 10, 28, 3.5)} />
      <line {...line(20, 22, 30, 28, 3.5)} />
      <g style={T("kCalf")}>
        <line {...line(20, 33, 14, 46)} />
        <line {...line(20, 33, 26, 46)} />
        <line {...line(14, 46, 8,  43, 3.5)} />
        <line {...line(26, 46, 32, 43, 3.5)} />
      </g>
    </svg>
  );
}

// ─── 7. CORE RAISE — hanging leg raise ───────────────────────────────────────
function IconCoreRaise() {
  return (
    <svg viewBox="0 0 40 62" width="36" height="36" {...SVG_PROPS}>
      <rect x="2" y="1" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      <line {...line(20, 6,  12, 13, 3.5)} />
      <line {...line(20, 6,  28, 13, 3.5)} />
      <circle cx="20" cy="19" r="6" fill="currentColor" />
      <line {...line(20, 25, 20, 40, 5)} />
      <g style={{ transformOrigin: "20px 40px", ...T("kLegUp") }}>
        <line {...line(20, 40, 14, 56)} />
        <line {...line(20, 40, 26, 56)} />
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
