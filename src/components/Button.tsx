import React from "react";

interface IconButtonProps {
  variant?: "neutral" | "negative" | "positive";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Button: React.FC<IconButtonProps> = ({
  onClick,
  children,
  style,
  variant = "neutral",
}) => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={`w-full h-full rounded-lg shadow-md flex items-center justify-center ${
        variant === "neutral"
          ? "bg-gray-200"
          : variant === "negative"
          ? "bg-red-200"
          : "bg-green-200"
      }`}
    >
      {children}
    </button>
  );
};
