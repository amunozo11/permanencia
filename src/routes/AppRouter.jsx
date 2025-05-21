import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BorradorActa from "../components/ActaNegacionForm";
import HomePage from "../pages/HomePage";
import Psicológica from "../pages/Psicologia";


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/borrador" element={<BorradorActa />} />
=======
        <Route path="/psicologia" element={<Psicológica />} />
>>>>>>> a49cf763a0b1ff2ef30566fd9f306834c9da377f
      </Routes>
    </Router>
  );
}
