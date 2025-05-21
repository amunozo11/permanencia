import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BorradorActa from "../components/ActaNegacionForm";
import HomePage from "../pages/HomePage";
import Psicológica from "../pages/Psicologia";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

       <Route path="/borrador" element={<BorradorActa />} />

       <Route path="/psicologia" element={<Psicológica />} />

      </Routes>
    </Router>
  );
}
