import type { BlogPost } from "~/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-with-web-development",
    category: "Web Development",
    title: "Getting Started with Web Development",
    intro:
      "A beginner's guide to diving into web development. Learn the fundamentals and start building your first projects.",
    body: `When you're new to web development, the landscape can feel overwhelming. But by breaking it down into digestible pieces, you'll find that the path is clearer than you think.

## 1. HTML & CSS First

Start with the basics. HTML gives you structure, CSS gives you style. Together they form the foundation of every website you see.

## 2. JavaScript for Interactivity

Once you understand the structure, add JavaScript to make your pages dynamic. This is where the real magic happens.

## 3. Build Your First Project

The best way to learn is by doing. Pick a simple project—a portfolio, a blog, a todo app—and build it from scratch.`,
    author: {
      name: "Adyfas",
      role: "Web Developer & Problem Solver",
      avatar: "/images/CEO.png",
    },
    publishedAt: "2025-02-01T10:00:00Z",
    createdAt: "2025-02-01T10:00:00Z",
    updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "2",
    slug: "why-max-verstappen-won-our-hearts",
    category: "Formula 1",
    title: "Why Max Verstappen Won Our Hearts in 2025 Abu Dhabi GP?",
    intro:
      "Lando Norris is the 2025 World Champion, but Max Verstappen's resurrection of a difficult season has captured the F1 world's heart.",
    body: `From a 104-point deficit to a heartbreaking finale, we analyze why this was actually Max's finest hour.

The 2025 season was one of the most dramatic in recent memory. Max Verstappen showed resilience, determination, and sheer driving talent that reminded the world why he's a champion.

## The Comeback

Despite the setbacks, Max never gave up. His performances in the latter half of the season were nothing short of legendary.`,
    author: {
      name: "Adyfas",
      role: "Web Developer & Problem Solver",
      avatar: "/images/CEO.png",
    },
    publishedAt: "2025-12-15T14:30:00Z",
    createdAt: "2025-12-15T14:30:00Z",
    updatedAt: "2025-12-15T14:30:00Z",
  },
];
