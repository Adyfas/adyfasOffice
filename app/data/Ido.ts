import * as icons from "lucide-react"

interface IDoSomething{

    title: string,
    desc: string,
    icon: keyof typeof icons

}

export const iDoSomething: IDoSomething[] = [
    {
        title: "Web Development",
        desc: "Building responsive, fast, and user-friendly websites using modern web technologies.",
        icon: "CodeSquare",
    },
    {
        title:"System Automation",
        desc:"Creating simple automation systems to reduce repetitive tasks and improve efficiency",
        icon:"Settings"
    },
    {
        title:"Problem Solving",
        desc:"Analyzing problems and translating them into effective technical solutions.",
        icon:'Bug'
    }
]