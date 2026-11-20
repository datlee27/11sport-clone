"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionReveal({
  children,
  className,
  delay = 0,
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
