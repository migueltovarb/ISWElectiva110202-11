import ClaimList from "./components/ReclamoList";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Navbar />
      <ClaimList />
    </div>
  );
}

export default App;
