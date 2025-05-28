import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Importa a página Home
import Login from './pages/Login'; // Importa a página de Login
import Register from './pages/Register'; // Importa a página de Cadastro
import HowItWorks from './pages/HowItWorks'; // Importa a página "Veja como funciona"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        {/* Adicione outras rotas conforme o projeto evolui, como /profile, /practice, etc. */}
      </Routes>
    </Router>
  );
}

export default App;