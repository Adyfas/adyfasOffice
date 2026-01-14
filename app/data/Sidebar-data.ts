import * as icons from "lucide-react"

interface routeSidebar {
    name: string,
    route: string,
    icon: keyof typeof icons
}


export const dataIconSidebar: routeSidebar[] = [
    {
        name: "Home",
        route: '/',
        icon: "HomeIcon",
    },
    {
        name: "About",
        route: '/about',
        icon: "PersonStanding",
    },
    {
        name: "Project",
        route: '/project',
        icon: "Book",
    },
    {
        name: "Contact",
        route: '/contact',
        icon: "Contact",
    },
    {
        name: "Playground",
        route: '/playground',
        icon: "Gamepad",
    },
]