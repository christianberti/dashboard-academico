import "./NavegacionLateral.css";
import { Link } from "react-router-dom";
import { LogOut, ChevronDown, GraduationCap } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useState } from "react";

const NavegacionLateral = ({ carreraActiva, todasCarreras, alCambiarCarrera, onAbrirSelector, menuAbierto, alCerrarMenu }) => {
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  const secciones = [
    "Resumen",
    "Materias",
    "Recursos Importantes",
    "Configuracion",
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className={`overlay-menu ${menuAbierto ? 'visible' : ''}`} onClick={alCerrarMenu}></div>
      <aside className={`barra-lateral ${menuAbierto ? 'abierta' : ''}`}>
        <header className="encabezado-nav">
          <div className="selector-carrera-nav" onClick={() => setSelectorAbierto(!selectorAbierto)}>
            <GraduationCap className="icono-carrera" />
            <div className="info-carrera-actual">
              <span className="label-carrera">Carrera Activa</span>
              <span className="nombre-carrera">{carreraActiva?.carreras?.nombre || "Cargando..."}</span>
            </div>
            <ChevronDown className={`flecha-selector ${selectorAbierto ? 'abierta' : ''}`} />
            
            {selectorAbierto && (
              <div className="dropdown-carreras">
                {todasCarreras.map(item => (
                  <div 
                    key={item.id_carrera} 
                    className={`opcion-dropdown ${item.id_carrera === carreraActiva?.id_carrera ? 'activa' : ''}`}
                    onClick={() => {
                        alCambiarCarrera(item.id_carrera);
                        alCerrarMenu();
                    }}
                  >
                    {item.carreras.nombre}
                  </div>
                ))}
                <div 
                  className="opcion-dropdown inscribir-nueva"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectorAbierto(false);
                    onAbrirSelector();
                    alCerrarMenu();
                  }}
                >
                  + Agregar otra carrera
                </div>
              </div>
            )}
          </div>
        </header>

        <nav>
          <ul className="lista-nav">
            {secciones.map((registro) => (
              <li key={registro} className="item-nav" onClick={alCerrarMenu}>
                <Link to={registro === "Resumen" ? "/" : `/${registro.toLowerCase().replace(/\s+/g, "-")}`}>
                  {registro}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="footer-nav">
          <button className="boton-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default NavegacionLateral;
