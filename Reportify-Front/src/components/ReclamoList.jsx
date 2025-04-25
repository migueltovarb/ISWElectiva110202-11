import { useState, useEffect } from "react";
import axios from "axios";
import VisualizarReclamo from "./VisualizarReclamo";

const ClaimList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [claimSeleccionado, setClaimSeleccionado] = useState(null);

  const [asunto, setAsunto] = useState("");
  const [empresa, setEmpresa] = useState("Servidentrega");
  const [descripcion, setDescripcion] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/Reclamo/listar-reclamos`)
      .then((response) => {
        setClaims(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los reclamos.");
        setLoading(false);
      });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const nuevoReclamo = { asunto, empresa, descripcion };

    axios
      .post(`${import.meta.env.VITE_API_URL}/Reclamo/crear`, nuevoReclamo)
      .then(() => {
        fetchClaims();
        setAsunto("");
        setEmpresa("Servidentrega");
        setDescripcion("");
        setShowForm(false);
      })
      .catch(() => {
        alert("Error al crear el reclamo.");
      });
  };

  const handleCancel = () => {
    setAsunto("");
    setDescripcion("");
    setShowForm(false); 
  };

  const filteredClaims = claims.filter((claim) =>
    claim.asunto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.empresa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Cargando reclamos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (claimSeleccionado) {
    return (
      <VisualizarReclamo
        claim={claimSeleccionado}
        onBack={() => setClaimSeleccionado(null)}
        onComentarioGuardado={fetchClaims}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <h1 className="text-2xs text-green-800">Bienvenidos al Sistema de Reclamos</h1>
      <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-8 border-b pb-2">
        Tus Reclamos
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setClaimSeleccionado(null);
          }}
          className="bg-[#3f622e] hover:bg-[#325224] text-white px-6 py-2 rounded shadow-md"
        >
          {showForm ? "Volver a la Lista" : "Agregar Reclamo"}
        </button>
      </div>

      {!showForm && (
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por asunto, empresa o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Asunto</label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Empresa</label>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="Servidentrega">Servientrega</option>
              <option value="InterRapidisimo">InterRapidisimo</option>
              <option value="Star Store">Star Store</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="4"
              required
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-[#3f622e] hover:bg-[#325224] text-white px-6 py-2 rounded shadow-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#3f622e] hover:bg-[#325224] text-white px-6 py-2 rounded shadow-md"
            >
              Enviar
            </button>
          </div>
        </form>
      ) : filteredClaims.length === 0 ? (
        <p className="text-center text-gray-500">No hay reclamos disponibles.</p>
      ) : (
        <ul className="space-y-6">
          {filteredClaims.map((claim) => (
            <li
              key={claim.id}
              className="bg-white border border-gray-200 p-6 rounded-lg"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-gray-800">{claim.empresa}</h3>
                <span className="text-sm text-gray-500 font-mono">ID {claim.id}</span>
              </div>

              <p
                className="text-gray-600 mt-2"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {claim.descripcion}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setClaimSeleccionado(claim)}
                  className="border border-gray-500 text-gray-800 px-4 py-1 rounded hover:bg-gray-100"
                >
                  Visualizar
                </button>
                <span className="text-sm text-gray-500 font-mono">
                  {new Date(claim.fecha_creacion).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClaimList;
