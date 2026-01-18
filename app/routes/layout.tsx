import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { BottomNav } from "~/components/BottomNav";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import type { JSX } from "react/jsx-runtime";
import LoadingPage from "~/components/LoadingPage";

type LenisInstance = InstanceType<typeof Lenis> | null;

export default function LayoutPage(): JSX.Element {
  const lenis = useRef<LenisInstance>(null);
  // Jangan tampilkan loading saat SSR
  const [showInitialLoading, setShowInitialLoading] = useState(false);
  const handleLoadingComplete = () => setShowInitialLoading(false);
  
  // Hanya tampilkan loading di client-side setelah mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShowInitialLoading(true);
    }
  }, []);

  useEffect(() => {
    // Hanya jalankan di client-side
    if (typeof window === 'undefined') return;

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
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (element) {
      lenis.current?.scrollTo(element);
    }
  };

  return (
    <>
      {showInitialLoading ? (
        <LoadingPage onComplete={handleLoadingComplete} />
      ) : (
        <div className="w-full max-w-3xl mx-auto px-4 relative">
          <div className="w-full max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-start justify-start py-12 sm:py-24">
                <div className="w-full sm:w-full">
                  <Sidebar />
                  <BottomNav />
                  <Outlet />
                  <Footer />

                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="fixed left-0 w-full bottom-0 h-10 bg-white/60 rounded-t-3xl filter blur-3xl"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
