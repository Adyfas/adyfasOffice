import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipsProps {
  text: string;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  /**
   * Controlled mode: kalau diisi, visibilitas ikut prop ini
   * (hover/focus tidak lagi mengatur sendiri).
   */
  open?: boolean;
  /** Auto-hide setelah sekian ms (hanya untuk controlled mode). 0 = tidak auto-hide. */
  openDuration?: number;
  onOpenChange?: (open: boolean) => void;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45",
  bottom: "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45",
  left: "left-full top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45",
  right: "right-full top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45",
};

const motionInitial: Record<TooltipPosition, { opacity: number; y: number; x: number }> = {
  top: { opacity: 0, y: 4, x: 0 },
  bottom: { opacity: 0, y: -4, x: 0 },
  left: { opacity: 0, y: 0, x: 4 },
  right: { opacity: 0, y: 0, x: -4 },
};

const Tooltips = ({
  text,
  children,
  position = "top",
  delay = 150,
  className = "",
  open,
  openDuration = 0,
  onOpenChange,
}: TooltipsProps) => {
  const isControlled = open !== undefined;
  const [innerOpen, setInnerOpen] = useState(false);
  const visible = isControlled ? open : innerOpen;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    if (isControlled) {
      onOpenChangeRef.current?.(true);
      return;
    }
    timer.current = setTimeout(() => setInnerOpen(true), delay);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    if (isControlled) {
      onOpenChangeRef.current?.(false);
      return;
    }
    setInnerOpen(false);
  };

  // Auto-hide untuk controlled mode (mis. peringatan yang tampil 3 detik)
  useEffect(() => {
    if (!isControlled || !open || !openDuration) return;
    const t = setTimeout(() => onOpenChangeRef.current?.(false), openDuration);
    return () => clearTimeout(t);
  }, [isControlled, open, openDuration]);

  if (!text) return <>{children}</>;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
      aria-describedby={tooltipId}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={motionInitial[position]}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={motionInitial[position]}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-black ${positionStyles[position]}`}
          >
            {text}
            <span
              aria-hidden="true"
              className={`absolute h-2 w-2 bg-gray-900 dark:bg-white ${arrowStyles[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltips;
