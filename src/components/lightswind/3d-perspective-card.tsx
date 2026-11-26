// Lightswind UI: 3D Perspective Card (lightswind.com/components/3d-perspective-card), Manual-tab version supplied by Manish.
// The animation code (tilt, float, shine, parallax and shadow maths, transitions) is unchanged.
// PORTFOLIO FIX notes mark compatibility edits; PORTFOLIO CHANGE marks the motion changes Manish asked for.
//   1. Mouse position is read relative to the visible screen (clientX/clientY), not the whole page (pageX/pageY).
//   PORTFOLIO CHANGE (requested by Manish): each card reacts to the mouse relative to itself, only the card nearest
//      the mouse moves, and the amounts are subtler. See SUBTLE below.
//   2. The original styles use Next.js "styled-jsx", which this Vite site doesn't have. They are kept identical but
//      prefixed with "tdpc-" so generic names like ".card" can't clash with the rest of the site.
//   3. Optional children are shown on the card face (used for the case-study text), and image links are quoted.
//   4. Visitors who turn on reduced motion get a still card.
//   5. The outer area's padding can be overridden (containerStyle), so the card can line up with page spacing.
"use client";

import React, { useRef, useEffect } from "react";

interface ThreeDPerspectiveCardProps {
  /** The URL for the background image of the card. */
  image: string;
  /** Optional width of the card (e.g., "300px"). Defaults to "300px". */
  width?: string;
  /** Optional height of the card (e.g., "350px"). Defaults to "350px". */
  height?: string;
  /** PORTFOLIO FIX 3: optional content shown on the card face */
  children?: React.ReactNode;
  /** PORTFOLIO FIX 5: optional override for the outer area's padding/min-height (the demo uses 40px and 400px) */
  containerStyle?: React.CSSProperties;
}

// PORTFOLIO CHANGE (requested by Manish): subtle motion, one card at a time.
// Original amounts: 10° tilt, 20px float, image pan across 0–100%, shine up to 0.7.
const SUBTLE = {
  maxRotation: 4, // degrees of tilt
  maxTranslate: 6, // px of float
  maxPan: 6, // % the image pans either side of centre
  maxShine: 0.3, // strongest shine opacity
  activateWithin: 60, // px around a card where the mouse still counts as "near" it
  settle: 0.6, // seconds to ease back to rest
};

// Every card on the page, so each one can tell whether it is the nearest to the mouse
const ALL_CARDS = new Set<HTMLDivElement>();

const nearestCard = (x: number, y: number): HTMLDivElement | null => {
  let best: HTMLDivElement | null = null;
  let bestDistance = Infinity;
  for (const el of ALL_CARDS) {
    const r = el.getBoundingClientRect();
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    const d = Math.hypot(dx, dy); // 0 when the mouse is over the card
    if (d < bestDistance) {
      bestDistance = d;
      best = el;
    }
  }
  return bestDistance <= SUBTLE.activateWithin ? best : null;
};

