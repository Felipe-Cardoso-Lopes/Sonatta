import React from 'react';

function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  const baseClasses = "px-5 py-3 rounded-lg font-bold transition duration-300 ease-in-out cursor-pointer";
  let variantClasses = "";

  if (variant === 'primary') {
    // Normal: Fundo preto (dark-bg), texto branco (white-text), BORDA BRANCA
    // Hover: Fundo branco (white-text), texto preto (dark-bg), BORDA BRANCA
    variantClasses = "bg-dark-bg text-white-text border border-white-text hover:bg-white-text hover:text-dark-bg";
  } else if (variant === 'secondary') {
    // Mantém a lógica anterior: borda branca, texto branco; no hover, fundo branco, texto preto
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