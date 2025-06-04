import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Importa a página Home
import Login from "./pages/Login"; // Importa a página de Login
import Register from "./pages/Register"; // Importa a página de Cadastro
import HowItWorks from "./pages/HowItWorks"; // Importa a página "Veja como funciona"
import MusicParticles from "./components/MusicParticles";
import AboutYou from "./pages/AboutYou"; // Nova página
import MusicalProfile from "./pages/MusicalProfile"; // Nova página
import ProfessionalProfile from "./pages/ProfessionalProfile"; // Nova página
import Experience from "./pages/Experience"; // Nova página

function App() {
  return (
    <div className="w-screen-full h-screen-full  bg-dark-bg text-white-text font-poppins flex flex-col p-1">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* Novas rotas do fluxo de cadastro */}
          <Route path="/about-you" element={<AboutYou />} />
          <Route path="/musical-profile" element={<MusicalProfile />} />
          <Route path="/professional-profile" element={<ProfessionalProfile />} />
          <Route path="/experience" element={<Experience />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;