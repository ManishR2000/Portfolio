import { motion } from "framer-motion";
import { ArrowUpRight, Presentation, ImageIcon } from "lucide-react";
import { projects } from "../../content";
import { BehanceIcon } from "../icons/BehanceIcon";
import { ThreeDScrollTriggerContainer, ThreeDScrollTriggerRow } from "../lightswind/3d-scroll-trigger";
import ThreeDHoverGallery from "../lightswind/hover-gallery-3d";
import ThreeDPerspectiveCard from "../lightswind/3d-perspective-card";


const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6 },
  viewport: { once: true, amount: 0.1 },
});

const SubHeading = ({ title, intro }: { title: string; intro?: string }) => (
  <motion.div {...reveal()} className="mb-8">
    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{title}</h3>
    {intro && <p className="text-muted-foreground mt-2">{intro}</p>}
  </motion.div>
);

/* ── UI/UX case studies: Lightswind 3D Perspective Card ── */
// Indigo stand-in image until a real cover is added
const CASE_STUDY_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f46e5"/><stop offset=".5" stop-color="#312e81"/><stop offset="1" stop-color="#0b0a1f"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/></svg>`
)}`;

const CaseStudyCard = ({ item, index }: { item: (typeof projects.ux.items)[number]; index: number }) => {
  const content = (
    <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8 bg-gradient-to-t from-black/90 via-black/35 to-transparent text-left">
      <span className="self-start mb-3 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold">
        Case study
      </span>
      <h4 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">{item.title}</h4>
      <p className="text-sm md:text-base font-medium text-white/80">{item.subtitle}</p>
      {item.link && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
          View case study <ArrowUpRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );

  return (
    <motion.div {...reveal(index * 0.1)}>
      <ThreeDPerspectiveCard
        image={item.image || CASE_STUDY_PLACEHOLDER}
        width="100%"
        height="420px"
        // No padding above, so the gap under the heading matches the other sub-sections; a little room below and at the sides for the tilt
        containerStyle={{ padding: "0 8px 16px", minHeight: 0 }}
      >
        {item.link ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} case study`}>
            {content}
          </a>
        ) : (
          content
        )}
      </ThreeDPerspectiveCard>
    </motion.div>
  );
};

const SeeMoreButton = ({ label, url }: { label: string; url: string }) => (
  <div className="mt-8 flex justify-center">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full px-6 h-12 border border-foreground/15 glass-panel text-foreground font-semibold hover:border-primary/50 hover:-translate-y-0.5 transition-all"
    >
      <BehanceIcon /> {label}
      <ArrowUpRight className="w-4 h-4" />
    </a>
  </div>
);

/* ── Presentation: two scroll-reactive rows (Lightswind 3D Scroll Trigger) ── */
const SLIDE_PLACEHOLDERS = 18;
const ROWS = 3;

