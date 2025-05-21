import { useState } from 'react';
import './ActaNegacionForm.css';

const ActaNegacionForm = () => {
  const [formData, setFormData] = useState({
    nombre_estudiante: '',
    documento_tipo: '',
    documento_numero: '',
    documento_expedido_en: '',
    programa: '',
    semestre: '',
    fecha_firma_dia: '',
    fecha_firma_mes: '',
    fecha_firma_anio: '',
    firma_estudiante: '',
    documento_firma_estudiante: '',
    docente_permanencia: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [errorInput, setErrorInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validar = () => {
    const campos = Object.entries(formData);
    for (let [campo, valor] of campos) {
      if (!valor.trim()) {
        setErrorInput(campo);
        return `El campo "${campo.replaceAll('_', ' ')}" es obligatorio.`;
      }
    }
    if (formData.documento_tipo !== 'C.C.' && formData.documento_tipo !== 'T.I.') {
      setErrorInput('documento_tipo');
      return 'El tipo de documento debe ser "C.C." o "T.I."';
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
      const response = await fetch('https://api-formulario.infinityfreeapp.com/acta_negacion.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      setMensaje('✅ Formulario enviado exitosamente');
    } catch (err) {
      setMensaje('❌ Error al enviar el formulario');
    }
  };

  return (
    <div className="form-container">
      <h2>
        <img src="/logo-upc.png" alt="Logo Universidad Popular del Cesar" className="logo-upc" />
  📝 Acta de Negación de Acompañamiento Psicosocial
      </h2>
      <form onSubmit={handleSubmit} className="form-grid">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              className={errorInput === key ? 'error' : ''}
              value={value}
              onChange={handleChange}
              placeholder={`Ingrese ${key.replaceAll('_', ' ')}`}
            />
          </div>
        ))}
        <button type="submit" className="submit-button">Enviar</button>
        {mensaje && <p className="message">{mensaje}</p>}
      </form>
    </div>
  );
};

export default ActaNegacionForm;
