import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/client-utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#111111] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
