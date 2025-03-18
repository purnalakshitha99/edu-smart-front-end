import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Company from './pages/Company';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import Exams from './pages/Exams';
import ExamRoom from './pages/ExamRoom';
import Footer from './components/Footer';
import ClassRoom from './pages/ClassRoom';
import ClassTime from './pages/ClassTime';
import AuthPage from './pages/AuthPage'; 
// import PublicRoute from './components/PublicRoute';
// import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { TeacherAuth } from './pages/TeacherAuth';
import { RoleSelection } from './pages/RoleSelection';
import EthicalReportPage from './pages/EthicalReportPage';
import TeachersHomePage from './pages/TeachersHomePage';
import TeacherDashBord from './pages/TeacherDashBord';


import ProfilePage from './pages/ProfilePage';
import { useEffect, useState } from 'react';
import Test from './pages/Test';

function App() { 
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">

        <Routes>
          {/* Public Routes (Navbar/Footer for other pages) */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/courses" element={<><Navbar /><Courses /><Footer /></>} />
          <Route path="/company" element={<><Navbar /><Company /><Footer /></>} />
          <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutUs /><Footer /></>} />
          <Route path="/exams" element={<><Navbar /><Exams /><Footer /></>} />
          <Route path="/class" element={<><Navbar /><ClassTime /><Footer /></>} />
          <Route path='/Classroom' element={<><Navbar /><ClassRoom /><Footer /></>} />
          <Route path='/test' element={<Test />} />
          <Route path='/teacherlogin'element={<TeacherAuth/>}/>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/exam/:examId" element={<><Navbar /><ExamRoom /><Footer /></>} />
          <Route path='/roleselection' element={<RoleSelection/>}/>
          <Route path='/ethicalReport' element={<EthicalReportPage />} />
          <Route path='/teacherlogin' element={<TeacherAuth />} />
          <Route path='/teacherhomepage' element={<TeachersHomePage />} />
          <Route 
          path='/teacherdashbord' 
          element={<TeacherDashBord />}
        />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;