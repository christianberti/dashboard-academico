import { X } from "lucide-react";
import "./ModalEdicion.css";
import { useState } from "react";

const ModalEdicion = ({ materia, alCerrar, alGuardar }) => {
    const [materiaEstado, setMateriaEstado] = useState(materia.estado);
    const [nota, setNota] = useState(materia.nota || "");

    const manejarGuardado = (e) => {
        e.preventDefault(); // Evita que la página se recargue al dar Enter
        alGuardar({
            id: materia.id,
            nuevoEstado: materiaEstado,
            nuevaNota: nota,
        });
    };

    return (
        <div className="contenedor-modal" onClick={alCerrar}>
            <form className="tarjeta-modal" onClick={(e) => e.stopPropagation()} onSubmit={manejarGuardado}>
                <button type="button" onClick={alCerrar} className="boton-cerrar">
                    <X />
                </button>
                <h3>{materia.nombre}</h3>
                <select
                    value={materiaEstado}
                    onChange={(e) => setMateriaEstado(e.target.value)}
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En curso">En Curso</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Final pendiente">Final Pendiente</option>
                </select>

                {materiaEstado === "Aprobada" && (
                    <input
                        type="number"
                        min={0}
                        max={10}
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                    ></input>
                )}
                <button type="submit" className="boton-guardar">Guardar</button>
            </form>
        </div>
    );
};

export default ModalEdicion;
