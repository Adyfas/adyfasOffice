type projectLink = {
  name: string;
  link: string;
};
type TimelineItem = {
  date: string;
  title: string;
  description?: string;
  project?: projectLink[];
};

export const timelineData: TimelineItem[] = [
  {
    date: "Oct 2024",
    title: "First Client Project & Web Development Competition",
    description:
      "Developed a web-based dashboard for client management, including an automated invoice reminder system. In parallel, participated in a web development competition by creating an AI-themed website and achieved 1st Runner-Up 🏆.",
    project: [
      { name: "Koncomoto", link: "/project/koncomoto" },
      { name: "AI Web Competition", link: "/project/aiindonesia" },
    ],
  },
  {
    date: "Jul & Nov 2025",
    title: "Two-Time Winner – Web Design Competition",
    description:
      "Won two web design competitions, achieving won 2nd in both events 🏆. The first project focused on promoting Indonesian cultural heritage, while the second addressed environmental awareness through a waste literacy and green sustainability theme.",
    project: [
      {
        name: "Inside Tribe",
        link: "/project/insidetribe",
      },
      {
        name: "Ecomind Green Era",
        link: "/project/ecomind",
      },
    ],
  },
  {
    date: "Sep 2025",
    title: "E-commerce REST API Development",
    description:
      "Designed and developed a RESTful API for an e-commerce platform, covering core features such as authentication, product management, and basic transactional workflows.",
    project: [{ name: "SipBos", link: "/project/sipbos" }],
  }
];
