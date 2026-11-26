// Skills: top tabs with a sliding pill, hover follower, auto-play progress, direction-aware
// transitions, a per-tab accent glow, and spotlight skill cards.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig, useInView, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { LayoutTemplate, MessagesSquare, Palette, Sparkles } from "lucide-react";
import { skills } from "../../content";
import { toolLogos } from "../TechStackSection/toolLogos";

type Tab = (typeof skills.tabs)[number];

// Icon and accent colour for each tab (keyed by the tab id in content.ts)
const TAB_STYLE: Record<string, { icon: typeof LayoutTemplate; accent: string; rgb: string }> = {
  ui: { icon: LayoutTemplate, accent: "#818cf8", rgb: "99,102,241" },
  research: { icon: MessagesSquare, accent: "#22d3ee", rgb: "6,182,212" },
  visual: { icon: Palette, accent: "#f472b6", rgb: "236,72,153" },
  ai: { icon: Sparkles, accent: "#fbbf24", rgb: "245,158,11" },
};
const styleFor = (id: string) => TAB_STYLE[id] ?? TAB_STYLE.ui;

const AUTOPLAY_SECONDS = 7;
// Scroll-step mode (large screens): when the block reaches the top it holds in place and each scroll gesture
// moves exactly one tab; after the last tab the page carries on
const PIN_TOP_PX = 112; // where the block holds, clear of the floating header
const SNAP_ZONE_PX = 160; // how close the block must be to that spot before it locks in
const GESTURE_GAP_MS = 220; // a pause this long between wheel events starts a new gesture (ends trackpad momentum)
const MIN_STEP_MS = 520; // never switch faster than this, so each transition can finish
const SCROLL_MODE_QUERY = "(min-width: 1024px) and (min-height: 840px)"; // the held block (~706px) plus header room must fit on screen

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};
const EASE = [0.22, 1, 0.36, 1] as const;
const PILL_SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;

/* ── Smart-animate style transitions ──
   The panel is never swapped out. Every element stays where it is and only what changes animates:
   text cross-fades in place, the icon tile shifts colour, cards keep their slots and ease to new heights,
   and tools shared between tabs glide to their new positions. */
const SWAP = { duration: 0.3, ease: EASE };
const MOVE = { duration: 0.4, ease: EASE };

// Text that changes in place: the old words fade out while the new ones fade in, in the same spot
const SwapText = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={`grid ${className}`}>
    <AnimatePresence initial={false}>
      <motion.span
        key={text}
        className="[grid-area:1/1]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={SWAP}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  </span>
);

/* ── Skill card: keeps its slot; its text cross-fades; a glow follows the cursor ── */
const SpotlightCard = ({ name, detail, rgb }: { name: string; detail: string; rgb: string }) => {
  const ref = useRef<HTMLLIElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.li
      ref={ref}
      layout
      onMouseMove={onMove}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ ...SWAP, layout: MOVE }}
      // The spring applies to the hover lift only
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 28 } }}
      className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), rgba(${rgb},0.18), transparent 70%)` }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px rgba(${rgb},0.45)` }}
      />
      <SwapText text={name} className="relative font-bold text-foreground" />
      <SwapText text={detail} className="relative text-sm text-muted-foreground leading-relaxed mt-1.5" />
    </motion.li>
  );
};

const ToolChip = ({ tool }: { tool: string }) => {
  const logo = toolLogos[tool];
  return (
    <>
      {logo?.src && <img src={logo.src} alt="" className={`w-4 h-4 object-contain ${logo.invert ? "dark:invert" : ""}`} />}
      {tool}
    </>
  );
};
const CHIP_CLASS = "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/60 text-sm font-medium text-foreground";

