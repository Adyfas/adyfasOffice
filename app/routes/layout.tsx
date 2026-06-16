import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { BottomNav } from "~/components/BottomNav";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import type { JSX } from "react/jsx-runtime";
import LoadingPage from "~/components/LoadingPage";
import ClientOnly from "~/components/ClientOnly";

type LenisInstance = InstanceType<typeof Lenis> | null;

export default function LayoutPage(): JSX.Element {
  const lenis = useRef<LenisInstance>(null);

  const [showInitialLoading, setShowInitialLoading] = useState(false);
  const handleLoadingComplete = () => setShowInitialLoading(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("loading")) {
        sessionStorage.setItem("loading", "true");
        setShowInitialLoading(true);
      } else return;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lenis.current = new Lenis({
      duration: 0.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      // @ts-expect-error - Lenis type definitions may not include smooth and smoothTouch
      smooth: true,
      smoothTouch: true,
    });

    const animate = (time: number) => {
      lenis.current?.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      lenis.current?.destroy();
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (typeof window === "undefined") return;
    const element = document.getElementById(id);
    if (element) {
      lenis.current?.scrollTo(element);
    }
  };

  return (
    <>
      {/* {showInitialLoading ? (
        <LoadingPage onComplete={handleLoadingComplete} />
      ) : ( */}
        <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 relative">
          <div className="w-full max-w-3xl mx-auto px-0 sm:px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-start justify-start py-8 sm:py-16 md:py-20 lg:py-24 w-full">
                <div className="w-full">
                  <ClientOnly>
                    <Sidebar />
                  </ClientOnly>
                  <ClientOnly>
                    <BottomNav />
                  </ClientOnly>
                  <div className="w-full">
                    <Outlet />
                  </div>
                  <div className="w-full">
                    <Footer />
                  </div>
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="fixed left-0 w-full bottom-0 h-10 dark:bg-black bg-white/60 rounded-t-3xl filter blur-3xl pointer-events-none"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* )} */}
    </>
  );
}
