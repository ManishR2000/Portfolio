// What I do: four cards in a 2×2 grid. Clicking a card grows it into a detail overlay (a shared-element
// morph, the card itself expands); clicking outside, pressing Esc or the close button shrinks it back, and
// clicking another card switches straight to that one.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, MotionConfig } from "framer-motion";
import { LayoutTemplate, MessagesSquare, Presentation, Palette, Plus, X, CheckCircle2, ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { services } from "../../content";
import { toolLogos } from "../TechStackSection/toolLogos";

type Service = (typeof services.items)[number];

const ICONS: Record<string, typeof LayoutTemplate> = {
  ui: LayoutTemplate,
  research: MessagesSquare,
  presentation: Presentation,
  graphic: Palette,
};
const iconFor = (id: string) => ICONS[id] ?? LayoutTemplate;

const EASE = [0.22, 1, 0.36, 1] as const;
const MORPH = { type: "spring", stiffness: 300, damping: 32 } as const;

/* ── A card in the grid ── */
const ServiceCard = ({ item, onOpen }: { item: Service; onOpen: () => void }) => {
  const Icon = iconFor(item.id);
  return (
    <motion.button
      type="button"
      layoutId={`service-${item.id}`}
      transition={MORPH}
      onClick={onOpen}
      data-service-id={item.id}
      aria-haspopup="dialog"
      className="group relative h-full w-full flex flex-col text-left rounded-[2rem] border border-border/80 bg-card/80 p-8 shadow-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl transition-[border-color,transform,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <motion.div
        layoutId={`service-icon-${item.id}`}
        transition={MORPH}
        className="w-14 h-14 rounded-2xl bg-background border border-border/80 flex items-center justify-center shadow-sm mb-8 text-foreground"
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <motion.h3 layoutId={`service-title-${item.id}`} transition={MORPH} className="text-2xl font-bold mb-3 text-foreground tracking-tight w-fit">
        {item.title}
      </motion.h3>
      <p className="text-muted-foreground leading-relaxed mb-6">{item.description}</p>

      {/* Always-visible prompt (works on touch screens too, unlike hover-only hints); the arrow nudges on hover */}
      <span className="mt-auto pt-5 border-t border-border/60 flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
        View details
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>

      {/* Affordance: shows the card opens */}
      <span className="absolute top-7 right-7 w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-primary/40 group-hover:rotate-90 transition-all duration-300">
        <Plus className="w-4 h-4" />
      </span>
    </motion.button>
  );
};

/* ── The overlay a card grows into ── */
const ServiceOverlay = ({ item, onClose }: { item: Service; onClose: () => void }) => {
  const Icon = iconFor(item.id);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, [item.id]);

  return (
    <motion.div
      layoutId={`service-${item.id}`}
      transition={MORPH}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`service-dialog-title-${item.id}`}
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] border border-border/80 bg-card p-8 md:p-10 shadow-2xl pointer-events-auto"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 w-10 h-10 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
      >
        <X className="w-4 h-4" />
      </button>

      <motion.div
        layoutId={`service-icon-${item.id}`}
        transition={MORPH}
        className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary"
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <motion.h3
        layoutId={`service-title-${item.id}`}
        transition={MORPH}
        id={`service-dialog-title-${item.id}`}
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground w-fit"
      >
        {item.title}
      </motion.h3>

      {/* Details fade in once the card has started to grow, and out quickly when it shrinks back */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.12, duration: 0.35, ease: EASE } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        <p className="text-muted-foreground leading-relaxed mt-4 text-base md:text-lg">{item.summary}</p>

        <span className="block text-sm font-semibold text-muted-foreground mt-8 mb-3">What this includes</span>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {item.points.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.04, duration: 0.3, ease: EASE } }}
              className="flex items-start gap-2.5 text-sm md:text-base font-medium text-foreground/90"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
              {point}
            </motion.li>
          ))}
        </ul>

        {item.tools.length > 0 && (
          <>
            <span className="block text-sm font-semibold text-muted-foreground mt-8 mb-3">Tools</span>
            <div className="flex flex-wrap gap-2">
              {item.tools.map((tool) => {
                const logo = toolLogos[tool];
                return (
                  <span key={tool} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-foreground/10 bg-background/60 text-sm font-medium text-foreground">
                    {logo?.src && <img src={logo.src} alt="" className={`w-4 h-4 object-contain ${logo.invert ? "dark:invert" : ""}`} />}
                    {tool}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export const ServicesSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const lenis = useLenis();
  const open = services.items.find((s) => s.id === openId) ?? null;

  // While the overlay is open: Esc closes it, and the page doesn't scroll underneath
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenId(null); };
    window.addEventListener("keydown", onKey);
    lenis?.stop();
    return () => { window.removeEventListener("keydown", onKey); lenis?.start(); };
  }, [openId, lenis]);

  // Clicking outside the overlay: if the click lands on another card, switch to it; otherwise close
  const onBackdropClick = (e: React.MouseEvent) => {
    const hit = document.elementsFromPoint(e.clientX, e.clientY)
      .map((el) => (el as HTMLElement).closest?.("[data-service-id]") as HTMLElement | null)
      .find((el) => el && el.dataset.serviceId !== openId);
    setOpenId(hit ? hit.dataset.serviceId! : null);
  };

  return (
    <section id="services" className="w-full max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{services.heading}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{services.intro}</p>
      </motion.div>

      <MotionConfig reducedMotion="user">
        <LayoutGroup id="services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative"
              >
                {/* While a card is open, an invisible stand-in keeps its place in the grid (and stays clickable
                    through the backdrop as "switch to this card") */}
                {openId === item.id ? (
                  <div data-service-id={item.id} className="h-full min-h-[240px] rounded-[2rem] border border-dashed border-border/60" aria-hidden />
                ) : (
                  <ServiceCard item={item} onOpen={() => setOpenId(item.id)} />
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="service-overlay"
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
                initial={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
                animate={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
                exit={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={onBackdropClick}
              >
                <ServiceOverlay key={open.id} item={open} onClose={() => setOpenId(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </MotionConfig>
    </section>
  );
};

export default ServicesSection;
