import { useEffect } from "react";
import { useTina } from "tinacms/react";

interface LivePostBridgeProps {
  query: string;
  variables: Record<string, unknown>;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
}

/**
 * Jembatan live preview TinaCMS.
 *
 * `useTina` (entrypoint ringan `tinacms/react`, hanya ~6KB) menyimak pesan
 * dari parent window - yaitu admin Tina yang memuat halaman ini di dalam
 * iframe - lalu mengirim data terbaru ke `onChange`.
 *
 * Komponen ini sengaja tidak merender apa pun: ia hanya(memberi tahu) route
 * bahwa data artikel berubah, sehingga article UI tetap memakai state biasa.
 */
export default function LivePostBridge({
  query,
  variables,
  data,
  onChange,
}: LivePostBridgeProps) {
  const { data: liveData } = useTina<Record<string, unknown>>({
    query,
    variables,
    data,
  });

  useEffect(() => {
    if (liveData) onChange(liveData);
  }, [liveData, onChange]);

  return null;
}
