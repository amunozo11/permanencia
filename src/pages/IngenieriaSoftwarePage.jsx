import { useState } from 'react'
import { API } from '../services/api'

export default function IngenieriaSoftwarePage() {
  const [solicitud, setSolicitud] = useState({})
  const [estudiante, setEstudiante] = useState({})

  const handleChange = (setFn) => (e) =>
    setFn(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const submitSolicitud = async (e) => {
    e.preventDefault()
    await API.post('/software-solicitudes', solicitud)
    alert('Solicitud creada')
  }

  const submitEstudiante = async (e) => {
    e.preventDefault()
    await API.post('/software-estudiantes', estudiante)
    alert('Estudiante asignado')
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Crear Solicitud */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl mb-4">Crear Solicitud SW</h2>
        <form onSubmit={submitSolicitud} className="space-y-2">
          {['docente_tutor','facultad','programa','nombre_asignatura'].map(f => (
            <input key={f} name={f} placeholder={f.replace(/_/g,' ')} onChange={handleChange(setSolicitud)} className="w-full border p-2 rounded" required />
          ))}
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Crear</button>
        </form>
      </div>
      {/* Asignar Estudiante */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl mb-4">Asignar Estudiante</h2>
        <form onSubmit={submitEstudiante} className="space-y-2">
          {['solicitud_id','numero_identificacion','nombre_estudiante','correo','telefono','semestre'].map(f => (
            <input key={f} name={f} placeholder={f.replace(/_/g,' ')} onChange={handleChange(setEstudiante)} className="w-full border p-2 rounded" required />
          ))}
          <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">Asignar</button>
        </form>
      </div>
    </div>
  )
}
