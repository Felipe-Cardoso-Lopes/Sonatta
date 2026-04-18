import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VerifyEmail from './pages/VerifyEmail';

// Páginas Públicas e de Autenticação
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import AboutYou from './pages/AboutYou';
import MusicalProfile from './pages/MusicalProfile';
import PendingApproval from './pages/PendingApproval';

// Páginas do Aluno
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentLessons from './pages/StudentLessons';
import StudentPractice from './pages/StudentPractice';
// import StudentChat from './pages/StudentChat'; // Descomente quando o arquivo existir

// Páginas do Professor
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherOverview from './pages/TeacherOverview';
import TeacherManagement from './pages/TeacherManagement';
import TeacherProfile from './pages/TeacherProfile';
// import TeacherChat from './pages/TeacherChat'; // Descomente quando o arquivo existir

// Páginas da Instituição
import InstituicaoDashboard from './pages/InstituicaoDashboard';
import InstituicaoOverview from './pages/InstituicaoOverview';
import InstituicaoManagement from './pages/InstituicaoManagement';
import InstituicaoFinancial from './pages/InstituicaoFinancial';
import InstituicaoSettings from './pages/InstituicaoSettings';

// Páginas do Super Admin
import SuperAdminDashboard from './pages/SuperAdminDashboard';
// import SuperAdminSchools from './pages/SuperAdminSchools'; // Descomente quando o arquivo existir
import SuperAdminSubscriptions from './pages/SuperAdminSubscriptions';
import SuperAdminSystem from './pages/SuperAdminSystem';

function App() {
  return (
     <div className="w-screen min-h-screen bg-dark-bg text-white-text font-poppins flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about-you/:id" element={<AboutYou />} />
          <Route path="/musical-profile/:id" element={<MusicalProfile />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Rota do Usuário Comum (Sem vínculo) */}
          <Route path="/pending-approval" element={<PendingApproval />} />
          
          {/* Rotas do Aluno */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/lessons" element={<StudentLessons />} />
          <Route path="/practice" element={<StudentPractice />} />
          {/* <Route path="/student/chat" element={<StudentChat />} /> */}

          {/* Rotas do Professor */}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/overview" element={<TeacherOverview />} />
          <Route path="/teacher/management" element={<TeacherManagement />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          {/* <Route path="/teacher/chat" element={<TeacherChat />} /> */}

          {/* Rotas da Instituição */}
          <Route path="/instituicao-dashboard" element={<InstituicaoDashboard />} />
          <Route path="/instituicao/overview" element={<InstituicaoOverview />} />
          <Route path="/instituicao/management" element={<InstituicaoManagement />} />
          <Route path="/instituicao/financial" element={<InstituicaoFinancial />} />
          <Route path="/instituicao/settings" element={<InstituicaoSettings />} />

          {/* Rotas do Super Admin (Torre de Controle) */}
          <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
          {/* <Route path="/super-admin/schools" element={<SuperAdminSchools />} /> */}
          { <Route path="/super-admin-subscriptions" element={<SuperAdminSubscriptions />} />}
          { <Route path="/super-admin/system" element={<SuperAdminSystem />} /> }

        </Routes>
      </Router>
    </div>
  );
}

export default App;