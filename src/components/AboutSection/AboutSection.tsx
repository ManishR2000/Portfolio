import { motion } from "framer-motion";
import { Briefcase, Presentation, Palette, Frame } from "lucide-react";
import { about } from "../../content";
import { CountUp } from "@/components/lightswind/count-up";

// "100+" -> 100 and "+", so the number can count up and the symbol stays beside it
const splitStat = (v: string) => {
  const m = v.match(/^([\d.]+)(.*)$/);
  return m ? { num: parseFloat(m[1]), suffix: m[2] } : { num: 0, suffix: v };
};

// Icon and colour shade for each stat card, in order (deeper icon colour in light mode, brighter in dark)
const STAT_STYLE = [
  { icon: Briefcase, rgb: "99,102,241", light: "#4f46e5", dark: "#818cf8" }, // years of experience: indigo
  { icon: Presentation, rgb: "245,158,11", light: "#d97706", dark: "#fbbf24" }, // decks: amber
  { icon: Palette, rgb: "6,182,212", light: "#0891b2", dark: "#22d3ee" }, // branded marketing assets: cyan
  { icon: Frame, rgb: "16,185,129", light: "#059669", dark: "#34d399" }, // Figma screens: emerald
];
const stats = about.stats.map((stat, i) => ({ ...stat, ...STAT_STYLE[i % STAT_STYLE.length] }));

export const AboutSection = () => {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-6 py-16">
      <motion.div
        className="flex flex-col lg:flex-row gap-16 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {about.heading}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {about.paragraph}
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 min-[480px]:grid-cols-2 gap-4 w-full">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border transition-colors group relative overflow-hidden will-change-transform"
                style={{
                  background: `linear-gradient(135deg, rgba(${stat.rgb},0.12), rgba(${stat.rgb},0.02) 70%)`,
                  borderColor: `rgba(${stat.rgb},0.25)`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                // The staggered delay belongs to the entrance only...
                whileInView={{ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }}
                // ...so hover (and un-hover) responds instantly with a quick, smooth spring
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                viewport={{ once: true }}
              >
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `rgba(${stat.rgb},0.25)` }}
                />
                <div
                  className="relative mb-5 w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--icon-light)] dark:text-[var(--icon-dark)]"
                  style={{ background: `rgba(${stat.rgb},0.15)`, border: `1px solid rgba(${stat.rgb},0.3)`, "--icon-light": stat.light, "--icon-dark": stat.dark } as React.CSSProperties}
                >
                  <Icon className="w-8 h-8" strokeWidth={1.75} />
                </div>
                <h3 className="relative mb-1">
                  {/* Lightswind Count Up, with the demo's settings: counts up when the card scrolls into view */}
                  <CountUp
                    value={splitStat(stat.value).num}
                    suffix={splitStat(stat.value).suffix}
                    duration={1.5}
                    animationStyle="energetic"
                    className="text-4xl font-extrabold tracking-tight text-foreground"
                  />
                </h3>
                <p className="relative text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

