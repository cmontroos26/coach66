"use client";

import { getPattern } from "@/logic/program";

// Filled human silhouette illustrations — Apple Fitness / Peloton style.
// All shapes use fill="currentColor" (amber in context).
// Static, no animation.

const S = { display: "block" } as React.CSSProperties;

// ─── 1. PRESS — standing, arms pressing bar overhead ─────────────────────────
function IconPress() {
  return (
    <svg viewBox="0 0 48 64" width="38" height="38" style={S}>
      {/* Bar + plates */}
      <rect x="0"  y="3" width="5"  height="9" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="43" y="3" width="5"  height="9" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="5"  y="5" width="38" height="5" rx="2" fill="currentColor" opacity="0.35" />
      {/* Left arm — raised up-left */}
      <ellipse cx="11" cy="15" rx="3.5" ry="10" transform="rotate(-38 11 15)" fill="currentColor" />
      {/* Right arm — raised up-right */}
      <ellipse cx="37" cy="15" rx="3.5" ry="10" transform="rotate(38 37 15)" fill="currentColor" />
      {/* Head */}
      <circle cx="24" cy="20" r="7" fill="currentColor" />
      {/* Torso */}
      <ellipse cx="24" cy="36" rx="8" ry="10" fill="currentColor" />
      {/* Left leg */}
      <ellipse cx="19" cy="54" rx="4" ry="9" fill="currentColor" />
      {/* Right leg */}
      <ellipse cx="29" cy="54" rx="4" ry="9" fill="currentColor" />
    </svg>
  );
}

// ─── 2. PULL — hanging from bar, chin above bar (pull-up) ────────────────────
function IconPull() {
  return (
    <svg viewBox="0 0 48 66" width="38" height="38" style={S}>
      {/* Bar */}
      <rect x="2" y="2" width="44" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      {/* Left arm — up to bar */}
      <ellipse cx="12" cy="14" rx="3.5" ry="11" transform="rotate(-30 12 14)" fill="currentColor" />
      {/* Right arm — up to bar */}
      <ellipse cx="36" cy="14" rx="3.5" ry="11" transform="rotate(30 36 14)" fill="currentColor" />
      {/* Head */}
      <circle cx="24" cy="20" r="7" fill="currentColor" />
      {/* Torso */}
      <ellipse cx="24" cy="36" rx="8" ry="10" fill="currentColor" />
      {/* Left leg hanging */}
      <ellipse cx="20" cy="54" rx="4" ry="9" fill="currentColor" />
      {/* Right leg hanging */}
      <ellipse cx="28" cy="54" rx="4" ry="9" fill="currentColor" />
    </svg>
  );
}

// ─── 3. RAISE — arms extended out to sides at shoulder height ────────────────
function IconRaise() {
  return (
    <svg viewBox="0 0 72 64" width="38" height="38" style={S}>
      {/* Head */}
      <circle cx="36" cy="8" r="7" fill="currentColor" />
      {/* Left arm — horizontal out to left */}
      <ellipse cx="16" cy="24" rx="13" ry="3.5" fill="currentColor" />
      {/* Right arm — horizontal out to right */}
      <ellipse cx="56" cy="24" rx="13" ry="3.5" fill="currentColor" />
      {/* Dumbbell left */}
      <rect x="1"  y="19" width="5" height="10" rx="2" fill="currentColor" opacity="0.5" />
      {/* Dumbbell right */}
      <rect x="66" y="19" width="5" height="10" rx="2" fill="currentColor" opacity="0.5" />
      {/* Torso */}
      <ellipse cx="36" cy="36" rx="9" ry="11" fill="currentColor" />
      {/* Left leg */}
      <ellipse cx="30" cy="54" rx="4" ry="9" fill="currentColor" />
      {/* Right leg */}
      <ellipse cx="42" cy="54" rx="4" ry="9" fill="currentColor" />
    </svg>
  );
}

// ─── 4. SQUAT — bar on back, deep squat position ─────────────────────────────
function IconSquat() {
  return (
    <svg viewBox="0 0 54 60" width="38" height="38" style={S}>
      {/* Bar + plates */}
      <rect x="0"  y="14" width="5"  height="9" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="49" y="14" width="5"  height="9" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="5"  y="16" width="44" height="5" rx="2" fill="currentColor" opacity="0.35" />
      {/* Head */}
      <circle cx="27" cy="8" r="7" fill="currentColor" />
      {/* Arms holding bar — horizontal */}
      <ellipse cx="11" cy="19" rx="10" ry="3" fill="currentColor" />
      <ellipse cx="43" cy="19" rx="10" ry="3" fill="currentColor" />
      {/* Torso — compact (squat crouched) */}
      <ellipse cx="27" cy="28" rx="9" ry="7" fill="currentColor" />
      {/* Left thigh — angled out-down */}
      <ellipse cx="16" cy="40" rx="4" ry="10" transform="rotate(-30 16 40)" fill="currentColor" />
      {/* Right thigh — angled out-down */}
      <ellipse cx="38" cy="40" rx="4" ry="10" transform="rotate(30 38 40)" fill="currentColor" />
      {/* Left shin — angled inward */}
      <ellipse cx="10" cy="53" rx="3.5" ry="8" transform="rotate(18 10 53)" fill="currentColor" />
      {/* Right shin */}
      <ellipse cx="44" cy="53" rx="3.5" ry="8" transform="rotate(-18 44 53)" fill="currentColor" />
    </svg>
  );
}

