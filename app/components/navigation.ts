export interface NavigationLink {
  labelKey: string;
  fallback: string;
  href: string;
}

export const coreLinks: NavigationLink[] = [
  { labelKey: "nav.drillCatalogue", fallback: "Drill Catalogue", href: "/catalog" },
  { labelKey: "nav.sessionPlanner", fallback: "Session Planner", href: "/planner" },
  { labelKey: "nav.tagGuide", fallback: "Tag Guide", href: "/explanation" },
];

export const learnLinks: NavigationLink[] = [
  { labelKey: "nav.whyScanning", fallback: "Why Scanning", href: "/why-scanning" },
  { labelKey: "nav.howItWorks", fallback: "How It Works", href: "/how-it-works" },
  { labelKey: "nav.ecosystem", fallback: "Ecosystem", href: "/ecosystem" },
  { labelKey: "nav.useCases", fallback: "Use Cases", href: "/use-cases" },
];

export const aboutLinks: NavigationLink[] = [
  { labelKey: "nav.resources", fallback: "Resources", href: "/resources" },
  { labelKey: "nav.testimonials", fallback: "Testimonials", href: "/testimonials" },
];

export const supportLinks: NavigationLink[] = [
  { labelKey: "nav.contact", fallback: "Contact", href: "/contact" },
];

export const pricingLink: NavigationLink = {
  labelKey: "nav.pricing",
  fallback: "Pricing",
  href: "/upgrade",
};
