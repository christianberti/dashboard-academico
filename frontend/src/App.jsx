import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContenidoPrincipal from "./components/ContenidoPrincipal";
import ListaMaterias from "./components/ListaMaterias";
import NavegacionLateral from "./components/NavegacionLateral";
import { useEffect, useState } from "react";
import API_BASE_URL from "./config";

function App() {

  const [materias, setMaterias] = useState([]);
  
    useEffect(() => {
      fetch(`${API_BASE_URL}/obtener_materias.php`)
        .then((respuesta) => respuesta.json())
        .then((datos) => {
          setMaterias(datos);
        })
        .catch((error) => {
          console.error("Error al traer materias:", error);
        });
    }, []);
  

  return (
    <div className="contenedor-principal">
      <NavegacionLateral />
      <Routes>
        <Route path="/resumen" element={<ContenidoPrincipal materias={materias}/>} />
        <Route path="/materias" element={<ListaMaterias materias={materias} setMaterias={setMaterias}/>} />
      </Routes>
    </div>
  );
}

export default App;
