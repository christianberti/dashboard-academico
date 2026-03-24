import { Award, FileText, Pencil } from "lucide-react";
import './TarjetaMateria.css'

const TarjetaMateria = ({materia, obtenerClaseEstado, abrirEditor}) => {
  return (
    <div key={materia.id} className="tarjeta-materia">
      <div className="info-principal">
        <span className={`badge-estado ${obtenerClaseEstado(materia.estado)}`}>
          {materia.estado}
        </span>
        <h4>{materia.nombre}</h4>
      </div>

      <div className="detalles-materia">
        <div className="dato-nota">
          <Award size={16} />
          <span>{materia.nota ? `Nota: ${materia.nota}` : "Sin nota"}</span>
        </div>
        <div className="contenedor-botones-card">
          <button
            className="boton-archivos"
            title="Editar materia"
            onClick={() => abrirEditor(materia)}
          >
            <Pencil size={16} />
          </button>
          <button className="boton-archivos" title="Ver archivos">
            <FileText size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaMateria;
