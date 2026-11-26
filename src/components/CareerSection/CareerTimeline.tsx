import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Presentation } from "lucide-react";
import { career } from "../../content";

const roleIcons = [Briefcase, Presentation];

export const CareerTimeline = () => {
  const careerEvents = career.roles.map((role, i) => {
    const Icon = roleIcons[i % roleIcons.length];
    return {
      year: role.years,
      title: role.title,
      subtitle: role.company,
      description: role.description,
      icon: <Icon className="h-4 w-4 mr-2 text-primary" />,
    };
  });

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title={career.heading}
        subtitle={career.intro}
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
