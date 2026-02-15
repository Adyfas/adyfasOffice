import type { Variants } from "framer-motion";

export const transition = {
    type: "spring",
    duration: 0.8,
    bounce: 0.2,
};

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1]; // exp out ease

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: premiumEase,
            delay: custom,
        },
    }),
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: (custom: number = 0) => ({
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: premiumEase,
            delay: custom,
        },
    }),
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (custom: number = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: premiumEase,
            delay: custom,
        },
    }),
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
