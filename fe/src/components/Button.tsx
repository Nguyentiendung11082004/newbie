import React from "react";

export const Button = ({ onClick, className = "", children }) => {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${className}`}
      >
        {children}
      </button>
    );
  };
  