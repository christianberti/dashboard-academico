import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContenidoPrincipal from "./components/ContenidoPrincipal";
import ListaMaterias from "./components/ListaMaterias";
import NavegacionLateral from "./components/NavegacionLateral";
import LoginAuth from "./components/LoginAuth";
import SelectorCarrera from "./components/SelectorCarrera";
import HeaderMovil from "./components/HeaderMovil";
import Configuracion from "./components/Configuracion";
import { supabase } from "./supabaseClient";

function App() {
  const [session, setSession] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [carrerasUsuario, setCarrerasUsuario] = useState([]);
  const [carreraActiva, setCarreraActiva] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // 1. Manejar Sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCargando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setMaterias([]);
        setCarreraActiva(null);
        setCarrerasUsuario([]);
        setMostrarSelector(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Traer Carreras del Usuario
  useEffect(() => {
    if (session) {
      traerCarrerasUsuario();
    }
  }, [session]);

  const traerCarrerasUsuario = async () => {
    const { data, error } = await supabase
      .from('usuarios_carreras')
      .select('id_carrera, es_activa, carreras(nombre)')
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error al traer carreras del usuario:", error);
    } else {
      setCarrerasUsuario(data);
      const activa = data.find(c => c.es_activa) || data[0];
      if (activa) {
        setCarreraActiva(activa);
        setMostrarSelector(false); // Cerramos el selector si ya tenemos carreras
      } else {
        setMostrarSelector(true);
      }
    }
  };

  // 3. Traer Materias de la Carrera Activa
  useEffect(() => {
    if (session && carreraActiva) {
      traerMaterias();
    }
  }, [session, carreraActiva]);

  const traerMaterias = async () => {
    const { data, error } = await supabase
      .from('progreso_estudiante')
      .select(`
        id,
        estado,
        nota,
        plan_estudios!inner (
          id,
          nombre,
          anio_sugerido,
          id_carrera
        )
      `)
      .eq('user_id', session.user.id)
      .eq('plan_estudios.id_carrera', carreraActiva.id_carrera);

    if (error) {
      console.error("Error al traer materias:", error);
    } else {
      const materiasFormateadas = data.map(m => ({
        id: m.id,
        id_materia: m.plan_estudios.id,
        nombre: m.plan_estudios.nombre,
        estado: m.estado,
        nota: m.nota,
        anio_sugerido: m.plan_estudios.anio_sugerido
      })).sort((a, b) => a.anio_sugerido - b.anio_sugerido);
      setMaterias(materiasFormateadas);
    }
  };

  const cambiarCarreraActiva = async (idCarrera) => {
    // Si ya es la activa, no hacer nada
    if (idCarrera === carreraActiva?.id_carrera) return;

    // Actualizar en base de datos
    await supabase.from('usuarios_carreras').update({ es_activa: false }).eq('user_id', session.user.id);
    await supabase.from('usuarios_carreras').update({ es_activa: true }).eq('user_id', session.user.id).eq('id_carrera', idCarrera);
    
    // Refrescar localmente
    traerCarrerasUsuario();
  };

  if (cargando) return <div className="cargando-global">Cargando aplicación...</div>;

  if (!session) return <LoginAuth />;

  return (
    <div className={`contenedor-app-wrapper ${menuAbierto ? 'menu-visible' : ''}`}>
      <HeaderMovil onToggleMenu={() => setMenuAbierto(!menuAbierto)} />
      
      <div className="contenedor-principal">
        <NavegacionLateral 
          carreraActiva={carreraActiva} 
          todasCarreras={carrerasUsuario} 
          alCambiarCarrera={cambiarCarreraActiva}
          onAbrirSelector={() => setMostrarSelector(true)}
          menuAbierto={menuAbierto}
          alCerrarMenu={() => setMenuAbierto(false)}
        />
        <Routes>
          <Route path="/" element={<ContenidoPrincipal materias={materias}/>} />
          <Route path="/materias" element={<ListaMaterias materias={materias} setMaterias={setMaterias}/>} />
          <Route path="/configuracion" element={<Configuracion carrerasUsuario={carrerasUsuario} onCarreraEliminada={traerCarrerasUsuario} />} />
        </Routes>
      </div>

      {mostrarSelector && (
        <SelectorCarrera 
          onFinished={traerCarrerasUsuario} 
          carrerasYaInscrito={carrerasUsuario.map(c => c.id_carrera)}
          alCerrar={() => setMostrarSelector(false)}
        />
      )}
    </div>
  );
}

export default App;
