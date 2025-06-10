// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="w-screen-full h-screen-full  bg-dark-bg text-white-text font-poppins flex flex-col p-1">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        
        {/* Rotas das Dashboards (para acesso direto para teste antes do backend) */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Futuras rotas aninhadas ou específicas de cada dashboard */}
        {/* Ex: <Route path="/student/lessons" element={<StudentLessons />} /> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;