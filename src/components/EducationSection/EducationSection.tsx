import SkillsTabs from "./SkillsTabs";
import { motion } from "framer-motion";
import { GraduationCap, BadgeCheck, Calendar, Building2 } from "lucide-react";
import { MagicCard } from "../lightswind/magic-card";
import { skills, certifications, education } from "../../content";

const cardProps = {
  className: "p-8 rounded-[2.25rem] border border-border/80 bg-card/80 shadow-xl",
  gradientSize: 300,
  gradientColor: "rgba(139, 92, 246, 0.12)",
  gradientFrom: "#8b5cf6",
  gradientTo: "#38bdf8",
};

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
  viewport: { once: true },
});

// Order on the page: Skills → Certifications → Education
export const EducationSection = () => (
  <section id="skills" className="w-full max-w-7xl mx-auto px-6 py-16 space-y-32">
    {/* Skills (on large screens it pins while scrolling moves through the tabs) */}
    <div>
      <SkillsTabs
        heading={
          <motion.h2 {...reveal()} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10">
            {skills.heading}
          </motion.h2>
        }
      />
    </div>

    {/* Certifications */}
    <div>
      <motion.h2 {...reveal()} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10">
        {certifications.heading}
      </motion.h2>
      <motion.div {...reveal(0.1)}>
        <MagicCard {...cardProps}>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
            {certifications.items.map((cert) => (
              <li key={cert} className="flex items-start gap-3 text-base leading-relaxed">
                <BadgeCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/90 font-medium">{cert}</span>
              </li>
            ))}
          </ul>
        </MagicCard>
      </motion.div>
    </div>

    {/* Education */}
    <div id="education">
      <motion.h2 {...reveal()} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-10">
        {education.heading}
      </motion.h2>
      <motion.div {...reveal(0.1)}>
        <MagicCard {...cardProps}>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{education.degree.title}</h3>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground">
                  <Building2 className="w-4 h-4 text-primary" /> {education.degree.school}
                </span>
                <span className="flex items-center gap-1.5 text-primary">
                  <Calendar className="w-4 h-4" /> {education.degree.years}
                </span>
              </div>
            </div>
          </div>
        </MagicCard>
      </motion.div>
    </div>
  </section>
);
