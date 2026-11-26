// Earlier draft: tabs on the left. Kept so it can be switched back in EducationSection.tsx.
import { Fragment, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig, type Variants } from "framer-motion";
import { LayoutTemplate, MessagesSquare, Palette, Sparkles, ChevronRight } from "lucide-react";
import { skills } from "../../content";
import { toolLogos } from "../TechStackSection/toolLogos";

type Tab = (typeof skills.tabs)[number];

const TAB_ICONS: Record<string, typeof LayoutTemplate> = {
  ui: LayoutTemplate,
  research: MessagesSquare,
  visual: Palette,
  ai: Sparkles,
};

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 34 } as const;

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

/* ── Panel content: skills appear one after another ── */
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
const toolVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
};

const PanelContent = ({ tab }: { tab: Tab }) => {
  const Icon = TAB_ICONS[tab.id] ?? Sparkles;
  return (
    <motion.div variants={listVariants} initial="hidden" animate="show" className="p-6 md:p-8 lg:p-10">
      <motion.div variants={itemVariants} className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{tab.label}</h3>
          <p className="text-muted-foreground mt-1">{tab.summary}</p>
        </div>
      </motion.div>

      <motion.ul variants={listVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {tab.items.map((item) => (
          <motion.li
            key={item.name}
            variants={itemVariants}
            className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 hover:border-primary/40 hover:bg-primary/[0.04] transition-colors"
          >
            <span className="block font-bold text-foreground text-sm md:text-base">{item.name}</span>
            <span className="block text-sm text-muted-foreground leading-relaxed mt-1">{item.detail}</span>
          </motion.li>
        ))}
      </motion.ul>

      {tab.tools.length > 0 && (
        <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-border/60">
          <span className="block text-sm font-semibold text-muted-foreground mb-3">Tools</span>
          <motion.div variants={listVariants} className="flex flex-wrap gap-2">
            {tab.tools.map((tool) => {
              const logo = toolLogos[tool];
              return (
                <motion.span
                  key={tool}
                  variants={toolVariants}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/60 text-sm font-medium text-foreground"
                >
                  {logo?.src && (
                    <img src={logo.src} alt="" className={`w-4 h-4 object-contain ${logo.invert ? "dark:invert" : ""}`} />
                  )}
                  {tool}
                </motion.span>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ── Tabs on the left; the selected tab opens into the panel on the right ── */
export default function SkillsTabsVertical() {
  const tabs = skills.tabs;
  const [active, setActive] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs, as with standard tab lists
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,300px)_1fr] items-start">
        {/* Tab list */}
        <div role="tablist" aria-orientation="vertical" aria-label="Skill areas" className="flex flex-col gap-2 md:py-6 relative z-10">
          {tabs.map((tab, i) => {
            const Icon = TAB_ICONS[tab.id] ?? Sparkles;
            const isActive = active === i;
            return (
              <Fragment key={tab.id}>
                <button
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`skill-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`skill-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`group relative w-full text-left rounded-2xl md:rounded-r-none px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  {/* The highlight glides between tabs and, on desktop, joins the panel */}
                  {isActive && (
                    <motion.span
                      layoutId="skill-tab-highlight"
                      transition={SPRING}
                      className="absolute inset-0 rounded-2xl md:rounded-r-none border border-primary/30 md:border-r-0 bg-card md:-mr-px shadow-sm"
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <motion.span
                      animate={{ scale: isActive ? 1.08 : 1, rotate: isActive ? -6 : 0 }}
                      transition={SPRING}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        isActive ? "bg-primary/15 border-primary/30 text-primary" : "bg-foreground/[0.04] border-foreground/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.span>
                    <span className="flex-1">
                      <span className="block font-bold text-base md:text-lg">{tab.label}</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{tab.items.length} skills</span>
                    </span>
                    <motion.span animate={{ rotate: isMobile && isActive ? 90 : 0, x: !isMobile && isActive ? 4 : 0 }} transition={SPRING}>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-primary" : "opacity-40"}`} />
                    </motion.span>
                  </span>
                </button>

                {/* Phones: the panel opens right below its tab */}
                {isMobile && (
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key={tab.id}
                        id={`skill-panel-${tab.id}`}
                        role="tabpanel"
                        aria-labelledby={`skill-tab-${tab.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden rounded-2xl border border-primary/30 bg-card"
                      >
                        <PanelContent tab={tab} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Desktop: the panel fills the remaining space and resizes smoothly between tabs */}
        {!isMobile && (
          <motion.div
            layout
            transition={{ layout: { duration: 0.45, ease: EASE } }}
            id={`skill-panel-${tabs[active].id}`}
            role="tabpanel"
            aria-labelledby={`skill-tab-${tabs[active].id}`}
            className="rounded-3xl border border-primary/30 bg-card shadow-xl overflow-hidden min-h-[420px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tabs[active].id}
                initial={{ opacity: 0, x: 28, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -16, filter: "blur(4px)", transition: { duration: 0.18 } }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <PanelContent tab={tabs[active]} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}
