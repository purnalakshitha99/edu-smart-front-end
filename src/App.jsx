import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LandingPage from "./pages/attemptQuiz/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/attempt-quiz" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
