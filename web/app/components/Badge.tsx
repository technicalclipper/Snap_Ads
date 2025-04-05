"use client";

import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  glow = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 ring-indigo-500/20",
    success:
      "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 ring-green-500/20",
    warning:
      "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 ring-yellow-500/20",
    error:
      "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 ring-red-500/20",
    outline:
      "border-2 border-indigo-500/50 dark:border-indigo-400/50 text-indigo-700 dark:text-indigo-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <motion.span
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        glow && "ring-2",
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
}
