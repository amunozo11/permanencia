import { useState } from 'react'
import { API } from '../services/api'

export default function IntervencionGrupalPage() {
  const [data, setData] = useState({})
  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = async (e) => { e.preventDefault(); await API.post('/intervenciones-grupales', data); alert('Guardado') }

  const fields = [
    'fecha_solicitud','nombre_docente_permanencia','celular_permanencia','correo_permanencia','programa_permanencia',
    'tipo_poblacion','nombre_docente_asignatura','celular_docente_asignatura','correo_docente_asignatura',
    'programa_docente_asignatura','asignatura_intervenir','grupo','semestre','numero_estudiantes',
    'fecha_programada','hora','aula','bloque','sede','estado'
  ]

  return (
    <div className="p-4 max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl mb-4">Intervención Grupal</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {fields.map(f => (
          <input key={f} name={f} placeholder={f.replace(/_/g,' ')} onChange={handleChange} className="w-full border p-2 rounded" required />
        ))}
        <textarea name="tematica_sugerida" placeholder="tematica_sugerida" onChange={handleChange} className="w-full border p-2 rounded" />
        <textarea name="motivo" placeholder="motivo" onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Guardar</button>
      </form>
    </div>
  )
}