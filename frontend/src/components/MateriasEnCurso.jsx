import React from "react";
import { Folder } from "lucide-react";
import './MateriasEnCurso.css'

const MateriasEnCurso = ({ enCurso, onAbrirArchivos }) => {

  return (
    <article className="container-en-curso">
      <h2>En Curso</h2>
      <div className="lista-materias-en-curso">
        {enCurso.length === 0 ? (
          <p className="mensaje-vacio">No tienes materias en curso.</p>
        ) : (
          enCurso.slice(0, 3).map((s) => (
            <div key={s.id} className="materia-en-curso">
              <div className="materia-info-en-curso">
                <h4>{s.nombre}</h4>
              </div>
              <button 
                className="boton-archivos-en-curso" 
                onClick={() => onAbrirArchivos(s)}
              >
                <span>Archivos</span>
                <Folder size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default MateriasEnCurso;
