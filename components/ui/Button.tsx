import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "white" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-black rounded-2xl transition duration-300 transform active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:transform-none cursor-pointer";

  const variants = {
    primary:
      "bg-[#6D5DF6] text-white shadow-[0_14px_34px_rgba(109,93,246,0.24)] hover:-translate-y-0.5 hover:bg-[#5A4AE3] hover:shadow-[0_18px_40px_rgba(109,93,246,0.32)]",
    secondary:
      "bg-[#22C55E] text-white shadow-[0_14px_34px_rgba(34,197,94,0.22)] hover:-translate-y-0.5 hover:bg-[#16A34A]",
    outline:
      "border border-[#D9D6FF] bg-white text-[#161326] hover:-translate-y-0.5 hover:bg-[#F5F3FF] hover:border-[#6D5DF6]",
    white:
      "bg-white text-[#161326] shadow-lg shadow-black/5 hover:-translate-y-0.5 hover:bg-[#FAFBFF]",
    ghost:
      "bg-transparent text-[#6B7280] hover:text-[#6D5DF6] hover:bg-[#F5F3FF]",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs min-h-[38px]",
    md: "px-6 py-3 text-sm min-h-[48px]",
    lg: "px-8 py-4 text-base min-h-[56px]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};