const SlideCard = ({ src, n }: { src: string; n: number }) => (
  <div className="h-40 md:h-56 aspect-video mx-4 inline-flex shrink-0 rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/[0.03] shadow-lg">
    {src ? (
      <img src={src} alt={`Presentation slide ${n}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/60 bg-gradient-to-br from-primary/10 to-transparent">
        <Presentation className="w-8 h-8" strokeWidth={1.25} />
        <span className="text-xs font-medium flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" /> Slide {n}
        </span>
      </div>
    )}
  </div>
);

const PresentationScroller = ({ images, seeMoreLabel, seeMoreUrl }: { images: string[]; seeMoreLabel: string; seeMoreUrl: string }) => {
  const all = images.length ? images : Array.from({ length: SLIDE_PLACEHOLDERS }, () => "");
  // Deal the slides across three rows (1st, 2nd, 3rd, 1st, ...) so each row gets a mix.
  // With only a few images, every row shows all of them so no row looks empty.
  const rows = Array.from({ length: ROWS }, (_, r) =>
    all.length >= ROWS * 3
      ? all.map((src, i) => ({ src, n: i + 1 })).filter((_, i) => i % ROWS === r)
      : all.map((src, i) => ({ src, n: i + 1 }))
  );

  return (
    <motion.div {...reveal(0.1)}>
      {/* Lightswind demo layout, slowed from baseVelocity 6 to 4 at Manish's request; directions 1 / -1 / 1, row padding py-2 / py-2 / py-4 */}
      <ThreeDScrollTriggerContainer className="w-full">
        <ThreeDScrollTriggerRow baseVelocity={4} direction={1} className="py-2">
          {rows[0].map((slide) => <SlideCard key={slide.n} src={slide.src} n={slide.n} />)}
        </ThreeDScrollTriggerRow>
        <ThreeDScrollTriggerRow baseVelocity={4} direction={-1} className="py-2">
          {rows[1].map((slide) => <SlideCard key={slide.n} src={slide.src} n={slide.n} />)}
        </ThreeDScrollTriggerRow>
        <ThreeDScrollTriggerRow baseVelocity={4} direction={1} className="py-4">
          {rows[2].map((slide) => <SlideCard key={slide.n} src={slide.src} n={slide.n} />)}
        </ThreeDScrollTriggerRow>
      </ThreeDScrollTriggerContainer>
      <SeeMoreButton label={seeMoreLabel} url={seeMoreUrl} />
    </motion.div>
  );
};

/* ── Visual design: Lightswind 3D Hover Gallery (used with its demo defaults) ── */
type VisualItem = { url: string; title: string; category: string; description: string };
const PLACEHOLDER_ITEMS = 7;

// Colourful stand-in images until real designs are added
const placeholderImage = (n: number) => {
  const hue = (n * 47 + 250) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},70%,55%)"/><stop offset="1" stop-color="hsl(${(hue + 50) % 360},65%,25%)"/>
    </linearGradient></defs>
    <rect width="400" height="500" fill="url(#g)"/>
  </svg>`;
  return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, glow: `hsla(${hue},80%,60%,0.35)` };
};

const placeholders = Array.from({ length: PLACEHOLDER_ITEMS }, (_, i) => {
  const { url, glow } = placeholderImage(i + 1);
  return { url, glow, title: `Design ${i + 1}`, category: "Visual design", description: "Your poster, social post or event design goes here." };
});

// Glow colours for real designs, cycling through the gallery's own palette
const GLOWS = ["rgba(236,72,153,0.35)", "rgba(6,182,212,0.35)", "rgba(139,92,246,0.35)", "rgba(245,158,11,0.35)", "rgba(239,68,68,0.35)", "rgba(16,185,129,0.35)", "rgba(168,85,247,0.35)"];

const VisualHoverGallery = ({ items, seeMoreLabel, seeMoreUrl }: { items: VisualItem[]; seeMoreLabel: string; seeMoreUrl: string }) => {
  const galleryItems = items.length ? items.map((item, i) => ({ ...item, glow: GLOWS[i % GLOWS.length] })) : placeholders;
  return (
    <motion.div {...reveal(0.1)} className="-mt-4">
      {/* -mt-4 offsets the gallery's own 16px top padding, so the gap under the heading matches the other sub-sections */}
      <ThreeDHoverGallery items={galleryItems} />
      <SeeMoreButton label={seeMoreLabel} url={seeMoreUrl} />
    </motion.div>
  );
};

export const ProjectsSection = () => (
  <section id="projects" className="w-full max-w-7xl mx-auto px-6 py-16 space-y-20">
    <motion.div {...reveal()}>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">{projects.heading}</h2>
      <p className="text-muted-foreground text-center md:text-left max-w-2xl text-lg">{projects.intro}</p>
    </motion.div>

    {/* UI/UX Design */}
    <div>
      <SubHeading title={projects.ux.heading} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.ux.items.map((item, i) => (
          <CaseStudyCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </div>

    {/* Presentation Design */}
    <div>
      <SubHeading title={projects.presentation.heading} intro={projects.presentation.intro} />
      <PresentationScroller
        images={projects.presentation.images}
        seeMoreLabel={projects.presentation.seeMoreLabel}
        seeMoreUrl={projects.presentation.seeMoreUrl}
      />
    </div>

    {/* Visual Design */}
    <div>
      <SubHeading title={projects.visual.heading} intro={projects.visual.intro} />
      <VisualHoverGallery
        items={projects.visual.items}
        seeMoreLabel={projects.visual.seeMoreLabel}
        seeMoreUrl={projects.visual.seeMoreUrl}
      />
    </div>

  </section>
);
