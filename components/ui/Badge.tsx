import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "emerald" | "amber" | "outline" | "white";
  showDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "brand",
  showDot = false,
  className = "",
}) => {
  const variantStyles = {
    brand: "bg-[#F5F3FF] border-[#ECEBFF] text-[#6D5DF6]",
    emerald: "bg-[#F0FDF4] border-[#DCFCE7] text-[#16A34A]",
    amber: "bg-[#FEFCE8] border-[#FEF08A] text-[#CA8A04]",
    outline: "bg-white border-[#ECEBFF] text-[#161326]",
    white: "bg-white/90 border-[#ECEBFF] text-[#161326] shadow-sm backdrop-blur-md",
  };

  const dotStyles = {
    brand: "bg-[#6D5DF6]",
    emerald: "bg-[#22C55E]",
    amber: "bg-[#EAB308]",
    outline: "bg-[#6D5DF6]",
    white: "bg-[#22C55E]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.16em] ${variantStyles[variant]} ${className}`}
    >
      {showDot && (
        <span className={`h-2 w-2 rounded-full ${dotStyles[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};
