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
          <Route path="/student-profile" element={<StudentProfile />} />
           <Route path="/lessons" element={<StudentLessons />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;