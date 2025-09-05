"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingAnimationProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
}

export const TypingAnimation = ({
  text,
  className,
  speed = 100,
  delay = 0,
  cursor = true,
  cursorChar = "|",
}: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  return (
    <span className={cn("inline-block", className)}>
      {displayedText}
      {cursor && (
        <span className="animate-pulse ml-1">
          {cursorChar}
        </span>
      )}
    </span>
  );
};
