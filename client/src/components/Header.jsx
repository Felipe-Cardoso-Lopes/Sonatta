import React from "react";
import { Link } from "react-router-dom";

function Header() {
  // Nome da função agora é Header
  return (
    <nav className="flex justify-between items-center p-5">
      <div className="flex items-center gap-3 transition-transform hover:scale-125">
        <Link to="/">
        <img
          src="../public/assets/sonatta-logo.png"
          alt="Sonatta Logo"
          className="w-12 h-12 scale-150 "
        />
        </Link>
        <Link to="/" className="text-2xl font-bold">
          Sonatta
        </Link>
      </div>

      <div className="flex gap-6">
        <Link to="/register" className="text-xl hover:font-bold">
          Cadastrar
        </Link>

        <Link to="/login" className="text-white text-xl hover:font-bold">
          Entrar
        </Link>
      </div>
    </nav>
  );
}

export default Header; // Exporta como Header
