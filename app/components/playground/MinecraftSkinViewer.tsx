import { useEffect, useRef } from "react";
import { SkinViewer, IdleAnimation } from "skinview3d";

export default function MinecraftSkinViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viewer = new SkinViewer({
      canvas: canvasRef.current,
      width: 220,
      height: 300,
      skin: "/images/playground/skin-adyfas.png",
      background: '', // transparan
    });

    // Animasi biar hidup
    viewer.animation = new IdleAnimation();

    // Kontrol kamera (ROTATE & ZOOM)
    viewer.controls.enableRotate = true;
    viewer.controls.enableZoom = true;
    viewer.controls.enablePan = false;

    // Posisi kamera biar pas
    viewer.camera.position.set(0, 0, 35);

    return () => viewer.dispose();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="image-render-pixelated"
      style={{
        cursor: "grab",
      }}
    />
  );
}
