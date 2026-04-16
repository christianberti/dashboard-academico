import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContenidoPrincipal from "./components/ContenidoPrincipal";
import ListaMaterias from "./components/ListaMaterias";
import NavegacionLateral from "./components/NavegacionLateral";
import { supabase } from "./supabaseClient";

function App() {

  const [materias, setMaterias] = useState([]);
  
    useEffect(() => {
      const traerMaterias = async () => {
        const { data, error } = await supabase
          .from('progreso_estudiante')
          .select(`
            id,
            estado,
            nota,
            plan_estudios (
              id,
              nombre,
              anio_sugerido
            )
          `)
          .eq('usuario_id', 1);

        if (error) {
          console.error("Error al traer materias:", error);
        } else {
          // Flatten data structure to match previous format
          const materiasFormateadas = data.map(m => ({
            id: m.id,
            id_materia: m.plan_estudios.id, // ID del plan
            nombre: m.plan_estudios.nombre,
            estado: m.estado,
            nota: m.nota,
            anio_sugerido: m.plan_estudios.anio_sugerido
          }));
          setMaterias(materiasFormateadas);
        }
      };

      traerMaterias();
    }, []);
  

  return (
    <div className="contenedor-principal">
      <NavegacionLateral />
      <Routes>
        <Route path="/" element={<ContenidoPrincipal materias={materias}/>} />
        <Route path="/materias" element={<ListaMaterias materias={materias} setMaterias={setMaterias}/>} />
      </Routes>
    </div>
  );
}

export default App;
