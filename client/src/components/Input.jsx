import React from 'react';

function Input({ label, type = 'text', value, onChange, placeholder, id, name, className = '' }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-white-text text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Estilos para o input: sombra, borda, rounded, largura total, padding, cor do texto, linha, foco, bg cinza
        className={`shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-white-text leading-tight focus:outline-none focus:ring-2 focus:ring-white-text focus:border-transparent bg-gray-800 ${className}`}
      />
    </div>
  );
}

export default Input;