import { useState } from 'react';

const SolicitudIngenieriaSoftware = () => {
  const [formData, setFormData] = useState({
    docente_tutor: "",
    facultad: "",
    programa: "",
    nombre_asignatura: ""
  });

  const [errorInput, setErrorInput] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const filteredValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));
  };

  const validar = () => {
    if (!formData.docente_tutor.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.docente_tutor)) {
      setErrorInput("docente_tutor");
      return "Nombre del docente tutor es obligatorio y solo debe contener letras.";
    }
    if (!formData.facultad.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.facultad)) {
      setErrorInput("facultad");
      return "Facultad es obligatoria y solo debe contener letras.";
    }
    if (!formData.programa.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.programa)) {
      setErrorInput("programa");
      return "Programa es obligatorio y solo debe contener letras.";
    }
    if (!formData.nombre_asignatura.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(formData.nombre_asignatura)) {
      setErrorInput("nombre_asignatura");
      return "Nombre de la asignatura es obligatorio y solo debe contener letras.";
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
      // Convertir formData a URLSearchParams para enviar como x-www-form-urlencoded
      const formBody = new URLSearchParams();

      // Asegúrate que formData es un objeto con las propiedades correctas
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          formBody.append(key, formData[key]);
        }
      }
      console.log("Cuerpo de la petición:", formBody.toString());

      const res = await fetch("/api/ingenieria_software_solicitud.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody.toString(),
      });

      if (res.ok) {
        setMensaje("✅ Solicitud enviada exitosamente.");
        setFormData({
          docente_tutor: "",
          facultad: "",
          programa: "",
          nombre_asignatura: "",
        });
        console.log("Datos a enviar:", formData);

      } else {
        setMensaje("❌ Error al enviar la solicitud.");
      }
    } catch (error) {
      setMensaje("❌ Error de conexión.");
      console.error(error);
    }
  };


  const getInputClass = (name) => {
    return `px-4 py-2 border rounded-md text-base ${name === errorInput ? "border-red-500 bg-red-50" : "border-green-200"
      }`;
  };

  return (
    <div className='flex items-center w-full min-h-screen'>
      <form
        className="mx-auto p-8 bg-green-50 border-2 border-green-500 rounded-2xl shadow-md font-sans max-md:w-full max-md:m-8 max-xl:w-2/3 w-1/2"
        onSubmit={handleSubmit}
        noValidate
      >
        <img
          className="w-28 mx-auto mb-4"
          src="/logo-upc.png"
          alt="Logo UPC"
        />

        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">
          Solicitud Ingeniería de Software
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            { name: "docente_tutor", label: "Nombre del Docente Tutor" },
            { name: "facultad", label: "Facultad" },
            { name: "programa", label: "Programa Académico" },
            { name: "nombre_asignatura", label: "Nombre de la Asignatura" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label
                htmlFor={name}
                className="font-semibold text-green-700 mb-1"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type="text"
                value={formData[name]}
                onChange={handleChange}
                className={getInputClass(name)}
                autoComplete="off"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-md transition duration-300"
        >
          Enviar Solicitud
        </button>

        {mensaje && (
          <p className="mt-4 text-center font-semibold text-green-900">{mensaje}</p>
        )}
      </form>
    </div>
  );
};

export default SolicitudIngenieriaSoftware;
