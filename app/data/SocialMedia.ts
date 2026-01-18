import * as icons from "lucide-react"

interface Social{
    name:string,   
    link:string,
    icon: keyof typeof icons

}
export const SocialMedia: Social[] = [
    {
        name:'Instagram',
        link:'https://instagram.com/adyfas.ver',
        icon:'Instagram'
    },
    {
        name:'Github',
        link:'https://github.com/Adyfas',
        icon:'Github'
    }
]