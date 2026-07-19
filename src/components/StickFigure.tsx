"use client";

import { getPattern } from "@/logic/program";

const EMOJI: Record<string, string> = {
  press:     "🏋️",
  pull:      "🧗",
  raise:     "🤸",
  squatDip:  "🦵",
  hinge:     "🏃",
  calfRise:  "🦶",
  coreRaise: "💪",
};

export function StickFigure({ exerciseId }: { exerciseId: string }) {
  const pattern = getPattern(exerciseId);
  return (
    <span style={{ fontSize: "17px", lineHeight: 1, userSelect: "none" }}>
      {EMOJI[pattern] ?? "🏋️"}
    </span>
  );
}
