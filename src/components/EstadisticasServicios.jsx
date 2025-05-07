"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#007E5B", "#57A641", "#F2CC0C", "#00B388", "#7BDCB5", "#CDEAE1"]

export default function EstadisticasServicios({ data }) {
  const [visualizacion, setVisualizacion] = useState("barras")

  // Procesar datos para estadísticas
  const serviciosCount = {}

  data.forEach((item) => {
    if (item.servicio) {
      if (!serviciosCount[item.servicio]) {
        serviciosCount[item.servicio] = {
          nombre: item.servicio,
          total: 0,
          porRiesgo: {
            Alto: 0,
            Medio: 0,
            Bajo: 0,
          },
        }
      }

      serviciosCount[item.servicio].total += 1

      if (item.riesgo_desercion) {
        serviciosCount[item.servicio].porRiesgo[item.riesgo_desercion] += 1
      }
    }
  })

  const serviciosData = Object.values(serviciosCount)

  // Datos para gráfico de barras
  const barData = serviciosData.map((servicio) => ({
    nombre: servicio.nombre,
    total: servicio.total,
    Alto: servicio.porRiesgo.Alto,
    Medio: servicio.porRiesgo.Medio,
    Bajo: servicio.porRiesgo.Bajo,
  }))

  // Datos para gráfico de pastel
  const pieData = serviciosData.map((servicio) => ({
    name: servicio.nombre,
    value: servicio.total,
  }))

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-xl font-semibold text-institucional-verde1 mb-2 md:mb-0">
          Estadísticas de Servicios de Permanencia
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setVisualizacion("barras")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              visualizacion === "barras"
                ? "bg-institucional-verde1 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Barras
          </button>
          <button
            onClick={() => setVisualizacion("pastel")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              visualizacion === "pastel"
                ? "bg-institucional-verde1 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pastel
          </button>
        </div>
      </div>

      <div className="h-[400px]">
        {visualizacion === "barras" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Alto" stackId="a" fill="#D32F2F" name="Riesgo Alto" />
              <Bar dataKey="Medio" stackId="a" fill="#F2CC0C" name="Riesgo Medio" />
              <Bar dataKey="Bajo" stackId="a" fill="#57A641" name="Riesgo Bajo" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} estudiantes`, "Cantidad"]} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6">
        <h4 className="text-lg font-medium text-institucional-verde2 mb-3">Resumen de Servicios</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-institucional-verde1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Servicio</th>
                <th className="px-4 py-2 text-left">Total Estudiantes</th>
                <th className="px-4 py-2 text-left">Riesgo Alto</th>
                <th className="px-4 py-2 text-left">Riesgo Medio</th>
                <th className="px-4 py-2 text-left">Riesgo Bajo</th>
              </tr>
            </thead>
            <tbody>
              {serviciosData.map((servicio, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-institucional-verde3/10"}>
                  <td className="px-4 py-2 font-medium">{servicio.nombre}</td>
                  <td className="px-4 py-2">{servicio.total}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                      {servicio.porRiesgo.Alto}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                      {servicio.porRiesgo.Medio}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      {servicio.porRiesgo.Bajo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
