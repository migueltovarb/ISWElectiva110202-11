import { useState } from "react";
import axios from "axios";

const AddReclamo = ({ onReclamoCreado }) => {
  const [asunto, setAsunto] = useState("");
  const [empresa, setEmpresa] = useState("Servidentrega");
  const [descripcion, setDescripcion] = useState("");
  const [evidencia, setEvidencia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("asunto", asunto);
      formData.append("empresa", empresa);
      formData.append("descripcion", descripcion);
      if (evidencia) {
        formData.append("evidencia", evidencia);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/Reclamo/crear`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setAsunto("");
      setEmpresa("Servidentrega");
      setDescripcion("");
      setEvidencia(null);
      if (onReclamoCreado) {
        onReclamoCreado();
      }
    } catch (err) {
      setError("Hubo un error al crear el reclamo. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Crear Reclamo</h2>
      <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="asunto" className="block text-gray-700 mb-1">
            Asunto
          </label>
          <input
            id="asunto"
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="empresa" className="block text-gray-700 mb-1">
            Empresa
          </label>
          <select
            id="empresa"
            className="w-full border border-gray-300 rounded p-2"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            disabled={isLoading}
          >
            <option value="Servidentrega">Servidentrega</option>
            <option value="InterRapidisimo">InterRapidisimo</option>
            <option value="Star Store">Star Store</option>
          </select>
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            className="w-full border border-gray-300 rounded p-2"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="evidencia" className="block text-gray-700 mb-1">
            Evidencia (imagen o archivo)
          </label>
          <input
            id="evidencia"
            type="file"
            accept="image/*,application/pdf"
            className="w-full border border-gray-300 rounded p-2"
            onChange={(e) => setEvidencia(e.target.files[0])}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar Reclamo"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Reclamo creado exitosamente.</p>}
      </form>
    </div>
  );
};

export default AddReclamo;