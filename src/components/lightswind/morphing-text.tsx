import { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

export interface MorphingTextProps {
  texts: string[];
  className?: string;
  /** Seconds each crossfade between two words takes */
  morphTime?: number;
  /** Seconds each word is held fully visible */
  cooldownTime?: number;
}

// Smooth start and end, so every fade has the same even feel
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function MorphingText({ texts, className, morphTime = 1.5, cooldownTime = 0.6 }: MorphingTextProps) {
  const outgoingRef = useRef<HTMLSpanElement>(null);
  const incomingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outgoing = outgoingRef.current;
    const incoming = incomingRef.current;
    if (!texts.length || !outgoing || !incoming) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = cooldownTime * 1000;
    const morph = morphTime * 1000;
    const cycle = hold + morph;
    const start = performance.now();
    let frame = 0;

    const show = (el: HTMLSpanElement, text: string, opacity: number, blur: number) => {
      if (el.textContent !== text) el.textContent = text;
      el.style.opacity = String(opacity);
      el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "none";
    };

    // Every word follows the same clock: hold, then crossfade into the next word
    const tick = (now: number) => {
      const elapsed = now - start;
      const index = Math.floor(elapsed / cycle);
      const phase = elapsed - index * cycle;
      const current = texts[index % texts.length];
      const next = texts[(index + 1) % texts.length];

      if (phase < hold || texts.length === 1) {
        show(outgoing, current, 1, 0);
        show(incoming, next, 0, 0);
      } else {
        const f = easeInOut((phase - hold) / morph);
        const blur = reduceMotion ? 0 : 8;
        show(outgoing, current, 1 - f, blur * f);
        show(incoming, next, f, blur * (1 - f));
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [texts, morphTime, cooldownTime]);

  // The longest word reserves the space, so the layout never shifts between words
  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <div className={cn("relative inline-flex items-center justify-center font-extrabold tracking-tight select-none", className)}>
      <span ref={outgoingRef} className="absolute inset-0 flex items-center justify-center text-center will-change-[opacity,filter]" />
      <span ref={incomingRef} aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-center will-change-[opacity,filter]" />
      <span className="opacity-0 pointer-events-none px-2 py-1" aria-hidden="true">
        {longestText}
      </span>
    </div>
  );
}

export default MorphingText;
