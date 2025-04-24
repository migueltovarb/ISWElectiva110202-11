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
        onComentarioGuardado(); // actualiza lista de reclamos si quieres
      })
      .catch(() => {
        alert("Error al guardar el comentario.");
      });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Detalle del Reclamo</h2>

      <div className="space-y-2 mb-6">
        <p><strong>Asunto:</strong> {claim.asunto}</p>
        <p><strong>Empresa:</strong> {claim.empresa}</p>
        <p><strong>Descripción:</strong> {claim.descripcion}</p>
        <p><strong>Fecha de Creación:</strong> {new Date(claim.fecha_creacion).toLocaleDateString()}</p>
        <p><strong>ID:</strong> {claim.id}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Comentario adicional:</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <button
          onClick={handleGuardarComentario}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar Comentario
        </button>
      </div>

      {comentarios.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Comentarios anteriores:</h3>
          <ul className="space-y-2">
            {comentarios.map((c) => (
              <li key={c.id} className="border p-2 rounded">
                {c.texto} <span className="text-sm text-gray-500">({new Date(c.fecha_comentario).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Volver a la Lista
      </button>
    </div>
  );
};

export default VisualizarReclamo;
