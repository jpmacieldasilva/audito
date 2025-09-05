"use client";

import { cn } from "@/lib/utils";

interface TextAnimateProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const TextAnimate = ({
  text,
  className,
  delay = 0,
  duration = 0.5,
  stagger = 0.1,
}: TextAnimateProps) => {
  const words = text.split(" ");

  return (
    <div className={cn("flex flex-wrap", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block mr-2"
          style={{
            animationDelay: `${delay + index * stagger}s`,
            animationDuration: `${duration}s`,
            animationFillMode: "both",
            animationName: "textAnimate",
          }}
        >
          {word}
        </span>
      ))}
      <style jsx>{`
        @keyframes textAnimate {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
