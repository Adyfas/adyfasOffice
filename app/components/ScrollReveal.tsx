import { motion, type Variants } from "framer-motion";
import React from "react";
import { fadeUp, fadeIn, scaleIn } from "~/lib/framer-utils";

type AnimationType = "fadeUp" | "fadeIn" | "scaleIn";

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: AnimationType;
    delay?: number;
    className?: string;
    viewportAmount?: number;
    once?: boolean;
}

const variantsMap: Record<AnimationType, Variants> = {
    fadeUp,
    fadeIn,
    scaleIn,
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    animation = "fadeUp",
    delay = 0,
    className = "",
    viewportAmount = 0.2,
    once = true,
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: viewportAmount }}
            variants={variantsMap[animation]}
            custom={delay}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
