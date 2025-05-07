import defaultData from "../models/data"

// Variable para almacenar los datos actuales
let currentData = defaultData

// Función para actualizar los datos
export const updateData = (newData) => {
  currentData = newData
}

// Funciones para obtener datos
export const getAllData = () => currentData

export const getTotals = () => {
  const totals = {
    inscritos: 0,
    matriculados: 0,
    desertores: 0,
    graduados: 0,
  }

  currentData.forEach((item) => {
    totals.inscritos += item.inscritos || 0
    totals.matriculados += item.matriculados || 0
    totals.desertores += item.desertores || 0
    totals.graduados += item.graduados || 0
  })

  return totals
}

export const getInscritosDesertoresPorPrograma = () => {
  const grouped = {}

  currentData.forEach((item) => {
    const prog = item.programa
    if (!grouped[prog]) {
      grouped[prog] = { programa: prog, inscritos: 0, desertores: 0 }
    }

    grouped[prog].inscritos += item.inscritos || 0
    grouped[prog].desertores += item.desertores || 0
  })

  return Object.values(grouped)
}

export const getPieDataInscritos = () => {
  const grouped = {}

  currentData.forEach((item) => {
    const prog = item.programa
    if (!grouped[prog]) {
      grouped[prog] = { programa: prog, inscritos: 0 }
    }

    grouped[prog].inscritos += item.inscritos || 0
  })

  return Object.values(grouped)
}

export const getEdadDesertores = () => {
  return currentData
    .filter((item) => item.edad_promedio && item.desertores)
    .map((item) => ({
      edad_promedio: item.edad_promedio,
      desertores: item.desertores,
      programa: item.programa,
    }))
}

export const getEstratoInscritos = () => {
  return currentData
    .filter((item) => item.estrato && item.inscritos)
    .map((item) => ({
      estrato: item.estrato,
      inscritos: item.inscritos,
      programa: item.programa,
    }))
}

// Nuevas funciones para analizar datos de permanencia

export const getRiesgoDesercionData = () => {
  const riesgos = {}

  currentData.forEach((item) => {
    if (item.riesgo_desercion) {
      if (!riesgos[item.riesgo_desercion]) {
        riesgos[item.riesgo_desercion] = 0
      }
      riesgos[item.riesgo_desercion] += item.desertores || 1
    }
  })

  return Object.entries(riesgos).map(([riesgo, cantidad]) => ({
    riesgo,
    cantidad,
  }))
}

export const getTipoVulnerabilidadData = () => {
  const vulnerabilidades = {}

  currentData.forEach((item) => {
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

export const getRequiereTutoriaData = () => {
  let requiere = 0
  let noRequiere = 0

  currentData.forEach((item) => {
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

export const getServiciosData = () => {
  const servicios = {}

  currentData.forEach((item) => {
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
