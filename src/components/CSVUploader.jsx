"use client"

import { useState, useRef } from "react"
import Papa from "papaparse"
import { motion } from "framer-motion"
import { saveData } from "../services/storageService"
import { processCSVData } from "../services/dataProcessingService"

export default function CSVUploader({ onDataLoaded }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileUpload = (file) => {
    if (!file) return

    // Verificar que sea un archivo CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Por favor, sube un archivo CSV válido.")
      return
    }

    setFileName(file.name)
    setError("")
    setIsLoading(true)
    setUploadProgress(0)

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 10
      })
    }, 200)

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        // Procesar los datos
        const processedData = processCSVData(results.data.filter((row) => Object.keys(row).length > 1))

        // Guardar en localStorage
        saveData(processedData)

        // Notificar al componente padre
        onDataLoaded(processedData)

        setTimeout(() => {
          setIsLoading(false)
          setUploadProgress(0)
        }, 500)
      },
      error: (error) => {
        clearInterval(progressInterval)
        console.error("Error al procesar el CSV:", error)
        setError("Error al procesar el archivo. Verifica que sea un CSV válido.")
        setIsLoading(false)
        setUploadProgress(0)
      },
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileUpload(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileUpload(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-institucional-verde3/20"
    >
      <h3 className="text-xl font-semibold text-institucional-verde1 mb-4 flex items-center">
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
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        Cargar Datos de Permanencia
      </h3>

      <div
        className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? "border-institucional-verde1 bg-institucional-verde1/10"
            : "border-gray-300 hover:border-institucional-verde2 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-12 w-12 mb-4 transition-colors ${isDragging ? "text-institucional-verde1" : "text-gray-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Haz clic para seleccionar</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500">CSV (hasta 10MB)</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleButtonClick}
            className="mt-4 px-4 py-2 bg-institucional-verde1 text-white rounded-lg hover:bg-institucional-verde2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : "Seleccionar archivo CSV"}
          </motion.button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-institucional-verde1">Procesando archivo...</span>
            <span className="text-sm font-medium text-institucional-verde1">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-institucional-verde1 h-2.5 rounded-full"
            ></motion.div>
          </div>
        </div>
      )}

      {fileName && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center p-3 bg-green-50 text-green-800 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Archivo cargado:</span>
          <span className="ml-2 truncate">{fileName}</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center p-3 bg-red-50 text-red-800 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
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
          Información importante
        </h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
          <li>El archivo CSV debe contener las columnas: programa, semestre, riesgo_desercion, etc.</li>
          <li>Los datos se guardarán automáticamente en su navegador.</li>
          <li>Puede cargar un nuevo archivo en cualquier momento para actualizar los datos.</li>
        </ul>
      </div>
    </motion.div>
  )
}