const ThreeDPerspectiveCard: React.FC<ThreeDPerspectiveCardProps> = ({
  image,
  width = "300px",
  height = "350px",
  children,
  containerStyle,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is an optimization: the mouse move listener should only be
    // added if the client is ready and references exist.
    if (!cardRef.current || !shineRef.current || !shadowRef.current || !wrapRef.current) {
      return;
    }
    // PORTFOLIO FIX 4
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const wrap = wrapRef.current;
    ALL_CARDS.add(wrap);
    let active = false;

    // Back to the card's resting state, with a slower ease so it settles gently
    const reset = () => {
      if (!active || !cardRef.current || !shineRef.current || !shadowRef.current) return;
      active = false;
      cardRef.current.style.transition = `transform ${SUBTLE.settle}s ease-out, background-position ${SUBTLE.settle}s ease-out`;
      shadowRef.current.style.transition = `transform ${SUBTLE.settle}s ease-out`;
      cardRef.current.style.transform = "";
      cardRef.current.style.backgroundPosition = "50% 50%";
      shadowRef.current.style.transform = "";
      shineRef.current.style.background = "";
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!cardRef.current || !shineRef.current || !shadowRef.current) {
        return;
      }

      // PORTFOLIO CHANGE (requested): only the card nearest the mouse reacts
      if (nearestCard(event.clientX, event.clientY) !== wrap) {
        reset();
        return;
      }

      // PORTFOLIO CHANGE (requested): measure the mouse relative to this card, not the whole screen
      const rect = wrap.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const mouseXRatio = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)); // -1 to 1
      const mouseYRatio = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)); // -1 to 1

      // Same effects as the original, with subtle amounts (see SUBTLE above)
      // 1. Rotation for Card (3D Perspective)
      const rotateXDeg = -1 * (mouseYRatio * SUBTLE.maxRotation);
      const rotateYDeg = mouseXRatio * SUBTLE.maxRotation;

      // 2. Translation for Floating Effect
      const transX = mouseXRatio * SUBTLE.maxTranslate;
      const transY = mouseYRatio * SUBTLE.maxTranslate;

      // 3. Shine Angle (for linear-gradient)
      const angle = (Math.atan2(mouseYRatio, mouseXRatio) * 180) / Math.PI - 90;
      const shineIntensity = ((mouseYRatio + 1) / 2) * SUBTLE.maxShine;

      // 4. Background Position (Parallax Effect), panning gently around the centre
      const backgroundPositionX = 50 + mouseXRatio * SUBTLE.maxPan;
      const backgroundPositionY = 50 + mouseYRatio * SUBTLE.maxPan;

      if (!active) {
        active = true;
        cardRef.current.style.transition = "";
        shadowRef.current.style.transition = "";
      }

      shineRef.current.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineIntensity}) 0%, rgba(255,255,255, 0) 80%)`;
      cardRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0) scale(1) rotateX(${rotateXDeg}deg) rotateY(${rotateYDeg}deg)`;
      cardRef.current.style.backgroundPosition = `${backgroundPositionX}% ${backgroundPositionY}%`;

      // Shadow: a subtle opposite movement and rotation for a deeper shadow effect
      shadowRef.current.style.transform = `scale(.9,.9) translateX(${-transX * 0.6}px) translateY(${10 - transY * 0.6}px) rotateY(${rotateYDeg * 0.5}deg) rotateX(${rotateXDeg * 0.5}deg)`;
    };

    // Attach listener to the whole document
    document.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", reset);
    return () => {
      ALL_CARDS.delete(wrap);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div className="tdpc-parent" style={containerStyle}>
      <div className="tdpc-wrap" ref={wrapRef} style={{ width, height }}>
        <div className="tdpc-shadow" ref={shadowRef}></div>
        <div
          className="tdpc-card"
          ref={cardRef}
          style={{
            backgroundImage: `url("${image}")`,
            // Background size is large to allow for parallax scrolling effect
            backgroundSize: "450%",
          }}
        >
          <div className="tdpc-front">
            {children}
            <div className="tdpc-shine" ref={shineRef}></div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO FIX 2: same styles as the original styled-jsx block, with prefixed class names */}
      <style>{`
        .tdpc-parent {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          position: relative;
          width: 100%;
          padding: 40px;
        }

        .tdpc-wrap {
          perspective: 1000px;
          position: relative;
          /* width and height come from the width/height props (set inline above) */
        }

        .tdpc-shadow,
        .tdpc-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          transition: transform 0.15s ease-out, background-position 0.15s ease-out;
          will-change: transform, background-position;
        }

        .tdpc-card {
          background: #fff 50% 50%;
          z-index: 2;
        }

        .tdpc-shadow {
          background: rgba(0, 0, 0, 0.5);
          filter: blur(25px);
          opacity: 0.8;
          z-index: 1;
          transform: scale(0.9) translateY(10px);
          transition: transform 0.15s ease-out;
        }

        .tdpc-front {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden; /* keeps the case-study text inside the rounded corners */
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tdpc-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          z-index: 10;
          pointer-events: none; /* lets clicks reach the case-study link underneath */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 60%
          );
        }
      `}</style>
    </div>
  );
};

export default ThreeDPerspectiveCard;
