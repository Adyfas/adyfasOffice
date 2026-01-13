import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adyfas" },
    { name: "description", content: "Wellcome in my website adyfas and i'm a developer i'm have experience in web development" },
  ];
}

export default function Home() {
  return (
    <>
      
    </>
  )
}
