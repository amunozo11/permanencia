import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import IntervencionPage from '../pages/IntervencionPage';
import IngenieriaSoftwarePage from '../pages/IngenieriaSoftwarePage';
import IntervencionGrupalPage from '../pages/IntervencionGrupalPage';
import FichaDocentePage from '../pages/FichaDocentePage';
import AsistenciaActividadPage from '../pages/AsistenciaActividadPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intervencion" element={<IntervencionPage />} />
        <Route path="/ingenieria-software" element={<IngenieriaSoftwarePage />} />
        <Route path="/intervencion-grupal" element={<IntervencionGrupalPage />} />
        <Route path="/ficha-docente" element={<FichaDocentePage />} />
        <Route path="/asistencia-actividad" element={<AsistenciaActividadPage />} />
      </Routes>
    </Router>
  );
}