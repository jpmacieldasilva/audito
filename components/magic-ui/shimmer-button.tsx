"use client";

import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = ({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.5px",
  borderRadius = "100px",
  shimmerDuration = "3s",
  background = "rgba(0, 0, 0, 1)",
  ...props
}: ShimmerButtonProps) => {
  return (
    <button
      style={{
        background: `${background}`,
        borderRadius: borderRadius,
      }}
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-sm text-white [background:linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:bg-[position:200%_0,0_0] hover:shadow-[0_0_2rem_-0.5rem_#4f46e5] active:scale-95",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};
