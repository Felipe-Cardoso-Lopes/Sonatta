// felipe-cardoso-lopes/sonatta/Sonatta-d63186ec006a2e56cd14b87d9cb8564ef4006ca1/client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutYou from './pages/AboutYou';
import MusicalProfile from './pages/MusicalProfile';
import StudentProfile from './pages/StudentProfile';
import StudentLessons from './pages/StudentLessons';
import StudentPractice from './pages/StudentPractice';
import TeacherOverview from './pages/TeacherOverview';
import TeacherManagement from './pages/TeacherManagement';
import AdminOverview from './pages/AdminOverview';
import AdminManagement from './pages/AdminManagement';
import AdminFinancial from './pages/AdminFinancial';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <div className="w-screen-full h-screen-full bg-dark-bg text-white-text font-poppins flex flex-col ">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-you/:id" element={<AboutYou />} />
          <Route path="/musical-profile" element={<MusicalProfile />} />
          
          {/*Rotas do aluno*/}
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/lessons" element={<StudentLessons />} />
          <Route path="/practice" element={<StudentPractice />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />

          {/*Rotas do professor*/}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/overview" element={<TeacherOverview />} />
          <Route path="/teacher/management" element={<TeacherManagement />} />

          {/*Rotas do admin*/}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/overview" element={<AdminOverview />} />
          <Route path="/admin/management" element={<AdminManagement />} />
          <Route path="/admin/financial" element={<AdminFinancial />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;