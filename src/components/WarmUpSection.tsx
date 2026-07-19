"use client";

import { useState } from "react";
import type { DayType } from "@/logic/program";

const GENERAL = [
  { ex: "Hip circles",                  detail: "10 each leg" },
  { ex: "Thoracic rotation",            detail: "8 each side" },
  { ex: "Shoulder CARS (slow circles)", detail: "5 each direction" },
  { ex: "Bodyweight squat, pause",      detail: "10 reps" },
  { ex: "Glute bridge, 2 s hold",       detail: "10 reps" },
];

const PULSE: Record<string, string> = {
  push:     "Row / bike / incline walk — 3–5 min, easy effort",
  pull:     "Row machine — 3–5 min, focus on back engagement",
  legs:     "Assault bike or incline treadmill — 5 min, build tempo",
  upper:    "Row machine — 3 min easy",
  legsCore: "Incline treadmill walk or rower — 5 min easy",
};

const ACTIVATION: Record<string, { ex: string; detail: string }[]> = {
  push: [
    { ex: "Band pull-aparts",  detail: "15 reps — offsets anterior load" },
    { ex: "Face pull (light)", detail: "15 reps — external rotation prep" },
  ],
  pull: [
    { ex: "Dead hang from bar",    detail: "20–30 sec — decompress spine, grip" },
    { ex: "Scapular pull-ups",     detail: "8 reps — prime lats before loading" },
  ],
  legs: [
    { ex: "Cossack squat",             detail: "5 each side — hip mobility" },
    { ex: "Single-leg glute bridge",   detail: "10 each — fire glutes before squatting" },
  ],
  upper: [
    { ex: "Band pull-aparts",          detail: "15 reps" },
    { ex: "Shoulder CARS (repeat)",    detail: "5 each — extra prep for pressing + rowing" },
  ],
  legsCore: [
    { ex: "Cossack squat",             detail: "5 each side" },
    { ex: "Single-leg glute bridge",   detail: "10 each" },
    { ex: "Dead bug",                  detail: "8 each side — core pre-activation" },
  ],
};

interface WarmUpSectionProps {
  type: DayType;
  testDay: boolean;
  deload: boolean;
}

export function WarmUpSection({ type, testDay, deload }: WarmUpSectionProps) {
  const [open, setOpen] = useState(false);

  if (type === "rest") return null;

  const pulse      = PULSE[type] ?? "Row / bike — 3–5 min easy";
  const activation = ACTIVATION[type] ?? [];

  return (
    <div className="border-b border-white/[0.06] mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-3"
      >
        <span className="text-[10px] font-bold tracking-[2px] text-neutral-500 uppercase">
          Warm-Up
        </span>
        <span className="text-[10px] text-neutral-600">
          {open ? "hide ▲" : "show ▼"}
        </span>
      </button>

      {open && (
        <div className="pb-5 flex flex-col gap-5">

          {/* 1. Pulse raise */}
          <div>
            <p className="text-[9px] font-bold tracking-[2px] text-neutral-600 uppercase mb-2">
              1 · Pulse Raise &nbsp;3–5 min
            </p>
            <p className="text-[13px] text-neutral-400 leading-snug">{pulse}</p>
          </div>

          {/* 2. Movement prep */}
          <div>
            <p className="text-[9px] font-bold tracking-[2px] text-neutral-600 uppercase mb-2">
              2 · Movement Prep &nbsp;every session
            </p>
            <div className="flex flex-col gap-1.5">
              {GENERAL.map(({ ex, detail }) => (
                <div key={ex} className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-white/70">{ex}</span>
                  <span className="text-[11px] text-neutral-600 tabular-nums flex-none">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Day-specific activation */}
          {activation.length > 0 && (
            <div>
              <p className="text-[9px] font-bold tracking-[2px] text-neutral-600 uppercase mb-2">
                3 · {type === "legsCore" ? "Legs + Core" : type.charAt(0).toUpperCase() + type.slice(1)} Activation
              </p>
              <div className="flex flex-col gap-1.5">
                {activation.map(({ ex, detail }) => (
                  <div key={ex} className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] text-white/70">{ex}</span>
                    <span className="text-[11px] text-neutral-600 flex-none text-right max-w-[140px]">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test day extra note */}
          {testDay && (
            <p className="text-[11px] text-amber-500/80 border-l-2 border-amber-500/40 pl-3 leading-relaxed">
              Test day: do 3–4 progressively heavier singles on each lift before your test weight. Leave 4 min rest between attempts.
            </p>
          )}

          {/* Deload note */}
          {deload && (
            <p className="text-[11px] text-neutral-500 border-l-2 border-white/[0.1] pl-3 leading-relaxed">
              Deload week: keep the movement prep, skip or shorten the activation. You don't need to prime for easy effort.
            </p>
          )}

          {/* Ramp-up reminder */}
          <p className="text-[11px] text-neutral-600 italic">
            Ramp-up sets are already built into each exercise below — don't skip them.
          </p>
        </div>
      )}
    </div>
  );
}
