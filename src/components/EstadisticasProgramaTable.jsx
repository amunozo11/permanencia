"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function EstadisticasProgramaTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "programa", direction: "ascending" })
  const [viewMode, setViewMode] = useState("table") // "table" o "cards"
  const [expandedProgram, setExpandedProgram] = useState(null)

  // Agrupar y calcular estadísticas por programa
  const programaStats = {}

  data.forEach((item) => {
    if (!programaStats[item.programa]) {
      programaStats[item.programa] = {
        programa: item.programa,
        total: 0,
        vulnerabilidadAcademica: 0,
        vulnerabilidadEconomica: 0,
        vulnerabilidadPsicosocial: 0,
        requiereTutoria: 0,
        condicionBaja: 0,
        condicionMedia: 0,
        condicionAlta: 0,
        riesgoAlto: 0,
        riesgoMedio: 0,
        riesgoBajo: 0,
      }
    }

    programaStats[item.programa].total += 1

    // Contar por tipo de vulnerabilidad
    if (item.tipo_vulnerabilidad === "ACADEMICA") {
      programaStats[item.programa].vulnerabilidadAcademica += 1
    } else if (item.tipo_vulnerabilidad === "ECONOMICA") {
      programaStats[item.programa].vulnerabilidadEconomica += 1
    } else if (item.tipo_vulnerabilidad === "PSICOSOCIAL") {
      programaStats[item.programa].vulnerabilidadPsicosocial += 1
    }

    // Contar por requerimiento de tutoría
    if (item.requiere_tutoria) {
      programaStats[item.programa].requiereTutoria += 1
    }

    // Contar por condición socioeconómica
    if (item.condicion_socioeconomica === "Baja") {
      programaStats[item.programa].condicionBaja += 1
    } else if (item.condicion_socioeconomica === "Media") {
      programaStats[item.programa].condicionMedia += 1
    } else if (item.condicion_socioeconomica === "Alta") {
      programaStats[item.programa].condicionAlta += 1
    }

    // Contar por nivel de riesgo
    if (item.riesgo_desercion === "Alto") {
      programaStats[item.programa].riesgoAlto += 1
    } else if (item.riesgo_desercion === "Medio") {
      programaStats[item.programa].riesgoMedio += 1
    } else if (item.riesgo_desercion === "Bajo") {
      programaStats[item.programa].riesgoBajo += 1
    }
  })

  // Convertir a array para la tabla
  const tableData = Object.values(programaStats)

  // Ordenar datos
  if (sortConfig.key) {
    tableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Función para solicitar ordenamiento
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Función para obtener el porcentaje
  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  // Función para alternar la vista expandida de un programa
  const toggleExpandProgram = (programa) => {
    if (expandedProgram === programa) {
      setExpandedProgram(null)
    } else {
      setExpandedProgram(programa)
    }
  }

  // Función para renderizar el indicador de riesgo
  const renderRiskIndicator = (alto, medio, bajo, total) => {
    const altoPercent = getPercentage(alto, total)
    const medioPercent = getPercentage(medio, total)
    const bajoPercent = getPercentage(bajo, total)

    return (
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="bg-red-500 transition-all duration-500 ease-in-out"
          style={{ width: `${altoPercent}%` }}
          title={`Riesgo Alto: ${alto} (${altoPercent}%)`}
        ></div>
        <div
          className="bg-yellow-500 transition-all duration-500 ease-in-out"
          style={{ width: `${medioPercent}%` }}
          title={`Riesgo Medio: ${medio} (${medioPercent}%)`}
        ></div>
        <div
          className="bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${bajoPercent}%` }}
          title={`Riesgo Bajo: ${bajo} (${bajoPercent}%)`}
        ></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-md border-2 border-institucional-verde3/20 hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-institucional-verde1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Estadísticas por Programa Académico
          </h3>
          <p className="text-sm text-gray-600">
            Análisis detallado por programa, incluyendo vulnerabilidad, tutoría y condición socioeconómica.
          </p>
        </div>

        {/* Controles de visualización */}
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
              viewMode === "table"
                ? "bg-institucional-verde1 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Tabla
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
              viewMode === "cards"
                ? "bg-institucional-verde1 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Tarjetas
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "table" ? (
          <motion.div
            key="table-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-institucional-verde1 text-white">
                <tr>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                    onClick={() => requestSort("programa")}
                  >
                    <div className="flex items-center">
                      Programa
                      {sortConfig.key === "programa" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortConfig.direction === "ascending" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center cursor-pointer hover:bg-institucional-verde2 transition-colors"
                    onClick={() => requestSort("total")}
                  >
                    <div className="flex items-center justify-center">
                      Total
                      {sortConfig.key === "total" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortConfig.direction === "ascending" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">Distribución de Riesgo</th>
                  <th className="px-4 py-3 text-center">Vulnerabilidad</th>
                  <th className="px-4 py-3 text-center">Tutoría</th>
                  <th className="px-4 py-3 text-center">Condición Socioeconómica</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={
                      index % 2 === 0
                        ? "bg-white hover:bg-gray-50"
                        : "bg-institucional-verde3/10 hover:bg-institucional-verde3/20"
                    }
                  >
                    <td className="px-4 py-3 font-medium">{row.programa}</td>
                    <td className="px-4 py-3 text-center font-semibold">{row.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-2">
                        {renderRiskIndicator(row.riesgoAlto, row.riesgoMedio, row.riesgoBajo, row.total)}
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            Alto: {row.riesgoAlto}
                          </span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                            Medio: {row.riesgoMedio}
                          </span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Bajo: {row.riesgoBajo}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Académica:</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${getPercentage(row.vulnerabilidadAcademica, row.total)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">
                              {row.vulnerabilidadAcademica} ({getPercentage(row.vulnerabilidadAcademica, row.total)}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Económica:</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${getPercentage(row.vulnerabilidadEconomica, row.total)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">
                              {row.vulnerabilidadEconomica} ({getPercentage(row.vulnerabilidadEconomica, row.total)}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Psicosocial:</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${getPercentage(row.vulnerabilidadPsicosocial, row.total)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">
                              {row.vulnerabilidadPsicosocial} ({getPercentage(row.vulnerabilidadPsicosocial, row.total)}
                              %)
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                          <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#57A641"
                              strokeWidth="3"
                              strokeDasharray={`${getPercentage(row.requiereTutoria, row.total)}, 100`}
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-lg font-bold">{getPercentage(row.requiereTutoria, row.total)}%</div>
                          </div>
                        </div>
                        <div className="text-xs mt-1 font-medium">{row.requiereTutoria} estudiantes</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <div className="w-full max-w-xs">
                          <div className="flex items-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-xs">Baja: {row.condicionBaja}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <span className="text-xs">Media: {row.condicionMedia}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-xs">Alta: {row.condicionAlta}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="cards-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {tableData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div
                  className="bg-institucional-verde1 text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandProgram(row.programa)}
                >
                  <h4 className="font-semibold truncate">{row.programa}</h4>
                  <div className="flex items-center">
                    <span className="bg-white text-institucional-verde1 text-xs font-bold rounded-full px-2 py-1 mr-2">
                      {row.total}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform ${
                        expandedProgram === row.programa ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Distribución de Riesgo
                    </h5>
                    <div className="space-y-2">
                      {renderRiskIndicator(row.riesgoAlto, row.riesgoMedio, row.riesgoBajo, row.total)}
                      <div className="flex justify-between text-xs">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                          Alto: {row.riesgoAlto}
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                          Medio: {row.riesgoMedio}
                        </span>
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Bajo: {row.riesgoBajo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedProgram === row.programa && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Vulnerabilidad
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Académica:</span>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${getPercentage(row.vulnerabilidadAcademica, row.total)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {row.vulnerabilidadAcademica} ({getPercentage(row.vulnerabilidadAcademica, row.total)}
                                  %)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Económica:</span>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{ width: `${getPercentage(row.vulnerabilidadEconomica, row.total)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {row.vulnerabilidadEconomica} ({getPercentage(row.vulnerabilidadEconomica, row.total)}
                                  %)
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs">Psicosocial:</span>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${getPercentage(row.vulnerabilidadPsicosocial, row.total)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {row.vulnerabilidadPsicosocial} (
                                  {getPercentage(row.vulnerabilidadPsicosocial, row.total)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.775-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                              Tutoría
                            </h5>
                            <div className="flex flex-col items-center">
                              <div className="relative w-16 h-16">
                                <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#eee"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#57A641"
                                    strokeWidth="3"
                                    strokeDasharray={`${getPercentage(row.requiereTutoria, row.total)}, 100`}
                                  />
                                </svg>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                  <div className="text-lg font-bold">
                                    {getPercentage(row.requiereTutoria, row.total)}%
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs mt-1 font-medium">{row.requiereTutoria} estudiantes</div>
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-yellow-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Condición Socioeconómica
                            </h5>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-xs">Baja: {row.condicionBaja}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                <span className="text-xs">Media: {row.condicionMedia}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-xs">Alta: {row.condicionAlta}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {expandedProgram !== row.programa && (
                    <button
                      onClick={() => toggleExpandProgram(row.programa)}
                      className="mt-2 text-xs text-institucional-verde1 hover:text-institucional-verde2 font-medium flex items-center"
                    >
                      Ver más detalles
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-institucional-verde1 mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Información sobre los datos
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Los datos muestran estadísticas detalladas por programa académico.</p>
          <p>• La distribución de riesgo indica la proporción de estudiantes en cada nivel de riesgo de deserción.</p>
          <p>• Las vulnerabilidades se clasifican en académicas, económicas y psicosociales.</p>
          <p>• El porcentaje de tutoría muestra la proporción de estudiantes que requieren apoyo tutorial.</p>
          <p>• La condición socioeconómica se clasifica en baja, media y alta.</p>
        </div>
      </div>
    </motion.div>
  )
}
