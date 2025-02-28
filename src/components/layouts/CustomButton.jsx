import React from "react";

function CustomButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`${className}`}
    >
      {children}
    </button>
  );
}

export default CustomButton;
