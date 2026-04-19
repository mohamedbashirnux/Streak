"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-green-500 hover:bg-green-600 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      ghost: "bg-transparent hover:bg-gray-800 text-gray-300",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
