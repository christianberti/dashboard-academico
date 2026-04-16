import React from "react";
import './MateriasEnCurso.css'

const MateriasEnCurso = ({ enCurso }) => {

  return (
    <article className="container-en-curso">
      <h2>En Curso</h2>
      {enCurso.slice(0, 3).map((s) => (
        <div key={s.id} className="materia-en-curso">
          <div
          >
            <h4>{s.nombre}</h4>
            <span>{s.progress}</span>
          </div>
          <div className="materias-extras">
            <p>Ver más</p>
          </div>
        </div>
      ))}
    </article>
  );
};

export default MateriasEnCurso;
