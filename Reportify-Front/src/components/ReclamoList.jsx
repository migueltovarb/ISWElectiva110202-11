import { useState, useEffect } from "react";
import axios from "axios";

const ClaimList = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClaims();
    }, []); 

    const fetchClaims = () => {
        // Aquí se accede a la variable VITE_API_URL directamente
        axios
            .get(`${import.meta.env.VITE_API_URL}/Reclamo/listar-reclamos`)
            .then((response) => {
                setClaims(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los reclamos", error);
                setError("No se pudieron cargar los reclamos.");
                setLoading(false);
            });
    };

    const handleDeleteClaim = (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar el reclamo?")) return;

        axios
            .delete(`${import.meta.env.VITE_API_URL}/reclamo/eliminar/${id}`)
            .then(() => {
                setClaims(claims.filter(claim => claim.id !== id)); // Filtrar lista
            })
            .catch((error) => {
                console.error("Error al eliminar el reclamo:", error);
            });
    };

    // Función para asignar colores dinámicos
    const getColor = (status) => {
        const colors = {
            "pendiente": "bg-yellow-500",
            "en proceso": "bg-blue-500",
            "resuelto": "bg-green-500",
        };
        return colors[status] || "bg-gray-500"; // color por defecto
    };

    if (loading) return <p className="text-center text-gray-500">Cargando reclamos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Lista de Reclamos</h2>

            {claims.length === 0 ? (
                <p className="text-center text-gray-500">No hay reclamos disponibles.</p>
            ) : (
                <ul className="space-y-4">
                    {claims.map((claim) => (
                        <li key={claim.id} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold">{claim.titulo}</p>
                                <p className="text-gray-600">Descripción: {claim.descripcion}</p>
                                <p className="text-gray-600">Fecha: {claim.fecha}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`w-6 h-6 rounded-full ${getColor(claim.estado)}`}>&nbsp;</span>

                                <button
                                    onClick={() => handleDeleteClaim(claim.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClaimList;
