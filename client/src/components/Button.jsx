import React from 'react';

function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  const baseClasses = "px-5 py-3 rounded-lg font-bold transition duration-300 ease-in-out cursor-pointer";
  let variantClasses = "";

  if (variant === 'primary') {
    variantClasses = "bg-white-text text-dark-bg hover:opacity-90";
  } else if (variant === 'secondary') {
    variantClasses = "border border-white-text text-white-text hover:bg-white-text hover:text-dark-bg";
  }
  // Você pode adicionar mais variantes aqui (ex: 'danger', 'outline', etc.)

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;