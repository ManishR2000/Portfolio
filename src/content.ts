// ─────────────────────────────────────────────────────────────
//  ALL THE TEXT ON YOUR PORTFOLIO LIVES IN THIS FILE.
//  To change wording, edit the text between the quotes and save.
//  Keep the quotes, commas and brackets exactly as they are.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Manish R",
  initials: "MR",
  role: "UI/UX & Visual Designer",
  currentTitle: "Associate Designer",
  company: "HTC Global Services",
  location: "India",
  experience: "3+ Years",
  specialty: "UI/UX, Presentation & Graphic Design",
  availability: "Open to design opportunities",
  intro:
    "I design clear interfaces, executive presentations and brand visuals, turning complex ideas into designs that are easy to understand and use.",
  // Paste a link to a square photo of yourself here (leave "" to show your initials instead)
  photo: "",
  // Paste your Google Drive resume link here; the Resume button appears once this is filled in
  resumeUrl: "",
  email: "manishr2620@gmail.com",
  linkedin: "https://www.linkedin.com/in/manish2000",
  behance: "https://www.behance.net/manish200620",
};

export const about = {
  heading: "Turning complex ideas into clear, usable design",
  paragraph:
    "I'm a multidisciplinary designer with 3+ years of professional experience, including 2.5 years at McKinsey & Company. I work across three areas: UI/UX design for dashboards and apps, presentation design for executive audiences, and graphic design for brand and marketing work. What connects them is a focus on layout, hierarchy and consistency, and I use AI to speed up research, formatting and creative exploration.",
  stats: [
    { value: "3+", label: "Years turning complex ideas into clear, usable design" },
    { value: "150+", label: "Executive decks turning complex data into clear infographics" },
    { value: "35+", label: "On-brand assets powering 15 marketing campaigns" },
    { value: "100+", label: "Figma screens designed, including 2 end-to-end case studies" },
  ],
};

// ── What I do ───────────────────────────────────────────
// Each card: a short description (shown on the card) and the details shown when it's clicked.
// Tool names must match the tools list above, so their logos show.
export const services = {
  heading: "What I do",
  intro: "Four disciplines, one goal: making information easy to understand and act on. Select a card to see the details.",
  items: [
    {
      id: "ui",
      title: "UI Design",
      description: "Clean, consistent interfaces, from first wireframe to final screen.",
      summary:
        "I design interface layouts with clear visual hierarchy, so people see what matters first. In Figma I build wireframes, screen flows and polished screens, including recreating UI from reference images to match client requirements.",
      points: [
        "UI design & screen recreation in Figma",
        "Interface layout & visual hierarchy",
        "Wireframes & screen flows",
        "Interactive prototyping & iteration",
        "Dashboard navigation & data-entry design",
      ],
      tools: ["Figma", "Framer", "Miro"],
    },
    {
      id: "research",
      title: "UX Research",
      description: "Understanding users first, so the design answers real problems.",
      summary:
        "Before designing, I work to understand the people who will use it. I analyse user interviews and feedback, find the pain points, and turn them into clear requirements, using GenAI to organise findings faster.",
      points: [
        "User interview analysis",
        "Feedback synthesis & pain-point mapping",
        "Turning findings into requirements",
        "Folding feedback back into design iterations",
        "GenAI-assisted research synthesis",
      ],
      tools: ["Miro", "Notion", "Claude", "ChatGPT"],
    },
    {
      id: "presentation",
      title: "Presentation Design",
      description: "Story-driven executive decks built from complex business content.",
      summary:
        "I turn dense business content into clear, client-ready presentations: 100+ decks at HTC and 20+ a week at McKinsey. That covers structure, data visualisation and brand-compliant templates, often under tight deadlines.",
      points: [
        "Executive & client-ready decks",
        "Data visualisation & think-cell charts",
        "Brand-compliant PowerPoint & Word templates",
        "RFP/RFI document design",
        "Word documents restructured into slides",
      ],
      tools: ["Microsoft PowerPoint", "Google Slides", "think-cell", "Microsoft Word"],
    },
    {
      id: "graphic",
      title: "Graphic Design",
      description: "Brand-consistent visuals for marketing campaigns and events.",
      summary:
        "I create marketing and event visuals that stay on brand across every channel, with 35+ branded assets delivered for campaigns and internal events, including AI-assisted ideation for imagery.",
      points: [
        "Posters & brochures",
        "Social media assets",
        "Event collateral",
        "Brand identity, typography & layout",
        "AI-assisted image ideation",
      ],
      tools: ["Adobe Photoshop", "Adobe Illustrator", "Adobe Firefly", "Canva"],
    },
  ],
};

