import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/company" element={<Company />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/class" element={<ClassTime/>} />  {/* Route to the Classroom PAGE */}
            <Route path="/exam/:examId" element={<ExamRoom />} />
            <Route path='/Classroom' element={<ClassRoom/>}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;