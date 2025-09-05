"use client";

import { cn } from "@/lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientSize?: number;
  borderColor?: string;
  borderOpacity?: number;
  borderSize?: number;
  borderRadius?: number;
  isGradient?: boolean;
  isBorder?: boolean;
  isHoverable?: boolean;
}

export const MagicCard = ({
  children,
  className,
  gradientColor = "rgba(120, 119, 198, 0.3)",
  gradientOpacity = 0.5,
  gradientSize = 200,
  borderColor = "rgba(120, 119, 198, 0.5)",
  borderOpacity = 0.5,
  borderSize = 1,
  borderRadius = 8,
  isGradient = true,
  isBorder = true,
  isHoverable = true,
}: MagicCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-slate-950",
        isHoverable && "transition-all duration-300 hover:scale-105",
        className,
      )}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      {isGradient && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(${gradientSize}px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${gradientColor}, transparent 40%)`,
          }}
        />
      )}
      {isBorder && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(${borderSize}px, ${borderColor}, transparent 50%, transparent)`,
            borderRadius: `${borderRadius}px`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
