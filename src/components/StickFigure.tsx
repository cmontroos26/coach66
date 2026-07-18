"use client";

import { getPattern } from "@/logic/program";

const KEYFRAMES = `
@keyframes armPress   { 0%,100% { transform: rotate(75deg);   } 50% { transform: rotate(-15deg);  } }
@keyframes armPull    { 0%,100% { transform: rotate(-15deg);  } 50% { transform: rotate(75deg);   } }
@keyframes armRaise   { 0%,100% { transform: rotate(15deg);   } 50% { transform: rotate(-95deg);  } }
@keyframes squatDip   { 0%,100% { transform: translateY(0);   } 50% { transform: translateY(10px);} }
@keyframes calfRise   { 0%,100% { transform: translateY(0);   } 50% { transform: translateY(-6px);} }
@keyframes torsoHinge { 0%,100% { transform: rotate(0deg);    } 50% { transform: rotate(35deg);   } }
@keyframes coreRaise  { 0%,100% { transform: rotate(0deg);    } 50% { transform: rotate(-70deg);  } }
`;

export function StickFigure({ exerciseId }: { exerciseId: string }) {
  const pattern = getPattern(exerciseId);
  const wholeBodyAnim = pattern === "squatDip" ? "squatDip" : pattern === "calfRise" ? "calfRise" : undefined;
  const armAnim       = ["press", "pull", "raise"].includes(pattern) ? `arm${pattern.charAt(0).toUpperCase() + pattern.slice(1)}` : undefined;
  const torsoAnim     = pattern === "hinge" ? "torsoHinge" : undefined;
  const legsAnim      = pattern === "coreRaise" ? "coreRaise" : undefined;

  const anim = (name: string) => ({ animation: `${name} 1.6s ease-in-out infinite` });

  return (
    <>
      <style>{KEYFRAMES}</style>
      <svg viewBox="0 0 100 100" width="40" height="40" style={{ display: "block" }}>
        <g style={wholeBodyAnim ? anim(wholeBodyAnim) : undefined}>
          <g style={legsAnim ? { transformOrigin: "50px 62px", ...anim(legsAnim) } : undefined}>
            <line x1="50" y1="62" x2="42" y2="90" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="62" x2="58" y2="90" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g style={torsoAnim ? { transformOrigin: "50px 62px", ...anim(torsoAnim) } : undefined}>
            <line x1="50" y1="62" x2="50" y2="28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="18" r="10" fill="currentColor" />
            <g style={armAnim ? { transformOrigin: "50px 32px", ...anim(armAnim) } : undefined}>
              <line x1="50" y1="32" x2="74" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}
