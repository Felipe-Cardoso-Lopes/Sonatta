// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import InstituicaoDashboard from './pages/InstituicaoDashboard';
import AboutYou from './pages/AboutYou';
import MusicalProfile from './pages/MusicalProfile';
import StudentProfile from './pages/StudentProfile';
import StudentLessons from './pages/StudentLessons';
import StudentPractice from './pages/StudentPractice';
import TeacherOverview from './pages/TeacherOverview';
import TeacherManagement from './pages/TeacherManagement';
import InstituicaoOverview from './pages/InstituicaoOverview';
import InstituicaoManagement from './pages/InstituicaoManagement';
import InstituicaoFinancial from './pages/InstituicaoFinancial';
import InstituicaoSettings from './pages/InstituicaoSettings';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (
    <div className="w-screen min-h-screen bg-dark-bg text-pure-white font-poppins flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-you/:id" element={<AboutYou />} />
          <Route path="/musical-profile/:id" element={<MusicalProfile />} />
          
          {/*Rotas do aluno*/}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/lessons" element={<StudentLessons />} />
          <Route path="/practice" element={<StudentPractice />} />

          {/*Rotas do professor*/}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/overview" element={<TeacherOverview />} />
          <Route path="/teacher/management" element={<TeacherManagement />} />

          {/*Rotas do instituicao*/}
          <Route path="/instituicao-dashboard" element={<InstituicaoDashboard />} />
          <Route path="/instituicao/overview" element={<InstituicaoOverview />} />
          <Route path="/instituicao/management" element={<InstituicaoManagement />} />
          <Route path="/instituicao/financial" element={<InstituicaoFinancial />} />
          <Route path="/instituicao/settings" element={<InstituicaoSettings />} />

          {/* Rota do Super Admin (Torre de Controle) */}
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;