// Claves para el almacenamiento local
const STORAGE_KEYS = {
    PERMANENCIA_DATA: "permanencia_data",
    LAST_UPDATE: "permanencia_last_update",
    API_INSERT: "https://temporal.codersdevs.com.co/leer_datos.php",
    API_READ: "https://temporal.codersdevs.com.co/insertar_datos.php",
  }
  
  // Guardar datos en localStorage
  export const saveData = (data) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERMANENCIA_DATA, JSON.stringify(data))
      localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, new Date().toISOString())
      return true
    } catch (error) {
      console.error("Error al guardar datos:", error)
      return false
    }
  }
  
  // Obtener datos de localStorage
  export const getData = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERMANENCIA_DATA)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error al obtener datos:", error)
      return null
    }
  }
  
  // Obtener la fecha de la última actualización
  export const getLastUpdate = () => {
    try {
      const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE)
      return lastUpdate ? new Date(lastUpdate) : null
    } catch (error) {
      console.error("Error al obtener fecha de actualización:", error)
      return null
    }
  }
  
  // Limpiar datos almacenados
  export const clearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PERMANENCIA_DATA)
      localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE)
      return true
    } catch (error) {
      console.error("Error al limpiar datos:", error)
      return false
    }
  }
  