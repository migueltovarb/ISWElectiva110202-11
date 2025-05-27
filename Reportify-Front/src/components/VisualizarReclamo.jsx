import { useState } from "react";
import axios from "axios";
import EvidenceFile from "./EvidenceFile"; // Asegúrate que la ruta sea correcta

const VisualizarReclamo = ({ claim, onBack, onComentarioGuardado }) => {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState(claim.comentarios || []);

  const handleGuardarComentario = () => {
    if (!comentario.trim()) return;

    const fechaComentario = new Date().toISOString();

    axios
      .post(`${import.meta.env.VITE_API_URL}/Reclamo/comentar/${claim.id}/`, {
        texto: comentario,
        fecha: fechaComentario,
      })
      .then((res) => {
        if (res.data && res.data.comentarios) {
          setComentarios(res.data.comentarios);
          setComentario("");
          onComentarioGuardado();
        } else {
          alert("No se pudieron guardar los comentarios correctamente.");
        }
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
        {/* Empresa */}
        <p className="text-lg text-gray-800 font-semibold mb-1">Empresa:</p>
        <p className="text-lg text-gray-700 mb-4">{claim.empresa}</p>

        {/* Asunto */}
        <h2
          className="text-xl font-bold text-gray-900 mb-4"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <span className="font-semibold">Asunto:</span> {claim.asunto}
        </h2>

        {/* Descripción */}
        <p
          className="text-gray-700 leading-relaxed mb-6"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <span className="font-semibold">Descripción:</span> {claim.descripcion}
        </p>

        {/* Evidencia adjunta */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800">Evidencia adjunta:</h3>
          <EvidenceFile url={claim.evidencia} />
        </div>

        {/* Comentarios */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-800">Comentarios:</h3>
          <ul className="space-y-4 mt-4">
            {comentarios.length === 0 ? (
              <p className="text-gray-500">No hay comentarios aún.</p>
            ) : (
              comentarios.map((comentario, index) => (
                <li key={index} className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700">{comentario.texto}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Agregar comentario */}
        <div className="mb-4 mt-6">
          <label className="block text-gray-800 font-semibold mb-2">
            Agrega comentario adicional:
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#325224]"
            rows="4"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Agrega un comentario adicional..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleGuardarComentario}
            className="bg-[#325224] text-white px-6 py-2 rounded shadow"
          >
            Agregar
          </button>
          <button
            onClick={onBack}
            className="bg-[#325224] text-white px-6 py-2 rounded shadow"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizarReclamo;
