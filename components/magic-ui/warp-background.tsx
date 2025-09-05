"use client";

import { cn } from "@/lib/utils";

interface WarpBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export const WarpBackground = ({
  children,
  className,
  containerClassName,
  animate = true,
}: WarpBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative h-[20rem] overflow-hidden bg-slate-950",
        containerClassName,
      )}
    >
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]",
          className,
        )}
      />
      {children}
    </div>
  );
};
