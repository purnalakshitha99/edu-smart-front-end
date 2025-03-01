import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/loginPage";
import EthicalReportPage from "./pages/EthicalReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/ethicalReport" element={<EthicalReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
