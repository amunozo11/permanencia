import { useState } from 'react'
import { API } from '../services/api'

export default function IntervencionPage() {
  const [acta, setActa] = useState({})
  const [remision, setRemision] = useState({})
  const [csvFile, setCsvFile] = useState(null)

  const handleChange = (setFn) => (e) =>
    setFn(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmitActa = async (e) => {
    e.preventDefault()
    await API.post('/actas-negacion', acta)
    alert('Acta guardada!')
  }

  const handleSubmitRemision = async (e) => {
    e.preventDefault()
    await API.post('/remisiones-psicologicas', remision)
    alert('Remisión guardada!')
  }

  const handleCsvUpload = async () => {
    if (!csvFile) return alert('Selecciona CSV primero')
    const form = new FormData()
    form.append('file', csvFile)
    const { inserted } = await API.post('/upload-csv', form, true)
    alert(`Insertados ${inserted} registros desde CSV`)
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Acta de Negación */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl mb-4">Acta de Negación</h2>
        <form onSubmit={handleSubmitActa} className="space-y-2">
          {[
            'nombre_estudiante','documento_tipo','documento_numero',
            'documento_expedido_en','programa','semestre',
            'fecha_firma_dia','fecha_firma_mes','fecha_firma_anio',
            'firma_estudiante','documento_firma_estudiante','docente_permanencia'
          ].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g,' ')}
              onChange={handleChange(setActa)}
              className="w-full border p-2 rounded"
              required
            />
          ))}
          <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
            Guardar Acta
          </button>
        </form>
      </div>

      {/* Remisión Psicológica */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl mb-4">Remisión Psicológica</h2>
        <form onSubmit={handleSubmitRemision} className="space-y-2">
          {[
            'nombre_estudiante','numero_documento','programa_academico','semestre',
            'motivo_remision','docente_remite','correo_docente','telefono_docente',
            'fecha','hora','tipo_remision'
          ].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g,' ')}
              onChange={handleChange(setRemision)}
              className="w-full border p-2 rounded"
              required
            />
          ))}
          <textarea
            name="observaciones"
            placeholder="observaciones"
            onChange={handleChange(setRemision)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">
            Guardar Remisión
          </button>
        </form>

        {/* CSV Upload */}
        <div className="mt-6">
          <h3 className="text-lg">Importar CSV</h3>
          <input
            type="file"
            accept=".csv"
            onChange={e => setCsvFile(e.target.files[0])}
            className="my-2"
          />
          <button
            onClick={handleCsvUpload}
            className="p-2 bg-gray-700 text-white rounded"
          >
            Subir y Procesar CSV
          </button>
        </div>
      </div>
    </div>
  )
}
