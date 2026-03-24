import { useState } from "react";
import "./ListaMaterias.css";
import TarjetaMateria from "./TarjetaMateria";
import ModalEdicion from "./ModalEdicion";

const ListaMaterias = ({ materias, setMaterias }) => {
    const [busqueda, setBusqueda] = useState("");
    const [anioSeleccionado, setAnioSeleccionado] = useState("Todos");
    const [modalAbierto, setModalAbierto] = useState(false);
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

    // Filtramos las materias que ya pasaron por el buscador, ahora por el botón de año
    const materiasAMostrar = materiasFiltradas.filter(
        (m) =>
            anioSeleccionado === "Todos" ||
            m.anio_sugerido?.toString() === anioSeleccionado,
    );

    const abrirEditor = (materia) => {
        setMateriaSeleccionada(materia);
        setModalAbierto(true);
    };

    const actualizarMateriaEnBD = async ({ id, nuevoEstado, nuevaNota }) => {
        try {
            // 1. Enviamos los datos al backend (PHP)
            const respuesta = await fetch(
                "http://localhost/proyecto-academico/backend/actualizar_materia.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_materia: id,
                        estado: nuevoEstado,
                        nota: nuevoEstado === "Aprobada" ? nuevaNota : null,
                        usuario_id: 1,
                    }),
                },
            );

            if (respuesta.ok) {
                setMaterias((prevMaterias) =>
                    prevMaterias.map((m) => {
                        // Usamos == para evitar problemas de String vs Number
                        if (m.id == id) {
                            console.log(
                                "¡Materia encontrada! Actualizando UI...",
                            );
                            return {
                                ...m,
                                estado: nuevoEstado,
                                nota:
                                    nuevoEstado === "Aprobada"
                                        ? nuevaNota
                                        : null,
                            };
                        }
                        return m;
                    }),
                );

                setModalAbierto(false);
                setMateriaSeleccionada(null);

                console.log("Materia actualizada con éxito en el Plan 2021");
            } else {
                console.error("Error al actualizar en el servidor");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <div className="contenedor-lista-materias">
            {/* 1. Título */}
            <h1 className="titulo-seccion">Plan de Estudio</h1>

            {/* 2. Input de búsqueda */}
            <input
                type="text"
                className="input-busqueda"
                placeholder="Buscar materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* 3. Botones por año (Filtros rápidos) */}
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

            {/* 4. Materias (Grilla filtrada por búsqueda y por botón) */}
            <div className="grilla-materias">
                {materiasAMostrar.length > 0 ? (
                    materiasAMostrar.map((materia) => (
                        <TarjetaMateria
                            key={materia.id}
                            materia={materia}
                            obtenerClaseEstado={obtenerClaseEstado}
                            abrirEditor={abrirEditor}
                        />
                    ))
                ) : (
                    <p>No se encontraron materias con esos filtros.</p>
                )}
            </div>

            {modalAbierto && materiaSeleccionada && (
                <ModalEdicion
                    materia={materiaSeleccionada}
                    alCerrar={() => setModalAbierto(false)}
                    alGuardar={actualizarMateriaEnBD}
                />
            )}
        </div>
    );
};

export default ListaMaterias;
