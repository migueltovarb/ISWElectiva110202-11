import { useState } from "react";
import axios from "axios";

const AddReclamo = ({ onReclamoCreado }) => {
  const [asunto, setAsunto] = useState("");
  const [empresa, setEmpresa] = useState("Servidentrega");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoReclamo = {
      asunto: asunto,
      empresa: empresa,
      descripcion: descripcion,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/Reclamo/crear`, nuevoReclamo)
      .then((response) => {
        setMensaje("Reclamo creado exitosamente.");
        setAsunto("");
        setEmpresa("Servidentrega");
        setDescripcion("");

        if (onReclamoCreado) {
          onReclamoCreado(); 
        }
      })
      .catch((error) => {
        console.error("Error al crear el reclamo:", error);
        setMensaje("Hubo un error al crear el reclamo.");
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Crear Reclamo</h2>

      {mensaje && <p className="text-sm text-center text-blue-500">{mensaje}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Asunto</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Empresa</label>
          <select
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="Servidentrega">Servidentrega</option>
            <option value="InterRapidisimo">InterRapidisimo</option>
            <option value="Star Store">Star Store</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Enviar Reclamo
        </button>
      </form>
    </div>
  );
};

export default AddReclamo;
