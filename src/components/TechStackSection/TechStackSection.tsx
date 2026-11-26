import { motion } from "framer-motion";

import { tools } from "../../content";
import { toolLogos } from "./toolLogos";

const initials = (name: string) =>
  name.replace(/^(Adobe|Microsoft|Google)\s+/, "").split(/[\s-]+/).map((w) => w[0]).join("").slice(0, 2);

const TechStackSection = () => {
  return (
    <div className="w-full py-6 border-t border-b border-foreground/10 bg-foreground/[0.02] flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="w-full overflow-hidden relative flex items-center"
      >
        {/* Gradients to fade edges */}
        <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Marquee Animation */}
        <div className="flex w-max animate-[marquee_35s_linear_infinite] whitespace-nowrap items-center hover:[animation-play-state:paused] py-1">
          {[...tools, ...tools].map((tool, i) => (
            <div 
              key={i} 
              className="mx-3 px-5 py-2.5 rounded-full border border-foreground/10 bg-background/80 text-foreground font-medium text-sm flex items-center gap-3 transition-all hover:scale-105 hover:border-primary/50 hover:bg-foreground/5 cursor-default shadow-sm group shrink-0"
            >
              {toolLogos[tool]?.src ? (
                <img
                  src={toolLogos[tool].src!}
                  alt=""
                  className={`w-5 h-5 object-contain ${toolLogos[tool].invert ? "dark:invert" : ""}`}
                />
              ) : (
                <span aria-hidden="true" className="w-5 h-5 rounded-md bg-foreground/10 text-foreground text-[10px] font-bold flex items-center justify-center">
                  {initials(tool)}
                </span>
              )}
              <span className="tracking-wide text-xs md:text-sm">{tool}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default TechStackSection;
