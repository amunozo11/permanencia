import { useState } from 'react';

const ActaNegacion = () => {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    documento_tipo: "",
    documento_numero: "",
    documento_expedido_en: "",
    programa: "",
    semestre: "",
    fecha_firma_dia: "",
    fecha_firma_mes: "",
    fecha_firma_anio: "",
    firma_estudiante: "",
    documento_firma_estudiante: "",
    docente_permanencia: ""
  });

  const [errorInput, setErrorInput] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (!formData.nombre_estudiante.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre_estudiante)) {
      setErrorInput("nombre_estudiante");
      return "Nombre del estudiante es obligatorio y solo debe contener letras.";
    }
    if (!formData.documento_tipo) {
      setErrorInput("documento_tipo");
      return "Debe seleccionar el tipo de documento.";
    }
    if (!/^\d{7,10}$/.test(formData.documento_numero)) {
      setErrorInput("documento_numero");
      return "Número de documento debe tener entre 7 y 10 dígitos.";
    }
    if (!formData.documento_expedido_en.trim()) {
      setErrorInput("documento_expedido_en");
      return "Debe indicar el lugar de expedición del documento.";
    }
    if (!formData.programa.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.programa)) {
      setErrorInput("programa");
      return "Programa Académico obligatorio y solo debe contener letras.";
    }
    if (!formData.semestre.trim()) {
      setErrorInput("semestre");
      return "Debe ingresar el semestre actual.";
    }
    if (!formData.fecha_firma_dia || !formData.fecha_firma_mes || !formData.fecha_firma_anio) {
      setErrorInput("fecha_firma_dia");
      return "Debe completar la fecha de la firma de la constancia.";
    }
    if (formData.firma_estudiante !== formData.nombre_estudiante) {
      setErrorInput("firma_estudiante");
      return "La firma del estudiante debe coincidir con el nombre del estudiante.";
    }
    if (formData.documento_firma_estudiante !== formData.documento_numero) {
      setErrorInput("documento_firma_estudiante");
      return "El número de documento en la firma debe coincidir con el número del documento principal.";
    }
    if (!formData.docente_permanencia.trim()) {
      setErrorInput("docente_permanencia");
      return "Debe ingresar el nombre del docente de permanencia.";
    }
    setErrorInput('');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      setMensaje(error);
      return;
    }

    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/PostFormularioAsistencia.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      if (res.ok) {
        setMensaje("✅ Formulario enviado exitosamente.");
        setFormData({
          nombre_estudiante: "",
          documento_tipo: "",
          documento_numero: "",
          documento_expedido_en: "",
          programa: "",
          semestre: "",
          fecha_firma_dia: "",
          fecha_firma_mes: "",
          fecha_firma_anio: "",
          firma_estudiante: "",
          documento_firma_estudiante: "",
          docente_permanencia: ""
        });
      } else {
        setMensaje("❌ Error al enviar el formulario.");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión.");
      console.error(error);
    }
  };

  // Para aplicar clase error si coincide con errorInput
  const getInputClass = (name) => (name === errorInput ? "input error" : "input");

  return (
    <>
      <style>{`
        .form-container {
          max-width: 750px;
          margin: auto;
          padding: 2rem;
          background-color: #f0fdf4;
          border: 2px solid #4CAF50;
          border-radius: 16px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
          position: relative;
        }
        .logo-upc {
          width: 120px;
          display: block;
          margin: 0 auto 1rem auto;
        }
        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #2e7d32;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #388E3C;
        }
        input, select {
          padding: 0.6rem;
          border: 1px solid #c8e6c9;
          border-radius: 6px;
          font-size: 1rem;
        }
        input.error, select.error {
          border-color: #e74c3c;
          background-color: #fff0f0;
        }
        .submit-button {
          padding: 0.8rem;
          background-color: #388E3C;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .submit-button:hover {
          background-color: #2e7d32;
        }
        .message {
          margin-top: 1rem;
          font-weight: bold;
          text-align: center;
          color: #33691e;
        }
      `}</style>

      <form className="form-container" onSubmit={handleSubmit} noValidate>
        {/* Logo UPC - reemplaza src con tu logo */}
        <img
          className="logo-upc"
          src="/logo-upc.png"
           alt="Logo UPC"
          />


        <h2>Acta de Negación de Acompañamiento Psicosocial</h2>

        <div className="form-grid">
          {[
            { name: "nombre_estudiante", label: "Nombre del Estudiante", type: "text" },
            { name: "documento_tipo", label: "Tipo de Documento", type: "select", options: ["", "CC", "TI"] },
            { name: "documento_numero", label: "Número de Documento", type: "text" },
            { name: "documento_expedido_en", label: "Lugar de Expedición", type: "text" },
            { name: "programa", label: "Programa Académico", type: "text" },
            { name: "semestre", label: "Semestre", type: "text" },
            { name: "fecha_firma_dia", label: "Día de la Firma de la Constancia", type: "text" },
            { name: "fecha_firma_mes", label: "Mes de la Firma de la Constancia", type: "text" },
            { name: "fecha_firma_anio", label: "Año de la Firma de la Constancia", type: "text" },
            { name: "firma_estudiante", label: "Firma del Estudiante", type: "text" },
            { name: "documento_firma_estudiante", label: "Documento (Firma Estudiante)", type: "text" },
            { name: "docente_permanencia", label: "Nombre Docente Permanencia", type: "text" },
          ].map(({ name, label, type, options }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={name === errorInput ? "error" : ""}
                >
                  {options.map(opt => (
                    <option key={opt} value={opt}>
                      {opt === "" ? "Seleccionar" : opt === "CC" ? "Cédula de Ciudadanía" : opt === "TI" ? "Tarjeta de Identidad" : opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={formData[name]}
                  onChange={handleChange}
                  className={getInputClass(name)}
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">Enviar</button>
        {mensaje && <p className="message">{mensaje}</p>}
      </form>
    </>
  );
};

export default ActaNegacion;
const ActaNegacion = () => {
  const [formData, setFormData] = useState({
    nombre_estudiante: "",
    documento_tipo: "",
    documento_numero: "",
    documento_expedido_en: "",
    programa: "",
    semestre: "",
    fecha_firma_dia: "",
    fecha_firma_mes: "",
    fecha_firma_anio: "",
    firma_estudiante: "",
    documento_firma_estudiante: "",
    docente_permanencia: ""
  });

  const [errorInput, setErrorInput] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (!formData.nombre_estudiante.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre_estudiante)) {
      setErrorInput("nombre_estudiante");
      return "Nombre del estudiante es obligatorio y solo debe contener letras.";
    }
    if (!formData.documento_tipo) {
      setErrorInput("documento_tipo");
      return "Debe seleccionar el tipo de documento.";
    }
    if (!/^\d{7,10}$/.test(formData.documento_numero)) {
      setErrorInput("documento_numero");
      return "Número de documento debe tener entre 7 y 10 dígitos.";
    }
    if (!formData.documento_expedido_en.trim()) {
      setErrorInput("documento_expedido_en");
      return "Debe indicar el lugar de expedición del documento.";
    }
    if (!formData.programa.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.programa)) {
      setErrorInput("programa");
      return "Programa Académico obligatorio y solo debe contener letras.";
    }
    if (!formData.semestre.trim()) {
      setErrorInput("semestre");
      return "Debe ingresar el semestre actual.";
    }
    if (!formData.fecha_firma_dia || !formData.fecha_firma_mes || !formData.fecha_firma_anio) {
      setErrorInput("fecha_firma_dia");
      return "Debe completar la fecha de la firma de la constancia.";
    }
    if (formData.firma_estudiante !== formData.nombre_estudiante) {
      setErrorInput("firma_estudiante");
      return "La firma del estudiante debe coincidir con el nombre del estudiante.";
    }
    if (formData.documento_firma_estudiante !== formData.documento_numero) {
      setErrorInput("documento_firma_estudiante");
      return "El número de documento en la firma debe coincidir con el número del documento principal.";
    }
    if (!formData.docente_permanencia.trim()) {
      setErrorInput("docente_permanencia");
      return "Debe ingresar el nombre del docente de permanencia.";
    }
    setErrorInput('');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      setMensaje(error);
      return;
    }

    try {
      const res = await fetch("https://permanencia.infinityfreeapp.com/PostFormularioAsistencia.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      if (res.ok) {
        setMensaje("✅ Formulario enviado exitosamente.");
        setFormData({
          nombre_estudiante: "",
          documento_tipo: "",
          documento_numero: "",
          documento_expedido_en: "",
          programa: "",
          semestre: "",
          fecha_firma_dia: "",
          fecha_firma_mes: "",
          fecha_firma_anio: "",
          firma_estudiante: "",
          documento_firma_estudiante: "",
          docente_permanencia: ""
        });
      } else {
        setMensaje("❌ Error al enviar el formulario.");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión.");
      console.error(error);
    }
  };

  // Para aplicar clase error si coincide con errorInput
  const getInputClass = (name) => (name === errorInput ? "input error" : "input");

  return (
    <>
      <style>{`
        .form-container {
          max-width: 750px;
          margin: auto;
          padding: 2rem;
          background-color: #f0fdf4;
          border: 2px solid #4CAF50;
          border-radius: 16px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
          position: relative;
        }
        .logo-upc {
          width: 120px;
          display: block;
          margin: 0 auto 1rem auto;
        }
        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #2e7d32;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #388E3C;
        }
        input, select {
          padding: 0.6rem;
          border: 1px solid #c8e6c9;
          border-radius: 6px;
          font-size: 1rem;
        }
        input.error, select.error {
          border-color: #e74c3c;
          background-color: #fff0f0;
        }
        .submit-button {
          padding: 0.8rem;
          background-color: #388E3C;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .submit-button:hover {
          background-color: #2e7d32;
        }
        .message {
          margin-top: 1rem;
          font-weight: bold;
          text-align: center;
          color: #33691e;
        }
      `}</style>

      <form className="form-container" onSubmit={handleSubmit} noValidate>
        {/* Logo UPC - reemplaza src con tu logo */}
        <img
          className="logo-upc"
          src="/logo-upc.png"
           alt="Logo UPC"
          />


        <h2>Acta de Negación de Acompañamiento Psicosocial</h2>

        <div className="form-grid">
          {[
            { name: "nombre_estudiante", label: "Nombre del Estudiante", type: "text" },
            { name: "documento_tipo", label: "Tipo de Documento", type: "select", options: ["", "CC", "TI"] },
            { name: "documento_numero", label: "Número de Documento", type: "text" },
            { name: "documento_expedido_en", label: "Lugar de Expedición", type: "text" },
            { name: "programa", label: "Programa Académico", type: "text" },
            { name: "semestre", label: "Semestre", type: "text" },
            { name: "fecha_firma_dia", label: "Día de la Firma de la Constancia", type: "text" },
            { name: "fecha_firma_mes", label: "Mes de la Firma de la Constancia", type: "text" },
            { name: "fecha_firma_anio", label: "Año de la Firma de la Constancia", type: "text" },
            { name: "firma_estudiante", label: "Firma del Estudiante", type: "text" },
            { name: "documento_firma_estudiante", label: "Documento (Firma Estudiante)", type: "text" },
            { name: "docente_permanencia", label: "Nombre Docente Permanencia", type: "text" },
          ].map(({ name, label, type, options }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={name === errorInput ? "error" : ""}
                >
                  {options.map(opt => (
                    <option key={opt} value={opt}>
                      {opt === "" ? "Seleccionar" : opt === "CC" ? "Cédula de Ciudadanía" : opt === "TI" ? "Tarjeta de Identidad" : opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={formData[name]}
                  onChange={handleChange}
                  className={getInputClass(name)}
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">Enviar</button>
        {mensaje && <p className="message">{mensaje}</p>}
      </form>
    </>
  );
};

export default ActaNegacion;