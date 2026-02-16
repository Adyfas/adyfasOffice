import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    y?: number;
    x?: number;
    blur?: number;
    scale?: number;
    className?: string;
}

export const Reveal = ({
    children,
    width = "fit-content",
    delay = 0,
    duration = 0.8,
    y = 20,
    x = 0,
    blur = 10,
    scale = 1,
    className = "",
}: RevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ width }}>
            <motion.div
                variants={{
                    hidden: {
                        opacity: 0,
                        y: y,
                        x: x,
                        filter: `blur(${blur}px)`,
                        scale: scale
                    },
                    visible: {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        filter: "blur(0px)",
                        scale: 1
                    },
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: [0.22, 1, 0.36, 1], // Premium quintic out
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Reveal;
