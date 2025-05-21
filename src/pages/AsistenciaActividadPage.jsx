import { useState } from 'react'
import { API } from '../services/api'

export default function AsistenciaActividadPage() {
  const [data, setData] = useState({})

  const handleChange = e => setData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await API.post('/asistencias-actividades', data)
      alert('Guardada correctamente')
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    }
  }

  const fields = [
    'nombre_estudiante',
    'numero_documento',
    'programa_academico',
    'semestre',
    'nombre_actividad',
    'modalidad',
    'tipo_actividad',
    'fecha_actividad',
    'hora_inicio',
    'hora_fin',
    'modalidad_registro'
  ]

  return (
    <div className="p-4 max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl mb-4">Asistencia a Actividad Psicológica</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {fields.map(f => (
          <input
            key={f}
            name={f}
            placeholder={f.replace(/_/g, ' ')}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        ))}
        <textarea
          name="observaciones"
          placeholder="observaciones"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
          Guardar
        </button>
      </form>
    </div>
  )
}