export const tools = [
  "Figma",
  "Framer",
  "Notion",
  "Miro",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Firefly",
  "Canva",
  "Microsoft PowerPoint",
  "Google Slides",
  "think-cell",
  "Microsoft Word",
  "Claude",
  "ChatGPT",
];

// ── Selected work ───────────────────────────────────────────
// link: paste a Behance or case-study link; leave "" if there isn't one yet.
// image: paste an image link; leave "" to show a plain panel until you have one.
// gallery images: add image links to the list; while it's empty, placeholders show.
export const projects = {
  heading: "Selected work",
  intro: "UI/UX case studies, followed by presentation and visual design work.",
  ux: {
    heading: "UI/UX Design",
    items: [
      {
        title: "Presales dashboard redesign",
        subtitle: "Redesigning a sales team’s dashboard in real time: One Live View, Faster Entries, Clearer Insights",
        link: "",
        image: "",
      },
      {
        title: "PetSync app",
        subtitle: "A self-initiated, end-to-end case study for a pet health app that turns smart-collar data into alerts owners can trust",
        link: "",
        image: "",
      },
    ],
  },
  presentation: {
    heading: "Presentation Design",
    intro: "Executive decks, data visualisation and brand templates.",
    images: [] as string[],
    seeMoreLabel: "See more on Behance",
    seeMoreUrl: "https://www.behance.net/manish200620",
  },
  visual: {
    heading: "Visual Design",
    intro: "Posters, social media and event collateral.",
    // Each design: an image link, a title, a category and a one-line description.
    // While this list is empty, placeholder cards show. The gallery works best with about 5–8 designs;
    // put your strongest first, and everything else lives on Behance.
    items: [] as { url: string; title: string; category: string; description: string }[],
    seeMoreLabel: "See more on Behance",
    seeMoreUrl: "https://www.behance.net/manish200620",
  },

};

export const career = {
  heading: "Career",
  intro: "From Executive Presentation Design to UI/UX",
  roles: [
    {
      years: "Feb 2026 – Present",
      title: "Associate Designer",
      company: "HTC Global Services",
      description:
        "Working on the UX redesign of an internal presales dashboard: analysing user interviews, creating screen flows and wireframes in Figma, and improving navigation and data-entry workflows. Designing executive decks, posters, social media assets and event collateral, and built a custom Claude skill that cut presentation formatting time by 35%.",
    },
    {
      years: "Jun 2024 – Feb 2026",
      title: "Business Presentation Specialist",
      company: "McKinsey & Company",
      description:
        "Partnered with consultants and senior stakeholders to deliver 20+ client-ready executive decks a week in PowerPoint and Google Slides. Turned dense slides into clear stories with infographics and data visualisation, built custom templates to client brand guidelines, and managed projects end to end. Recognised with 17 internal awards for quality and stakeholder feedback.",
    },
    {
      years: "Oct 2023 – Jun 2024",
      title: "Junior Business Presentation Specialist",
      company: "McKinsey & Company",
      description:
        "Formatted and aligned PowerPoint slides for polished, consistent presentations. Developed brand-compliant slide templates, converted Excel data into think-cell charts, and transformed Word documents into clear, visual slides, all under tight deadlines.",
    },
  ],
};

export const certifications = {
  heading: "Certifications",
  items: [
    "Google UX Design Professional Certificate",
    "Professional Figma UI/UX Design Specialization",
    "Adobe Graphic Designer Professional Certificate",
    "Microsoft Copilot for Productivity",
    "think-cell Certified Professional",
  ],
};

export const education = {
  heading: "Education",
  degree: {
    title: "Integrated M.Tech – Advanced Manufacturing",
    school: "SASTRA Deemed University",
    years: "2017 – 2022",
  },
};

