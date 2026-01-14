import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Adyfas" },
    { name: "description", content: "Wellcome in my website adyfas and i'm a developer i'm have experience in web development" },
  ];
}

export default function Home() {
  return (
    <div className="w-1/2 m-auto">
      <div className="flex items-start justify-start flex-col py-24">
        <div className="w-3xl">

          <div className="w-32 h-32 my-2">
            <img src="/images/CEO.png" alt="adyfas" className="rounded-full w-full h-full object-cover" sizes="62px" />
          </div>
          <h1 className="font-bold text-2xl text-start">Hey, Adyfas Here!</h1>
          <p>Nice to meet you</p>
          <p className="py-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, nemo nobis aspernatur est beatae sequi perspiciatis dolorem totam labore magnam quo reiciendis mollitia voluptatibus in quidem, ut nam, error vitae.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque fuga incidunt laudantium nostrum laborum, libero assumenda quia cum dignissimos. Optio earum eveniet voluptatem illo ad cum voluptas itaque quod laudantium.
          </p>
          <button className="bg-gray-900 p-2 text-white font-bold rounded-xl px-5 cursor-pointer hover:bg-gray-800 transition-all duration-5
          00 text-xl hover:scale-115">Contact</button>

          <div className="my-5">

        
          </div>
        </div>
      </div>
    </div>
  )
}
