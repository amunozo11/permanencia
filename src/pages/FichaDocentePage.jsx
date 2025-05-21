import { useState } from 'react'
import { API } from '../services/api'

export default function FichaDocentePage() {
  const [data, setData] = useState({})
  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = async (e) => { e.preventDefault(); await API.post('/fichas-docente', data); alert('Guardada') }

  const fields = [
    'nombres_apellidos','documento_identidad','fecha_nacimiento_dia','fecha_nacimiento_mes','fecha_nacimiento_ano',
    'direccion_residencia','celular','correo_institucional','correo_personal','preferencia_correo','facultad','programa',
    'asignaturas','creditos_asignaturas','ciclo_formacion','pregrado','especializacion','maestria','doctorado',
    'grupo_investigacion','cual_grupo','horas_semanales'
  ]

  return (
    <div className="p-4 max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl mb-4">Ficha Técnica Docente</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        {fields.map(f => (
          <input key={f} name={f} placeholder={f.replace(/_/g,' ')} onChange={handleChange} className="w-full border p-2 rounded" required />
        ))}
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Guardar</button>
      </form>
    </div>
  )
}