/* ── The live panel ── */
const PanelContent = ({ tab }: { tab: Tab }) => {
  const { icon: Icon, accent, rgb } = styleFor(tab.id);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr] gap-8 lg:gap-10">
      <div>
        {/* Icon tile: stays put, shifts colour, and the icon turns into the new one */}
        <motion.div
          className="w-14 h-14 rounded-2xl grid place-items-center mb-5 border"
          animate={{ backgroundColor: `rgba(${rgb},0.14)`, borderColor: `rgba(${rgb},0.35)`, color: accent }}
          transition={SWAP}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={tab.id}
              className="[grid-area:1/1]"
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={SWAP}
            >
              <Icon className="w-7 h-7" />
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          <SwapText text={tab.label} />
        </h3>
        <motion.p layout="position" transition={{ layout: MOVE }} className="text-muted-foreground mt-3 leading-relaxed">
          <SwapText text={tab.summary} />
        </motion.p>

        {tab.tools.length > 0 && (
          <motion.div layout="position" transition={{ layout: MOVE }} className="mt-8">
            <span className="block text-sm font-semibold text-muted-foreground mb-3">Tools</span>
            {/* Tools shared between tabs glide to their new place; new ones pop in, old ones fade out */}
            <motion.div layout className="flex flex-wrap gap-2" transition={{ layout: MOVE }}>
              <AnimatePresence mode="popLayout" initial={false}>
                {tab.tools.map((tool) => (
                  <motion.span
                    key={tool}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ ...SWAP, layout: MOVE }}
                    className={CHIP_CLASS}
                  >
                    <ToolChip tool={tool} />
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Skill cards keep their slots (keyed by position), so they morph rather than reappear */}
      <motion.ul layout transition={{ layout: MOVE }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
        <AnimatePresence mode="popLayout" initial={false}>
          {tab.items.map((item, i) => (
            <SpotlightCard key={i} name={item.name} detail={item.detail} rgb={rgb} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

/* ── A plain copy of a tab's content, laid out invisibly to size the card (no animation) ── */
const PanelSizer = ({ tab }: { tab: Tab }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,320px)_1fr] gap-8 lg:gap-10">
    <div>
      <div className="w-14 h-14 mb-5" />
      <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{tab.label}</h3>
      <p className="mt-3 leading-relaxed">{tab.summary}</p>
      {tab.tools.length > 0 && (
        <div className="mt-8">
          <span className="block text-sm font-semibold mb-3">Tools</span>
          <div className="flex flex-wrap gap-2">
            {tab.tools.map((tool) => <span key={tool} className={CHIP_CLASS}><ToolChip tool={tool} /></span>)}
          </div>
        </div>
      )}
    </div>
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
      {tab.items.map((item) => (
        <li key={item.name} className="rounded-2xl border p-5">
          <span className="block font-bold">{item.name}</span>
          <span className="block text-sm leading-relaxed mt-1.5">{item.detail}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function SkillsTabs({ heading }: { heading: React.ReactNode }) {
  const tabs = skills.tabs;
  const [[active], setActiveDir] = useState<[number, number]>([0, 0]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [userPicked, setUserPicked] = useState(false); // once a visitor clicks, auto-play stops for good
  const [paused, setPaused] = useState(false); // pointer is over the section
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Scroll-step mode: one scroll gesture = one tab ──
  const scrollMode = useMediaQuery(SCROLL_MODE_QUERY);
  const lenis = useLenis();
  const blockRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!scrollMode) return;
    let lastWheel = 0;
    let lastStep = 0;
    let gestureUsed = false;

    const onWheel = (e: WheelEvent) => {
      const block = blockRef.current;
      if (!block || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const now = performance.now();
      const newGesture = now - lastWheel > GESTURE_GAP_MS;
      lastWheel = now;
      if (newGesture) gestureUsed = false;

      const dir = e.deltaY > 0 ? 1 : -1;
      const top = block.getBoundingClientRect().top;
      const current = activeRef.current;
      const canStep = dir > 0 ? current < tabs.length - 1 : current > 0;
      const nearPin = top < PIN_TOP_PX + SNAP_ZONE_PX && top > PIN_TOP_PX - SNAP_ZONE_PX;
      // Let the page scroll normally unless the block is at its spot and there's a tab to move to
      if (!nearPin || !canStep) return;

      // Hold the page: stop the smooth-scroll library and the browser from moving it
      e.preventDefault();
      e.stopPropagation();

      // Arriving at the block: settle it exactly in place; this gesture doesn't change the tab
      if (Math.abs(top - PIN_TOP_PX) > 2) {
        const y = window.scrollY + top - PIN_TOP_PX;
        if (lenis) lenis.scrollTo(y, { duration: 0.45, lock: true, force: true });
        else window.scrollTo({ top: y, behavior: "smooth" });
        gestureUsed = true;
        return;
      }
      // One step per gesture, and not faster than the transition
      if (gestureUsed || now - lastStep < MIN_STEP_MS) return;
      gestureUsed = true;
      lastStep = now;
      setActiveDir([current + dir, dir]);
    };

    // Capture phase on the document runs before the smooth-scroll library's own wheel handler
    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => document.removeEventListener("wheel", onWheel, { capture: true });
  }, [scrollMode, lenis, tabs.length]);

  const select = (i: number, byUser: boolean) => {
    setActiveDir(([prev]) => [i, i === prev ? 0 : i > prev ? 1 : -1]);
    if (byUser) setUserPicked(true);
  };
  // Auto-play only when not in scroll-step mode (phones and short screens)
  const autoplay = !scrollMode && !userPicked && !paused && inView && !reduceMotion;

  // Keep the active tab visible when the tab bar scrolls sideways on phones.
  // Scrolls only the tab bar itself, never the page.
  const tabListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = tabListRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const next = e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  const { rgb } = styleFor(tabs[active].id);

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={(el) => { blockRef.current = el; (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {heading}
        {/* ── Tab bar ── */}
        <div className="flex justify-center mb-8">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Skill areas"
            onMouseLeave={() => setHovered(null)}
            className="relative flex gap-1 p-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] backdrop-blur-md max-w-full overflow-x-auto [scrollbar-width:none]"
          >
            {tabs.map((tab, i) => {
              const { icon: Icon, accent, rgb: tabRgb } = styleFor(tab.id);
              const isActive = active === i;
              return (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`skill-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls="skill-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(i, true)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  onMouseEnter={() => setHovered(i)}
                  className={`relative shrink-0 flex items-center gap-2 rounded-full px-4 md:px-5 py-2.5 text-sm md:text-base font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {/* Hover follower: a faint pill that glides to whichever tab the mouse is over */}
                  {hovered === i && !isActive && (
                    <motion.span layoutId="skill-tab-hover" transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full bg-foreground/[0.06]" />
                  )}
                  {/* Active pill: glides between tabs, tinted with the tab's accent */}
                  {isActive && (
                    <motion.span layoutId="skill-tab-active" transition={PILL_SPRING}
                      className="absolute inset-0 rounded-full bg-card shadow-md overflow-hidden"
                      style={{ boxShadow: `0 0 0 1px rgba(${tabRgb},0.4), 0 8px 24px -8px rgba(${tabRgb},0.55)` }}
                    >
                      {/* Auto-play progress: fills along the bottom, then the next tab opens */}
                      {autoplay && (
                        <motion.span
                          key={`progress-${active}`}
                          className="absolute left-3 right-3 bottom-1 h-[2px] rounded-full origin-left"
                          style={{ background: accent }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTOPLAY_SECONDS, ease: "linear" }}
                          onAnimationComplete={() => select((active + 1) % tabs.length, false)}
                        />
                      )}
                    </motion.span>
                  )}
                  <motion.span
                    className="relative"
                    animate={isActive ? { rotate: [0, -12, 8, 0], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ color: isActive ? accent : undefined }}
                  >
                    <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  </motion.span>
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Panel ── */}
        <motion.div
          id="skill-panel"
          role="tabpanel"
          aria-labelledby={`skill-tab-${tabs[active].id}`}
          className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-card/80 shadow-2xl"
        >
          {/* Ambient glow: drifts and changes colour with the selected tab */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-40 w-[520px] h-[520px] rounded-full blur-3xl"
            animate={{
              left: ["-10%", "55%", "20%", "65%"][active % 4],
              background: `radial-gradient(circle, rgba(${rgb},0.22), transparent 65%)`,
            }}
            transition={{ duration: 1.1, ease: EASE }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(127,127,127,0.18)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />

          {/* Fixed size: every tab's content is laid out invisibly in the same grid cell, so the card always takes
              the height of the tallest tab and nothing below it moves when the tab changes */}
          <div className="relative p-6 md:p-10 grid">
            {tabs.map((tab) => (
              <div key={`size-${tab.id}`} aria-hidden className="invisible [grid-area:1/1]">
                <PanelSizer tab={tab} />
              </div>
            ))}
            <div className="[grid-area:1/1]">
              <PanelContent tab={tabs[active]} />
            </div>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
