// Central config for header & top banner — edit here or via admin panel

export const headerConfig = {
  topBar: {
    tagline: "Bangladesh's Premier Startup & Business News",
    links: [
      { label: "Subscribe", href: "/subscribe" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  logo: {
    badge: "SUN",
    name: "START-UP NEWS",
    subtitle: "Bangladesh Business",
  },
  navLinks: [
    { label: "Articles", href: "/articles" },
    { label: "Founders", href: "/founders" },
    { label: "Startups", href: "/startups" },
    { label: "Rankings", href: "/rankings" },
    { label: "Best Ideas", href: "/ideas" },
  ],
  topBanner: {
    visible: true,
    title: "Advertise with Start-Up News",
    subtitle: "Bangladesh's #1 platform for entrepreneurs & investors",
    href: "/advertise",
    ctaText: "Book Now →",
    stats: [
      { value: "2M+", label: "Monthly Readers" },
      { value: "500+", label: "Founders" },
      { value: "1,200+", label: "Startups" },
      { value: "64", label: "Districts" },
    ],
    placementLabel: "Premium Placement",
    placementSize: "970 × 90 Leaderboard",
  },
};

export type HeaderConfig = typeof headerConfig;
