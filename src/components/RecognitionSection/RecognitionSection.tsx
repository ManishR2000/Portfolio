import { motion } from "framer-motion";
import { Zap, Sparkles, Crown, Award } from "lucide-react";
import { GlowingCards, GlowingCard } from "@/components/lightswind/glowing-cards-lw";
import { recognition } from "../../content";

// Glow colour and icon for each award card, in order (colours from the Lightswind demo)
const CARD_STYLE = [
  { glow: "#10b981", icon: Zap, iconClass: "text-emerald-500" },
  { glow: "#8b5cf6", icon: Sparkles, iconClass: "text-primarylw" },
  { glow: "#f59e0b", icon: Crown, iconClass: "text-amber-500" },
];

export const RecognitionSection = () => (
  <section id="recognition" className="w-full max-w-7xl mx-auto px-6 py-16">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className="mb-16 text-center"
    >
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{recognition.heading}</h2>
      <p className="text-muted-foreground max-w-xl mx-auto">{recognition.intro}</p>
    </motion.div>

    {/* Lightswind Glowing Cards. Each card has its own GlowingCards container, so its glow appears only while the
        cursor is over that card (one shared container would also light the neighbouring cards). */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
      {recognition.awards.map((award, i) => {
        const { glow, icon: Icon, iconClass } = CARD_STYLE[i % CARD_STYLE.length];
        return (
          <GlowingCards key={award.name} enableGlow={true} glowRadius={25} padding="0" maxWidth="100%" className="h-full">
            <GlowingCard glowColor={glow} className="space-y-4 w-full">
              <div className="flex items-center space-x-2">
                <Icon className={`w-6 h-6 ${iconClass}`} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{award.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{award.description}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Award className="w-4 h-4 mr-2" />
                Received {award.count.replace("×", "")} times at McKinsey &amp; Company
              </div>
            </GlowingCard>
          </GlowingCards>
        );
      })}
    </div>
  </section>
);
