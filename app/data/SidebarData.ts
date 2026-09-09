import * as icons from "lucide-react";

interface routeSidebar {
  name: string;
  route: string;
  icon: keyof typeof icons;
}

export const dataIconSidebar: routeSidebar[] = [
  {
    name: "Home",
    route: "/",
    icon: "HomeIcon",
  },
  {
    name: "About",
    route: "/about",
    icon: "PersonStanding",
  },
  {
    name: "Project",
    route: "/project",
    icon: "Book",
  },
  {
    name: "Blog",
    route: "/blog",
    icon: "BookOpenText",
  },
  {
    name: "Contact",
    route: "/contact",
    icon: "Contact",
  },
];
