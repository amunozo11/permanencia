import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Psicológica from "../pages/Psicologia";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/psicologia" element={<Psicológica />} />
      </Routes>
    </Router>
  );
}