// ── Skills tabs ──────────────────────────────────────────
// Each tab: a label, a one-line summary, skills (name + one-line detail) and tools.
// Tool names must match the names in the tools list above, so their logos show.
export const skills = {
  heading: "Skills",
  tabs: [
    {
      id: "ui",
      label: "User Interface",
      summary: "Clear, consistent interfaces, from first wireframe to final screen.",
      items: [
        { name: "UI design & screen recreation", detail: "Recreating interface screens in Figma from reference images, matched to client requirements." },
        { name: "Interface layout & visual hierarchy", detail: "Layouts that guide the eye to what matters first and stay consistent across screens." },
        { name: "Wireframing & user flows", detail: "Turning business requirements into screen flows and structured wireframes." },
        { name: "Interactive prototyping", detail: "Clickable prototypes to test ideas and iterate before anything is built." },
        { name: "Dashboard design", detail: "Improving navigation and data-entry workflows for an internal presales dashboard." },
      ],
      tools: ["Figma", "Framer", "Miro"],
    },
    {
      id: "research",
      label: "User Research",
      summary: "Understanding users first, so the design answers real problems.",
      items: [
        { name: "User interview analysis", detail: "Analysing interview insights to find pain points and clarify what users need." },
        { name: "Feedback synthesis", detail: "Organising scattered feedback into clear themes and priorities." },
        { name: "Requirements definition", detail: "Translating research findings into requirements the design can answer." },
        { name: "Iterating from feedback", detail: "Folding user feedback back into design explorations." },
      ],
      tools: ["Miro", "Notion", "Claude", "ChatGPT"],
    },
    {
      id: "visual",
      label: "Visual Design",
      summary: "Presentations, data and brand visuals that communicate at a glance.",
      items: [
        { name: "Executive presentation design", detail: "100+ decks at HTC and 20+ a week at McKinsey, built on clear information hierarchy." },
        { name: "Data visualisation & charts", detail: "Excel data turned into clear think-cell charts and visual summaries." },
        { name: "Posters, social & event collateral", detail: "35+ branded assets across marketing campaigns and internal events." },
        { name: "Brand identity, typography & layout", detail: "Consistent type, colour and layout across every deliverable." },
        { name: "Templates & business documents", detail: "Brand-compliant PowerPoint and Word templates, and 20+ RFP/RFI documents redesigned." },
      ],
      tools: ["Microsoft PowerPoint", "Google Slides", "think-cell", "Adobe Photoshop", "Adobe Illustrator", "Canva", "Microsoft Word"],
    },
    {
      id: "ai",
      label: "AI",
      summary: "Using AI to speed up research, formatting and creative exploration.",
      items: [
        { name: "Formatting", detail: "Built a custom Claude skill that handles first-level presentation formatting, cutting formatting time by 35%." },
        { name: "Creation", detail: "Recreate reference images as editable PowerPoint elements with a Claude skill, cutting digitisation time by 66%." },
        { name: "Ideation", detail: "Explore background images and visual ideas with Adobe Firefly and ChatGPT." },
        { name: "UI/UX research", detail: "Synthesise user interview notes and feedback with GenAI to organise findings and requirements." },
        { name: "Data", detail: "Turn large, multi-source datasets into clear charts and visual summaries." },
      ],
      tools: ["Claude", "ChatGPT", "Adobe Firefly"],
    },
  ],
};

export const recognition = {
  heading: "Recognition",
  intro: "Awards received at McKinsey & Company",
  awards: [
    { count: "7×", name: "User Experience Amplifier", description: "For delivering high-quality work under critical deadlines" },
    { count: "6×", name: "Spotlight Award", description: "For outstanding user feedback and stakeholder engagement" },
    { count: "4×", name: "Impeccable Award", description: "For exceptional user satisfaction and presentation quality" },
  ],
};

export const contact = {
  heading: "Let's connect",
  text: "Have a role, a project or a question? Send me a message and I'll get back to you.",
};

export const footer = {
  tagline: "Designing for clarity",
  rotatingWords: ["Visual Designer", "Graphic Designer", "Presentation Designer", "UI/UX Designer", "UX Researcher", "Manish R"],
};
