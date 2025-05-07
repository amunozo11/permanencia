// Función para procesar los datos del CSV según el esquema
export const processCSVData = (csvData) => {
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
    return []
  }

  // Procesar cada fila del CSV
  return csvData.map((row) => {
    // Convertir campos numéricos
    const semestre = Number.parseInt(row.semestre || 0)
    const estrato = Number.parseInt(row.estrato || 0)

    // Normalizar valores booleanos
    const requiereTutoria = row.requiere_tutoria === "True" || row.requiere_tutoria === true
    const aprobado = row.aprobado === "True" || row.aprobado === true
    const cumplimientoRequisitos =
      row["cumplimiento de requisitos"] === "True" || row["cumplimiento de requisitos"] === true

    // Retornar objeto normalizado
    return {
      programa: row.programa || "",
      semestre: semestre,
      periodo: row.periodo || `20${Math.floor(semestre / 2) + 20}-${(semestre % 2) + 1}`, // Generar periodo si no existe
      estrato: estrato,
      riesgo_desercion: row.riesgo_desercion || "",
      tipo_vulnerabilidad: row.tipo_vulnerabilidad || "",
      requiere_tutoria: requiereTutoria,
      tipo_intervencion: row.tipo_intervencion || "",
      condicion_socioeconomica: row.condicion_socioeconomica || "",
      aprobado: aprobado,
      cumplimiento_requisitos: cumplimientoRequisitos,
      servicio: row.servicio || "",
    }
  })
}

// Función para generar datos iniciales (todos en cero)
export const generateEmptyData = () => {
  return []
}

// Función para calcular totales
export const calculateTotals = (data) => {
  const totals = {
    inscritos: data.length,
    matriculados: data.filter((item) => item.aprobado).length,
    desertores: data.filter((item) => item.riesgo_desercion === "Alto").length,
    graduados: data.filter((item) => item.cumplimiento_requisitos).length,
  }

  return totals
}

// Función para agrupar datos por programa
export const groupByPrograma = (data) => {
  const grouped = {}

  data.forEach((item) => {
    const prog = item.programa
    if (!grouped[prog]) {
      grouped[prog] = {
        programa: prog,
        total: 0,
        riesgoAlto: 0,
        riesgoMedio: 0,
        riesgoBajo: 0,
      }
    }

    grouped[prog].total += 1

    if (item.riesgo_desercion === "Alto") {
      grouped[prog].riesgoAlto += 1
    } else if (item.riesgo_desercion === "Medio") {
      grouped[prog].riesgoMedio += 1
    } else if (item.riesgo_desercion === "Bajo") {
      grouped[prog].riesgoBajo += 1
    }
  })

  return Object.values(grouped)
}

// Otras funciones de procesamiento de datos
export const getRiesgoDesercionData = (data) => {
  const riesgos = {}

  data.forEach((item) => {
    if (item.riesgo_desercion) {
      if (!riesgos[item.riesgo_desercion]) {
        riesgos[item.riesgo_desercion] = 0
      }
      riesgos[item.riesgo_desercion] += 1
    }
  })

  return Object.entries(riesgos).map(([riesgo, cantidad]) => ({
    riesgo,
    cantidad,
  }))
}

export const getTipoVulnerabilidadData = (data) => {
  const vulnerabilidades = {}

  data.forEach((item) => {
    if (item.tipo_vulnerabilidad) {
      if (!vulnerabilidades[item.tipo_vulnerabilidad]) {
        vulnerabilidades[item.tipo_vulnerabilidad] = 0
      }
      vulnerabilidades[item.tipo_vulnerabilidad] += 1
    }
  })

  return Object.entries(vulnerabilidades).map(([tipo, cantidad]) => ({
    tipo,
    cantidad,
  }))
}

export const getRequiereTutoriaData = (data) => {
  let requiere = 0
  let noRequiere = 0

  data.forEach((item) => {
    if (item.requiere_tutoria === true || item.requiere_tutoria === "True") {
      requiere += 1
    } else if (item.requiere_tutoria === false || item.requiere_tutoria === "False") {
      noRequiere += 1
    }
  })

  return [
    { name: "Requiere tutoría", value: requiere },
    { name: "No requiere tutoría", value: noRequiere },
  ]
}

export const getServiciosData = (data) => {
  const servicios = {}

  data.forEach((item) => {
    if (item.servicio) {
      if (!servicios[item.servicio]) {
        servicios[item.servicio] = 0
      }
      servicios[item.servicio] += 1
    }
  })

  return Object.entries(servicios).map(([servicio, cantidad]) => ({
    servicio,
    cantidad,
  }))
}

export const getEdadDesertores = (data) => {
  // Agrupar por estrato y contar estudiantes con riesgo alto
  const estratoRiesgo = {}

  data.forEach((item) => {
    if (item.estrato && item.riesgo_desercion === "Alto") {
      const estrato = item.estrato.toString()
      if (!estratoRiesgo[estrato]) {
        estratoRiesgo[estrato] = 0
      }
      estratoRiesgo[estrato] += 1
    }
  })

  return Object.entries(estratoRiesgo).map(([estrato, cantidad]) => ({
    estrato: Number(estrato),
    desertores: cantidad,
  }))
}

export const getEstratoInscritos = (data) => {
  // Agrupar por estrato y contar estudiantes
  const estratoCount = {}

  data.forEach((item) => {
    if (item.estrato) {
      const estrato = item.estrato.toString()
      if (!estratoCount[estrato]) {
        estratoCount[estrato] = 0
      }
      estratoCount[estrato] += 1
    }
  })

  return Object.entries(estratoCount).map(([estrato, cantidad]) => ({
    estrato: Number(estrato),
    inscritos: cantidad,
  }))
}

export const getCondicionSocioeconomicaData = (data) => {
  const condiciones = {}

  data.forEach((item) => {
    if (item.condicion_socioeconomica) {
      if (!condiciones[item.condicion_socioeconomica]) {
        condiciones[item.condicion_socioeconomica] = 0
      }
      condiciones[item.condicion_socioeconomica] += 1
    }
  })

  return Object.entries(condiciones).map(([condicion, cantidad]) => ({
    condicion,
    cantidad,
  }))
}
