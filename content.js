/* ------------------------------------------------------------------
   ALL YOUR CONTENT LIVES HERE.
   Everything below is placeholder text — replace it with your own
   and the whole site updates. No other file needs to be touched.
------------------------------------------------------------------- */
window.SITE = {
  name: "Shayan Kamandi",
  initials: "SK",
  role: "Full-stack Developer & Product Designer",
  email: "hello@yourname.com",
  location: "Tehran, Iran",
  timezone: "Asia/Tehran",          // used for the live local-time clock
  availability: "Available for work — 2026",
  photo: "",                        // e.g. "assets/me.jpg" — shows inside the hero pill. Leave empty for the animated gradient.
  resume: "assets/resume.pdf",      // put your PDF at this path

  intro:
    "Full-stack developer and product designer helping founders and businesses turn ideas into fast, scalable products — and into revenue.",

  about:
    "I'm a developer who thinks like a business owner. For the past 6 years I've built websites, SaaS products and internal tools for startups and companies worldwide — always starting from the goal behind the code: more customers, less friction, better margins. I write clean TypeScript, design interfaces people enjoy, and measure everything that ships.",

  stats: [
    { value: 6,  suffix: "+", label: "Years of experience" },
    { value: 48, suffix: "",  label: "Products shipped" },
    { value: 2,  suffix: "M+", label: "Revenue generated for clients ($)" },
    { value: 22, suffix: "",  label: "Happy clients" }
  ],

  // Scrolling ticker under the hero
  ticker: [
    "Full-stack development", "Next.js & React", "Node.js & APIs", "SaaS & MVPs", "Product strategy",
    "Conversion optimisation", "UI/UX design", "Automation", "Growth & SEO"
  ],

  services: [
    { title: "Web & App Development",  text: "Fast, secure, scalable websites and web apps — from landing pages to full SaaS platforms, built with React, Next.js, Node and TypeScript." },
    { title: "MVPs for Startups",      text: "Idea to launched product in weeks, not months. Scoped around what proves your business model first." },
    { title: "Product & UI/UX Design", text: "Interfaces that look sharp and convert. User flows, design systems and prototypes you can test before you build." },
    { title: "Business & Growth",      text: "Analytics, funnels, SEO and automation — so the product doesn't just work, it makes money." }
  ],

  // Selected work. c = [background, shape 1, shape 2]; fg = text colour on the card
  // result = { value, label } — the business outcome. Delete it to hide.
  works: [
    {
      title: "Nova Bank",
      year: "2026",
      kind: "SaaS · Fintech",
      text: "A friendly neobank for freelancers — 90-second onboarding, invoicing and a dashboard that explains money in plain language.",
      tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      result: { value: "+38%", label: "signup conversion" },
      url: "#",
      c: ["#ff4a1c", "#ece7dc", "#0f0f0f"], fg: "#0f0f0f", art: 0
    },
    {
      title: "Studio Lume",
      year: "2025",
      kind: "Brand · E-commerce",
      text: "Visual identity and a custom storefront for a lighting studio. Warm, tactile and tuned for checkout.",
      tags: ["Shopify", "React", "Branding"],
      result: { value: "2.4×", label: "online revenue in 6 months" },
      url: "#",
      c: ["#c8b9ff", "#ff4a1c", "#ece7dc"], fg: "#0f0f0f", art: 1
    },
    {
      title: "Orbit Fitness",
      year: "2025",
      kind: "Web app · Creative development",
      text: "A booking platform and scroll-driven campaign site where every workout is a tiny planet. Fast everywhere.",
      tags: ["TypeScript", "GSAP", "Supabase"],
      result: { value: "98", label: "Lighthouse score · 60fps" },
      url: "#",
      c: ["#0f0f0f", "#d6ff4d", "#ff4a1c"], fg: "#ece7dc", art: 2
    },
    {
      title: "Kite Coffee",
      year: "2024",
      kind: "Subscription commerce",
      text: "Storefront, subscription flow and an automated fulfilment dashboard for a small-batch roaster.",
      tags: ["Next.js", "Stripe", "Automation"],
      result: { value: "−60%", label: "manual order work" },
      url: "#",
      c: ["#9fd3ff", "#0f0f0f", "#ece7dc"], fg: "#0f0f0f", art: 3
    },
    {
      title: "Field Notes AI",
      year: "2024",
      kind: "AI product · Launch",
      text: "Launch site and in-app experience for an AI note-taking assistant. Explained a complex idea in one scroll.",
      tags: ["React", "Node.js", "OpenAI API"],
      result: { value: "12k", label: "waitlist signups in launch week" },
      url: "#",
      c: ["#d6ff4d", "#0f0f0f", "#ff4a1c"], fg: "#0f0f0f", art: 4
    }
  ],

  // Tools & skills, grouped
  stack: [
    { title: "Build",    items: ["TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind", "GSAP", "Three.js"] },
    { title: "Data & Infra", items: ["PostgreSQL", "Supabase", "REST & GraphQL", "Stripe", "Vercel", "Docker", "CI/CD"] },
    { title: "Design",   items: ["Figma", "Design systems", "Prototyping", "Motion", "Branding"] },
    { title: "Business", items: ["Product strategy", "Analytics", "A/B testing", "SEO", "Automation"] }
  ],

  // Where you've been
  experience: [
    {
      years: "2024 — Now", company: "Freelance", role: "Full-stack Developer & Consultant", place: "Remote",
      text: "Building SaaS products, e-commerce and marketing sites for startups and agencies in Europe and the US. Advising founders on scope, pricing and launch."
    },
    {
      years: "2022 — 2024", company: "Studio North", role: "Lead Developer & Designer", place: "Berlin, DE",
      text: "Led delivery of 12 products, set up the shared component library and CI pipeline, and mentored two junior developers."
    },
    {
      years: "2020 — 2022", company: "Pixelhaus", role: "Front-end Developer", place: "Istanbul, TR",
      text: "Built animated marketing sites and web apps, and a design-to-code pipeline that cut hand-off time by half."
    },
    {
      years: "2018 — 2020", company: "Brightside Agency", role: "Junior Developer & Designer", place: "Tehran, IR",
      text: "Where it started — websites, identity systems, campaigns and a lot of coffee."
    }
  ],

  lists: [
    { title: "Education",   items: ["B.Sc. Computer Engineering — University of Tehran", "Interaction Design Certificate — IxDF", "Product Management — Online"] },
    { title: "Recognition", items: ["Awwwards — Site of the Day (2025)", "CSS Design Awards — Special Kudos", "FWA — Of The Day (2024)"] },
    { title: "Clients",     items: ["Nova Bank", "Studio Lume", "Orbit Fitness", "Kite Coffee", "Field Notes"] }
  ],

  socials: [
    { label: "GitHub",    url: "#" },
    { label: "LinkedIn",  url: "#" },
    { label: "Dribbble",  url: "#" },
    { label: "Behance",   url: "#" },
    { label: "Instagram", url: "#" }
  ]
};
