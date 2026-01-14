interface DataProject {
    title:string,
    desc:string,
    tech?: string[],
    img:string
    link?: string,
    projectLink:string,
    role?:string,
    git?:string,
    date?:string
}

export const ProjectList: DataProject[] = [
    {
        title:"Ecomind Green Era",
        desc:"Ecomind Green Era is a project that I worked on in Nov 24, 2025, the goal of this website is to raise awareness about waste and how to process it properly, and this website also has a feature where users can scan waste and then the Ecomind AI will explain what kind of waste the user is pointing to.",
        tech:['Next Js', 'Gsap', 'Lucide', 'Tailwind', 'FramerMotion', 'Lenis'],
        img:'/images/project/ecomind.png',
        link:'https://ecomind-green.vercel.app/',
        projectLink:"/project/ecomind",
        role:"Full Stack",
        git:'https://github.com/Adyfas/ecomind.git',
        date:'Nov 24, 2025'
    },
    {
        title:"Warung Go",
        desc:'Warung Go is a competition project in 2025, this e-commerce website is a one-stop website for MSMEs in Indonesia, its features are complete such as GPS tracking and will recommend which stores are closest to the user, and users can come directly or buy online at the MSME stores that have been provided.',
        tech:["Next Js", "Lucide", "Radix UI", "Tailwind", "Shadcn/ui", "FramerMotion", "Leaflet", "CARTO Analytic"],
        img:"/images/project/warunggo.png",
        link:'https://warunggo.vercel.app/map',
        projectLink:'/project/warunggo',
        role:'Full Stack',
        git:'https://github.com/Adyfas/Warung-GO.git',
        date:'Oct 13, 2025,'
    },
    {
        title:'Inside Tribe',
        desc:'Inside Tribe is my competition project on Jul 2, 2025, this website is a website to show local Indonesian cultures that are rarely exposed by the internet, so we introduce them through this website with a good UI and UX that is user-friendly and happy to read about their cultures and also proud to have a lot of culture',
        tech:['React Router', 'Gsap', 'Leaflet', 'FramerMotion', 'Lenis'],
        img:'/images/project/insidetribe.png',
        link:'https://inside-tribe.vercel.app/',
        projectLink:'/project/insidetribe',
        role:'FrontEnd',
        git:'https://github.com/Adyfas/InsideTribe.git',
        date:'Jul 2, 2025'
    },
    {
        title:'AI Indonesia',
        desc:"AI Indonesia is the first competition website that I participated in, this website explains the impact of AI on humans and this website is the first website that I built on Oct 20, 2024",
        tech:['React Router', 'AOS'],
        img:"/images/project/aiindonesia.png",
        link:'https://ai-indonesia.vercel.app/',
        projectLink:"/project/aiindonesia",
        role:'FronEnd',
        git:'https://github.com/cuyfer/ai-indonesia',
        date:'Oct 20, 2024'
    },
    {
        title:'Koncomoto Dashboard',
        desc:"Koncomoto is the biggest project I have ever made. This is a project to organize or manage clients. Apart from that, there is also a corn invoice feature or automatic sending of invoices to clients via WhatsApp and also e-mail with predetermined terms and integrated with payment gateway.",
        tech:['Next JS', 'FramerMotin', 'Lucide', 'Xendit', 'Google Date', 'Node Email', 'Whatsaap API', 'Express JS','DAte Picker', 'Prisma', 'PostgreSQL', 'Neon'],
        projectLink:'/project/koncomoto',
        role:'Full Stack',
        img:'/images/project/koncomoto.png',
        date:'Oct 21, 2024'
    },
    {
        title:'API E-Commerce (SipBos)',
        desc:'SipBos API is the biggest project for my backend part, in this project I am the front guard of everything because I am the one who manages, updates, deletes data and so on including transactions and also the database and it is done solo or alone this project runs smoothly and the API can be used safely and the application runs normally and as desired',
        tech:['Prisma', 'Express js', 'PostgreSQL', 'Bcryptjs', 'Google-auth-library', 'Jsonwebtoken', 'Multer', 'Node-appwrite', 'Passport', 'Passport-google-oauth20', 'Passport-oauth', 'Serverless-http', 'Neon', 'Appwrite'],
        projectLink:'/project/sipbos',
        role:'Backend',
        img:'/images/project/sipbos.jpeg',
        date:'Sep 28, 2025'
    }
]