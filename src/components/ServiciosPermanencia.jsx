export default function ServiciosPermanencia() {
    const servicios = [
      {
        nombre: "Tutorías Académicas",
        descripcion: "Apoyo académico personalizado para estudiantes con dificultades en asignaturas específicas.",
        icono: "📚",
      },
      {
        nombre: "Asesoría Psicológica",
        descripcion: "Atención psicológica para estudiantes que enfrentan problemas personales o de adaptación.",
        icono: "🧠",
      },
      {
        nombre: "Apoyo Socioeconómico",
        descripcion: "Programas de becas, subsidios y ayudas económicas para estudiantes de bajos recursos.",
        icono: "💰",
      },
      {
        nombre: "Orientación Vocacional",
        descripcion: "Asesoría para estudiantes que tienen dudas sobre su elección de carrera o futuro profesional.",
        icono: "🧭",
      },
      {
        nombre: "Talleres de Habilidades",
        descripcion: "Formación en habilidades de estudio, gestión del tiempo y preparación para exámenes.",
        icono: "⏱️",
      },
      {
        nombre: "Seguimiento Académico",
        descripcion: "Monitoreo del rendimiento académico para identificar estudiantes en riesgo de deserción.",
        icono: "📊",
      },
    ]
  
    return (
      <div className="bg-white rounded-xl p-6 shadow-md mt-8">
        <h3 className="text-2xl font-semibold mb-6 text-institucional-verde1">Servicios de Permanencia Estudiantil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-2">{servicio.icono}</div>
              <h4 className="text-lg font-medium text-institucional-verde2 mb-2">{servicio.nombre}</h4>
              <p className="text-gray-600">{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  