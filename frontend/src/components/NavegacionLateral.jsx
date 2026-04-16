import "./NavegacionLateral.css";
import { Link } from "react-router-dom";

const NavegacionLateral = () => {
  const secciones = [
    "Resumen",
    "Materias",
    "Recursos Importantes",
    "Configuracion",
  ];

  return (
    <aside className="barra-lateral">
      <header className="encabezado-nav">
        <h2>Informática UNLP</h2>
      </header>

      <nav>
        <ul className="lista-nav">
          {secciones.map((registro) => (
            <li key={registro} className="item-nav">
              <Link to={registro === "Resumen" ? "/" : `/${registro.toLowerCase().replace(/\s+/g, "-")}`}>
                {registro}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default NavegacionLateral;