// ─── 5. HINGE — side profile, torso bent forward, bar in hands ───────────────
function IconHinge() {
  return (
    <svg viewBox="0 0 62 64" width="38" height="38" style={S}>
      {/* Bar + plates */}
      <rect x="1"  y="40" width="5"  height="12" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="6"  y="43" width="30" height="6"  rx="3" fill="currentColor" opacity="0.35" />
      <rect x="36" y="40" width="5"  height="12" rx="2" fill="currentColor" opacity="0.5" />
      {/* Arms — vertical (hanging to bar) */}
      <ellipse cx="20" cy="38" rx="3" ry="9" fill="currentColor" />
      {/* Torso — angled forward ~55° */}
      <ellipse cx="28" cy="24" rx="8" ry="16" transform="rotate(55 28 24)" fill="currentColor" />
      {/* Head — at forward end of torso */}
      <circle cx="50" cy="14" r="7" fill="currentColor" />
      {/* Left leg straight down */}
      <ellipse cx="21" cy="54" rx="4" ry="9" fill="currentColor" />
      {/* Right leg — behind left (slightly offset) */}
      <ellipse cx="27" cy="54" rx="3.5" ry="9" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

// ─── 6. CALF RISE — standing on toes, heels elevated ────────────────────────
function IconCalfRise() {
  return (
    <svg viewBox="0 0 48 66" width="38" height="38" style={S}>
      {/* Head */}
      <circle cx="24" cy="7" r="7" fill="currentColor" />
      {/* Torso */}
      <ellipse cx="24" cy="23" rx="8" ry="10" fill="currentColor" />
      {/* Arms by sides */}
      <ellipse cx="13" cy="27" rx="3" ry="8" fill="currentColor" />
      <ellipse cx="35" cy="27" rx="3" ry="8" fill="currentColor" />
      {/* Left leg — straight */}
      <ellipse cx="19" cy="43" rx="4" ry="9" fill="currentColor" />
      {/* Right leg */}
      <ellipse cx="29" cy="43" rx="4" ry="9" fill="currentColor" />
      {/* Calves rising — angled forward (on toes) */}
      <ellipse cx="17" cy="56" rx="3.5" ry="7" transform="rotate(14 17 56)" fill="currentColor" />
      <ellipse cx="31" cy="56" rx="3.5" ry="7" transform="rotate(-14 31 56)" fill="currentColor" />
    </svg>
  );
}

// ─── 7. CORE RAISE — hanging, legs raised parallel ───────────────────────────
function IconCoreRaise() {
  return (
    <svg viewBox="0 0 54 68" width="38" height="38" style={S}>
      {/* Bar */}
      <rect x="2" y="2" width="50" height="5" rx="2.5" fill="currentColor" opacity="0.35" />
      {/* Left arm — up to bar */}
      <ellipse cx="14" cy="15" rx="3.5" ry="12" transform="rotate(-20 14 15)" fill="currentColor" />
      {/* Right arm */}
      <ellipse cx="40" cy="15" rx="3.5" ry="12" transform="rotate(20 40 15)" fill="currentColor" />
      {/* Head */}
      <circle cx="27" cy="22" r="7" fill="currentColor" />
      {/* Torso */}
      <ellipse cx="27" cy="38" rx="8" ry="10" fill="currentColor" />
      {/* Legs raised — angled forward (L-sit / tuck) */}
      <ellipse cx="16" cy="48" rx="4" ry="10" transform="rotate(-60 16 48)" fill="currentColor" />
      <ellipse cx="38" cy="48" rx="4" ry="10" transform="rotate(60 38 48)" fill="currentColor" />
      {/* Lower legs tucked */}
      <ellipse cx="8"  cy="54" rx="3.5" ry="8" transform="rotate(-30 8 54)"  fill="currentColor" opacity="0.8" />
      <ellipse cx="46" cy="54" rx="3.5" ry="8" transform="rotate(30 46 54)"  fill="currentColor" opacity="0.8" />
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
  return <Icon />;
}
