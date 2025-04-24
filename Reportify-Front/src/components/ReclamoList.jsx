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

  const filteredClaims = claims.filter((claim) =>
    claim.asunto?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.empresa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Cargando reclamos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Vista para reclamo seleccionado
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
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl border border-blue-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700">
          {showForm ? "Crear Reclamo" : "Lista de Reclamos"}
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setClaimSeleccionado(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
        >
          {showForm ? "Volver a la Lista" : "Agregar Reclamo"}
        </button>
      </div>

      {!showForm && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por asunto, empresa o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Asunto</label>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full border border-blue-300 p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Empresa</label>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full border border-blue-300 p-2 rounded-lg"
            >
              <option value="Servidentrega">Servidentrega</option>
              <option value="InterRapidisimo">InterRapidisimo</option>
              <option value="Star Store">Star Store</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-blue-300 p-2 rounded-lg"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all"
          >
            Guardar Reclamo
          </button>
        </form>
      ) : filteredClaims.length === 0 ? (
        <p className="text-center text-gray-500">No hay reclamos disponibles.</p>
      ) : (
        <ul className="space-y-4">
          {filteredClaims.map((claim) => (
            <li
              key={claim.id}
              className="bg-white border border-blue-100 p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                Asunto: {claim.asunto || "No disponible"}
              </h3>
              <p className="text-gray-700">Empresa: <span className="font-medium">{claim.empresa}</span></p>
              <p className="text-gray-700">Fecha de Creación: {new Date(claim.fecha_creacion).toLocaleDateString()}</p>
              <p className="text-gray-700">ID: {claim.id}</p>
              <p className="text-gray-600 mt-2">Descripción: {claim.descripcion}</p>

              <button
                onClick={() => setClaimSeleccionado(claim)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Visualizar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClaimList;
