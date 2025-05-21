import React from "react";
import RemisionPsicologica from '../components/RemisionPsicologica';
import AsistenciaPsicologica from "../components/AsistenciaPsicologica"; // ajusta la ruta si es necesario


import { div } from "framer-motion/client";
import IngenieriaSoftwareForm from "../components/IngenieriaSoftware";
import IntervencionGrupalForm from "../components/IntervencionGrupal";

export default function Psicológica() {
    return (
        <div className="min-h-screen">
            < RemisionPsicologica ></RemisionPsicologica>
            <AsistenciaPsicologica></AsistenciaPsicologica>
            <IngenieriaSoftwareForm></IngenieriaSoftwareForm>
            <IntervencionGrupalForm></IntervencionGrupalForm>
        </div>
    )
}