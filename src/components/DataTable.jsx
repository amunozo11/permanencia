"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"

export default function DataTable({ data }) {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [filterConfig, setFilterConfig] = useState({
    programa: "",
    riesgo_desercion: "",
    tipo_vulnerabilidad: "",
    requiere_tutoria: "",
  })
  const rowsPerPage = 10

  // Obtener valores únicos para los filtros
  const uniqueValues = useMemo(() => {
    return {
      programas: [...new Set(data.map((item) => item.programa))].filter(Boolean).sort(),
      riesgos: [...new Set(data.map((item) => item.riesgo_desercion))].filter(Boolean).sort(),
      vulnerabilidades: [...new Set(data.map((item) => item.tipo_vulnerabilidad))].filter(Boolean).sort(),
    }
  }, [data])

  // Función para ordenar datos
  const sortedData = useMemo(() => {
    const sortableData = [...data]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] === null) return 1
        if (b[sortConfig.key] === null) return -1
        if (a[sortConfig.key] === b[sortConfig.key]) return 0

        const aValue = typeof a[sortConfig.key] === "string" ? a[sortConfig.key].toLowerCase() : a[sortConfig.key]
        const bValue = typeof b[sortConfig.key] === "string" ? b[sortConfig.key].toLowerCase() : b[sortConfig.key]

        if (sortConfig.direction === "ascending") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
    return sortableData
  }, [data, sortConfig])

  // Función para solicitar ordenamiento
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Filtrar datos según la búsqueda y filtros
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      // Filtro de búsqueda general
      const matchesSearch = Object.values(item).some(
        (value) => value !== null && value.toString().toLowerCase().includes(search.toLowerCase()),
      )

      // Filtros específicos
      const matchesPrograma = !filterConfig.programa || item.programa === filterConfig.programa
      const matchesRiesgo = !filterConfig.riesgo_desercion || item.riesgo_desercion === filterConfig.riesgo_desercion
      const matchesVulnerabilidad =
        !filterConfig.tipo_vulnerabilidad || item.tipo_vulnerabilidad === filterConfig.tipo_vulnerabilidad
      const matchesTutoria =
        filterConfig.requiere_tutoria === "" ||
        (filterConfig.requiere_tutoria === "si" && item.requiere_tutoria === true) ||
        (filterConfig.requiere_tutoria === "no" && item.requiere_tutoria === false)

      return matchesSearch && matchesPrograma && matchesRiesgo && matchesVulnerabilidad && matchesTutoria
    })
  }, [sortedData, search, filterConfig])

  // Calcular páginas
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage)

  // Función para manejar el cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilterConfig({
      programa: "",
      riesgo_desercion: "",
      tipo_vulnerabilidad: "",
      requiere_tutoria: "",
    })
    setSearch("")
    setSortConfig({ key: null, direction: "ascending" })
  }

  // Función para exportar a CSV
  const exportToCSV = () => {
    const headers = [
      "Programa",
      "Periodo",
      "Semestre",
      "Inscritos",
      "Matriculados",
      "Desertores",
      "Graduados",
      "Estrato",
      "Riesgo",
      "Vulnerabilidad",
      "Requiere Tutoría",
      "Servicio",
    ]

    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          `"${row.programa || ""}"`,
          `"${row.periodo || ""}"`,
          row.semestre || 0,
          row.inscritos || 0,
          row.matriculados || 0,
          row.desertores || 0,
          row.graduados || 0,
          row.estrato || 0,
          `"${row.riesgo_desercion || ""}"`,
          `"${row.tipo_vulnerabilidad || ""}"`,
          row.requiere_tutoria ? "Sí" : "No",
          `"${row.servicio || ""}"`,
        ].join(","),
      ),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "datos_permanencia.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 bg-white rounded-xl p-6 shadow-lg border-2 border-institucional-verde3/20"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-institucional-verde1 flex items-center">
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
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
            />
          </svg>
          Datos de Permanencia Estudiantil
        </h3>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-institucional-verde2 text-white rounded-lg text-sm font-medium flex items-center"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Exportar CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </motion.button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Buscar en cualquier campo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-institucional-verde2 focus:border-transparent"
          />
        </div>

        <select
          value={filterConfig.programa}
          onChange={(e) => {
            setFilterConfig({ ...filterConfig, programa: e.target.value })
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-institucional-verde2"
        >
          <option value="">Todos los programas</option>
          {uniqueValues.programas.map((programa) => (
            <option key={programa} value={programa}>
              {programa}
            </option>
          ))}
        </select>

        <select
          value={filterConfig.riesgo_desercion}
          onChange={(e) => {
            setFilterConfig({ ...filterConfig, riesgo_desercion: e.target.value })
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-institucional-verde2"
        >
          <option value="">Todos los riesgos</option>
          {uniqueValues.riesgos.map((riesgo) => (
            <option key={riesgo} value={riesgo}>
              {riesgo}
            </option>
          ))}
        </select>

        <select
          value={filterConfig.requiere_tutoria}
          onChange={(e) => {
            setFilterConfig({ ...filterConfig, requiere_tutoria: e.target.value })
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-institucional-verde2"
        >
          <option value="">Tutoría (Todos)</option>
          <option value="si">Requiere tutoría</option>
          <option value="no">No requiere tutoría</option>
        </select>
      </div>

      <div className="overflow-x-auto">
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("periodo")}
              >
                <div className="flex items-center">
                  Periodo
                  {sortConfig.key === "periodo" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("inscritos")}
              >
                <div className="flex items-center">
                  Inscritos
                  {sortConfig.key === "inscritos" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("matriculados")}
              >
                <div className="flex items-center">
                  Matriculados
                  {sortConfig.key === "matriculados" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("desertores")}
              >
                <div className="flex items-center">
                  Desertores
                  {sortConfig.key === "desertores" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("estrato")}
              >
                <div className="flex items-center">
                  Estrato
                  {sortConfig.key === "estrato" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("riesgo_desercion")}
              >
                <div className="flex items-center">
                  Riesgo
                  {sortConfig.key === "riesgo_desercion" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("requiere_tutoria")}
              >
                <div className="flex items-center">
                  Tutoría
                  {sortConfig.key === "requiere_tutoria" && (
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
                className="px-4 py-3 text-left cursor-pointer hover:bg-institucional-verde2 transition-colors"
                onClick={() => requestSort("servicio")}
              >
                <div className="flex items-center">
                  Servicio
                  {sortConfig.key === "servicio" && (
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
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
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
                  <td className="px-4 py-3">{row.periodo}</td>
                  <td className="px-4 py-3">{row.inscritos}</td>
                  <td className="px-4 py-3">{row.matriculados}</td>
                  <td className="px-4 py-3">{row.desertores}</td>
                  <td className="px-4 py-3">{row.estrato}</td>
                  <td className="px-4 py-3">
                    {row.riesgo_desercion ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.riesgo_desercion === "Alto"
                            ? "bg-red-100 text-red-800"
                            : row.riesgo_desercion === "Medio"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {row.riesgo_desercion}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.requiere_tutoria === true || row.requiere_tutoria === "True" ? (
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Sí</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{row.servicio || "N/A"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros criterios de búsqueda</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + rowsPerPage, filteredData.length)} de{" "}
            {filteredData.length} registros
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 transition-colors hover:bg-gray-100"
            >
              Anterior
            </motion.button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Mostrar 5 páginas centradas en la página actual
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded transition-colors ${
                    currentPage === pageNum
                      ? "bg-institucional-verde1 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </motion.button>
              )
            })}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 transition-colors hover:bg-gray-100"
            >
              Siguiente
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
