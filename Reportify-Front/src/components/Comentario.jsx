import { useState } from "react";
import axios from "axios";

const Comentario = ({ claim }) => {
  const [newComment, setNewComment] = useState(claim.comentario || "");
  const [loading, setLoading] = useState(false);

  const handleUpdateComment = () => {
    setLoading(true);

    const updatedClaim = {
      comentario: newComment,
    };

    axios
      .put(`${import.meta.env.VITE_API_URL}/comentar/${claim.id}/`, updatedClaim)
      .then(() => {
        alert("Comentario actualizado correctamente");
        setLoading(false);
      })
      .catch(() => {
        alert("Error al actualizar el comentario.");
        setLoading(false);
      });
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-xl font-semibold">{claim.titulo}</h3>
      <p><strong>Descripción:</strong> {claim.descripcion}</p>
      <p><strong>Fecha de creación:</strong> {claim.fecha_creacion}</p>
      <p><strong>Empresa:</strong> {claim.empresa}</p>

      {/* Comentario adicional */}
      <div className="mt-4">
        <label className="block text-gray-700">Comentario Adicional</label>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
        />
      </div>

      <button
        onClick={handleUpdateComment}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
      >
        {loading ? "Actualizando..." : "Actualizar Comentario"}
      </button>
    </div>
  );
};

export default Comentario;
