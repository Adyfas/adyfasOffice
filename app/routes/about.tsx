import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Adyfas - About",
    },
    {
      name: "description",
      content:
        "Wellcome in my website adyfas and i'm a developer i'm have experience in web development",
    },
  ];
}

export default function AboutPage() {
  return (
    <>
        
    </>
  )
}
