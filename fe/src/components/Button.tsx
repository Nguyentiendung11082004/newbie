import React, { ReactNode } from "react";
interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}
export const Button = React.forwardRef(({ onClick, className = "", children }: ButtonProps, ref: any) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
});
