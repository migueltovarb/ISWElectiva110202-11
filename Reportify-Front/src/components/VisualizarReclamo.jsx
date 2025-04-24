// src/components/VisualizarReclamo.jsx
import { useState } from "react";
import axios from "axios";

const VisualizarReclamo = ({ claim, onBack, onComentarioGuardado }) => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState(claim.comentarios || []);

  const handleGuardarComentario = () => {
    if (!comentario.trim()) return;

    axios
      .post(`${import.meta.env.VITE_API_URL}/Reclamo/comentar/${claim.id}/`, {
        texto: comentario,
      })
      .then((res) => {
        setComentarios(res.data.comentarios);
        setComentario("");
        onComentarioGuardado();
      })
      .catch(() => {
        alert("Error al guardar el comentario.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-8 border-b pb-2">
        Tu Reclamo
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg text-gray-800 font-semibold mb-1">{claim.empresa}</p>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{claim.asunto}</h2>

        <p className="text-gray-700 leading-relaxed mb-6">
          {claim.descripcion}
        </p>

        <div className="mb-4">
          <label className="block text-gray-800 font-semibold mb-2">
            Agrega comentario adicional:
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            rows="4"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Es importante para mí recibir este pedido a la brevedad posible..."
          />
          <button
            onClick={handleGuardarComentario}
            className="mt-3 bg-green-700 text-white px-5 py-2 rounded shadow hover:bg-green-800 transition"
          >
            Agregar
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onBack}
            className="bg-[#3E4D35] text-white px-6 py-2 rounded shadow hover:bg-[#2f3a28] transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarReclamo;
