"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  duration?: number;
}

export const AnimatedGradientText = ({
  children,
  className,
  gradient = "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)",
  duration = 3,
}: AnimatedGradientTextProps) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent animate-gradient",
        className,
      )}
      style={{
        background: gradient,
        backgroundSize: "200% 200%",
        animation: `gradient ${duration}s ease infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </span>
  );
};
