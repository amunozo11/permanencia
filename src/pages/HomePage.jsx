"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Servicios
import { getData, saveData } from "../services/storageService"
import {
  generateEmptyData,
  calculateTotals,
  groupByPrograma,
  getRiesgoDesercionData,
  getTipoVulnerabilidadData,
  getRequiereTutoriaData,
  getServiciosData,
  getEdadDesertores,
  getEstratoInscritos,
  getCondicionSocioeconomicaData,
} from "../services/dataProcessingService"

// Componentes
import DataTable from "../components/DataTable"
import KPISection from "../components/KPISection"
import EstadisticasProgramaTable from "../components/EstadisticasProgramaTable"
import PieChartProgramas from "../components/PieChartProgramas"
import ScatterChartPanel from "../components/ScatterChartPanel"
import RiesgoDesercionChart from "../components/RiesgoDesercionChart"
import VulnerabilidadBarChart from "../components/VulnerabilidadBarChart"
import TutoriaDonutChart from "../components/TutoriaDonutChart"
import ServiciosBarChart from "../components/ServiciosBarChart"
import ServiciosPermanencia from "../components/ServiciosPermanencia"
import EstadisticasServicios from "../components/EstadisticasServicios"
import CSVUploader from "../components/CSVUploader"

export default function HomePage() {
  // Estado para almacenar los datos
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Estados para datos derivados
  const [totals, setTotals] = useState({ inscritos: 0, matriculados: 0, desertores: 0, graduados: 0 })
  const [barData, setBarData] = useState([])
  const [pieData, setPieData] = useState([])
  const [edadDesertores, setEdadDesertores] = useState([])
  const [estratoInscritos, setEstratoInscritos] = useState([])
  const [riesgoDesercionData, setRiesgoDesercionData] = useState([])
  const [vulnerabilidadData, setVulnerabilidadData] = useState([])
  const [tutoriaData, setTutoriaData] = useState([])
  const [serviciosData, setServiciosData] = useState([])
  const [condicionSocioeconomicaData, setCondicionSocioeconomicaData] = useState([])

  // Cargar datos al iniciar
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)

      // Intentar cargar datos del almacenamiento local
      const storedData = getData()

      if (storedData && storedData.length > 0) {
        // Si hay datos almacenados, usarlos
        setData(storedData)
        updateDerivedData(storedData)
      } else {
        // Si no hay datos, usar datos vacíos
        const emptyData = generateEmptyData()
        setData(emptyData)
        updateDerivedData(emptyData)
      }

      setIsLoading(false)
    }

    loadInitialData()
  }, [])

  // Función para actualizar todos los datos derivados
  const updateDerivedData = (newData) => {
    setTotals(calculateTotals(newData))
    setBarData(groupByPrograma(newData))
    setPieData(newData)
    setEdadDesertores(getEdadDesertores(newData))
    setEstratoInscritos(getEstratoInscritos(newData))
    setRiesgoDesercionData(getRiesgoDesercionData(newData))
    setVulnerabilidadData(getTipoVulnerabilidadData(newData))
    setTutoriaData(getRequiereTutoriaData(newData))
    setServiciosData(getServiciosData(newData))
    setCondicionSocioeconomicaData(getCondicionSocioeconomicaData(newData))
  }

  // Función para manejar los datos cargados desde el CSV
  const handleDataLoaded = (newData) => {
    setData(newData)
    updateDerivedData(newData)
    saveData(newData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-institucional-verde1 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Permanencia Estudiantil</h1>
                <p className="text-sm opacity-80">Universidad Popular del Cesar - Grupo 01</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-white text-institucional-verde1"
                    : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                }`}
              >
                Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("data")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "data"
                    ? "bg-white text-institucional-verde1"
                    : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                }`}
              >
                Datos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("services")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "services"
                    ? "bg-white text-institucional-verde1"
                    : "bg-institucional-verde2 text-white hover:bg-institucional-verde3"
                }`}
              >
                Servicios
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Componente para cargar CSV */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-xl shadow-md">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-institucional-verde1">Datos de Permanencia Estudiantil</h2>
            <p className="text-sm text-gray-600">Carga tu archivo CSV con los datos de permanencia</p>
          </div>
          <div className="flex space-x-2">
            <CSVUploader onDataLoaded={handleDataLoaded} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <KPISection totals={totals} />

              {/* Primera fila: Distribución por programa y Estadísticas por programa */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <PieChartProgramas data={pieData} />
                <EstadisticasProgramaTable data={data} />
              </div>

              {/* Segunda fila: Riesgo de deserción y Tutoría */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <RiesgoDesercionChart data={riesgoDesercionData} />
                <TutoriaDonutChart data={tutoriaData} />
              </div>

              {/* Tercera fila: Vulnerabilidad y Servicios */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <VulnerabilidadBarChart data={vulnerabilidadData} />
                <ServiciosBarChart data={serviciosData} />
              </div>

              {/* Cuarta fila: Gráficos de dispersión */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ScatterChartPanel
                  data={edadDesertores}
                  xKey="estrato"
                  yKey="desertores"
                  xLabel="Estrato socioeconómico"
                  yLabel="Estudiantes en riesgo"
                  title="Relación Estrato vs Riesgo de Deserción"
                />
                <ScatterChartPanel
                  data={estratoInscritos}
                  xKey="estrato"
                  yKey="inscritos"
                  xLabel="Estrato socioeconómico"
                  yLabel="Estudiantes"
                  title="Distribución por Estrato Socioeconómico"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DataTable data={data} />
            </motion.div>
          )}

          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ServiciosPermanencia />
              <EstadisticasServicios data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 p-6 bg-institucional-verde1 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Universidad Popular del Cesar</h3>
              <p className="text-white/80">Sistema de Información para la Unidad de Permanencia</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-white/80">
                © {new Date().getFullYear()} Grupo 01 - Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
