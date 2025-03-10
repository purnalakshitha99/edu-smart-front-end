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

          {/* Auth Page (No Navbar/Footer) - Renamed from Login to AuthPage*/}
          <Route path="/login" element={<AuthPage />} />

          {/* Exam Room (Example of a route that *could* have Navbar/Footer) - Adjust as needed.
             The ExamRoom component itself would need to handle if it shows a footer or not. */}
          <Route path="/exam/:examId" element={<><Navbar /><ExamRoom /><Footer /></>} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;