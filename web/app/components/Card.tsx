"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = "default", hover = true, children, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-white dark:bg-slate-800",
      glass:
        "bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/20",
      outline: "border-2 border-slate-200 dark:border-slate-700 bg-transparent",
    };

    const baseStyles = cn(
      "rounded-2xl shadow-lg",
      variants[variant],
      hover &&
        "transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 hover:-translate-y-1",
      className
    );

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={baseStyles}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export { Card };
