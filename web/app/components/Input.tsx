"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, leftIcon, rightIcon, type = "text", ...props },
    ref
  ) => {
    return (
      <div className="relative">
        {label && (
          <label
            className={cn(
              "absolute -top-2 left-2 px-1 text-xs font-medium transition-all",
              error
                ? "text-red-500 dark:text-red-400"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            <span className="bg-white dark:bg-slate-900 px-1">{label}</span>
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full rounded-lg border bg-transparent px-4 py-2 text-base transition-colors",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
              error
                ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
