import { useState } from "react";
import "./ListaMaterias.css";
import TarjetaMateria from "./TarjetaMateria";
import ModalEdicion from "./ModalEdicion";
import ModalArchivos from "./ModalArchivos";
import { supabase } from "../supabaseClient";

const ListaMaterias = ({ materias, setMaterias }) => {
    const [busqueda, setBusqueda] = useState("");
    const [anioSeleccionado, setAnioSeleccionado] = useState("Todos");
    const [modalEdicionAbierto, setModalEdicionAbierto] = useState(false);
    const [modalArchivosAbierto, setModalArchivosAbierto] = useState(false);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

    // Función para definir el color de la etiqueta según el estado
    const obtenerClaseEstado = (estado) => {
        switch (estado) {
            case "Aprobada":
                return "estado-aprobada";
            case "En Curso":
                return "estado-en-curso";
            case "Final Pendiente":
                return "estado-final-pendiente";
            default:
                return "estado-pendiente";
        }
    };

    const materiasFiltradas = materias.filter((materia) =>
        materia.nombre.toLowerCase().includes(busqueda.toLowerCase()),
    );

    const materiasAMostrar = materiasFiltradas.filter(
        (m) =>
            anioSeleccionado === "Todos" ||
            m.anio_sugerido?.toString() === anioSeleccionado,
    );

    const abrirEditor = (materia) => {
        setMateriaSeleccionada(materia);
        setModalEdicionAbierto(true);
    };

    const abrirArchivos = (materia) => {
        setMateriaSeleccionada(materia);
        setModalArchivosAbierto(true);
    };

    const actualizarMateriaEnBD = async ({ id, nuevoEstado, nuevaNota }) => {
        try {
            const { error } = await supabase
                .from('progreso_estudiante')
                .update({
                    estado: nuevoEstado,
                    nota: nuevoEstado === "Aprobada" ? nuevaNota : null
                })
                .eq('id', id);

            if (error) throw error;

            setMaterias((prevMaterias) =>
                prevMaterias.map((m) => {
                    if (m.id == id) {
                        return {
                            ...m,
                            estado: nuevoEstado,
                            nota: nuevoEstado === "Aprobada" ? nuevaNota : null,
                        };
                    }
                    return m;
                }),
            );

            setModalEdicionAbierto(false);
            setMateriaSeleccionada(null);
        } catch (error) {
            console.error("Error al actualizar materia:", error);
            alert("Hubo un error al actualizar la materia");
        }
    };

    return (
        <div className="contenedor-lista-materias">
            <h1 className="titulo-seccion">Plan de Estudio</h1>

            <input
                type="text"
                className="input-busqueda"
                placeholder="Buscar materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="contenedor-filtros-anio">
                {["Todos", "0", "1", "2", "3", "4", "5"].map((anio) => (
                    <button
                        key={anio}
                        className={`boton-filtro ${anioSeleccionado === anio ? "activo" : ""}`}
                        onClick={() => setAnioSeleccionado(anio)}
                    >
                        {anio === "Todos"
                            ? "Todas"
                            : anio === "0"
                              ? "Ingreso"
                              : `${anio}° Año`}
                    </button>
                ))}
            </div>

            <div className="grilla-materias">
                {materiasAMostrar.length > 0 ? (
                    materiasAMostrar.map((materia) => (
                        <TarjetaMateria
                            key={materia.id}
                            materia={materia}
                            obtenerClaseEstado={obtenerClaseEstado}
                            abrirEditor={abrirEditor}
                            abrirArchivos={abrirArchivos}
                        />
                    ))
                ) : (
                    <p>No se encontraron materias con esos filtros.</p>
                )}
            </div>

            {modalEdicionAbierto && materiaSeleccionada && (
                <ModalEdicion
                    materia={materiaSeleccionada}
                    alCerrar={() => setModalEdicionAbierto(false)}
                    alGuardar={actualizarMateriaEnBD}
                />
            )}

            {modalArchivosAbierto && materiaSeleccionada && (
                <ModalArchivos 
                    materia={materiaSeleccionada}
                    onClose={() => setModalArchivosAbierto(false)}
                />
            )}
        </div>
    );
};

export default ListaMaterias;

