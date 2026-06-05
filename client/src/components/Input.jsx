import React, { useState } from 'react';

function Input({ label, id, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Se for senha, verifica se deve mostrar como texto ou ocultar
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-bold text-white-text mb-1" htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          id={id}
          type={currentType}
          className="w-full p-2 pr-12 rounded bg-dark-bg border border-gray-600 text-white-text focus:outline-none focus:border-purple-500"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-purple-400"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;