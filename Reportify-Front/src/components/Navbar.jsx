

const Navbar = () => {
  return (
    <nav className="bg-gray-100 text-[#325224] p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold">Bienvenido al Sistema de Reclamos</h1>

        <div className="space-x-4">
          <button
            onClick={() => alert("Funcionalidad no disponible aún")}
            className="bg-[#325224] hover:bg-[#27421d] text-white px-4 py-2 rounded"
          >
            Mi perfil
          </button>
          <button
            onClick={() => alert("Funcionalidad no disponible aún")}
            className="bg-[#325224] hover:bg-[#27421d] text-white px-4 py-2 rounded"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
