import { useEffect, useState } from "react";
import "./ContenidoPrincipal.css";
import GraficoProgresoCarrera from "./GraficoProgresoCarrera.jsx";
import ListaDeTareas from "./ListaDeTareas.jsx";
import MateriasEnCurso from "./MateriasEnCurso.jsx";
import PomodoroTimer from "./PomodoroTimer.jsx";
import TarjetaMetrica from "./TarjetaMetrica.jsx";
import CalendarioExamenes from "./CalendarioExamenes.jsx";
import ListaExamenes from "./ListaExamenes.jsx";
import ModalEdicionExamen from "./ModalEdicionExamen.jsx";
import ModalArchivos from "./ModalArchivos.jsx";
import { supabase } from "../supabaseClient";
import { Folder } from "lucide-react";

const ContenidoPrincipal = ({ materias }) => {
    // Estado de exámenes con persistencia en Supabase
    const [examenes, setExamenes] = useState([]);
    const [cargandoExamenes, setCargandoExamenes] = useState(true);
    const [examenAEditar, setExamenAEditar] = useState(null);
    const [modalArchivosAbierto, setModalArchivosAbierto] = useState(false);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);

    const abrirArchivos = (materia) => {
        setMateriaSeleccionada(materia);
        setModalArchivosAbierto(true);
    };

    useEffect(() => {
        const cargarExamenes = async () => {
            const { data, error } = await supabase
                .from('eventos_examenes')
                .select(`
                    id,
                    nombre,
                    fecha,
                    completado,
                    id_progreso
                `)
                .order('fecha', { ascending: true });

            if (error) {
                console.error("Error al cargar exámenes:", error);
            } else {
                setExamenes(data);
            }
            setCargandoExamenes(false);
        };

        cargarExamenes();
    }, []);

    const agregarExamen = async (nuevo) => {
        try {
            // Buscamos el id_progreso del estudiante para esa materia
            const materiaEnProgreso = materias.find(m => m.nombre === nuevo.nombre);
            if (!materiaEnProgreso) throw new Error("Materia no encontrada en tu plan");

            const { data, error } = await supabase
                .from('eventos_examenes')
                .insert([{
                    id_progreso: materiaEnProgreso.id,
                    nombre: nuevo.nombre,
                    fecha: nuevo.fecha,
                    completado: false
                }])
                .select();

            if (error) throw error;

            if (data) {
                setExamenes([...examenes, data[0]].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
            }
        } catch (err) {
            console.error("Error al guardar examen:", err.message);
            alert(err.message);
        }
    };

    const eliminarExamen = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este examen?")) {
            const { error } = await supabase
                .from('eventos_examenes')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Error al eliminar examen:", error);
            } else {
                setExamenes(examenes.filter(e => e.id !== id));
            }
        }
    };

    const toggleExamenCompletado = async (id) => {
        const examen = examenes.find(e => e.id === id);
        const { error } = await supabase
            .from('eventos_examenes')
            .update({ completado: !examen.completado })
            .eq('id', id);

        if (error) {
            console.error("Error al actualizar examen:", error);
        } else {
            setExamenes(examenes.map(e => e.id === id ? { ...e, completado: !e.completado } : e));
        }
    };

    const editarExamen = (examen) => {
        setExamenAEditar(examen);
    };

    const guardarEdicionExamen = async (examenActualizado) => {
        try {
            const materiaEnProgreso = materias.find(m => m.nombre === examenActualizado.nombre);
            if (!materiaEnProgreso) throw new Error("Materia no encontrada");

            const { error } = await supabase
                .from('eventos_examenes')
                .update({ 
                    nombre: examenActualizado.nombre, 
                    fecha: examenActualizado.fecha,
                    id_progreso: materiaEnProgreso.id
                })
                .eq('id', examenActualizado.id);

            if (error) throw error;

            setExamenes(examenes.map(e => 
                e.id === examenActualizado.id 
                ? { ...e, nombre: examenActualizado.nombre, fecha: examenActualizado.fecha, id_progreso: materiaEnProgreso.id } 
                : e
            ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));

            setExamenAEditar(null);
        } catch (err) {
            console.error("Error al editar examen:", err.message);
            alert(err.message);
        }
    };

    const aprobadas = materias.filter((m) => m.estado === "Aprobada").length;
    const enCurso = materias.filter((m) => m.estado === "En Curso");
    const finalPendiente = materias.filter((materia) => materia.estado === "Final Pendiente").length;

    const promedioGeneral =
        materias.reduce(
            (acumulador, materia) =>
                acumulador + (materia.nota ? parseFloat(materia.nota) : 0
                ),
            0,
        ) / (materias.filter((materia) => materia.nota).length || 1);

    const metricas = [
        { titulo: "Promedio General", valor: promedioGeneral.toFixed(2) },
        {
            titulo: "Materias Aprobadas",
            valor: aprobadas,
        },
        {
            titulo: "Finales Pendientes",
            valor: finalPendiente,
        },
    ];

    return (
        <main className="contenedor-main">
            <header className="main-header">
                <h1>Panel de Control</h1>
                <p>Bienvenido a tu seguimiento académico personalizado</p>
            </header>

            <section className="contenedor-metricas">
                {metricas.map((metrica) => (
                    <TarjetaMetrica
                        key={metrica.titulo}
                        titulo={metrica.titulo}
                        valor={metrica.valor}
                    />
                ))}
            </section>

            <section className="seccion-dashboard-graficos">
                <GraficoProgresoCarrera datosMaterias={materias} aprobadas={aprobadas} enCurso={enCurso}/>
                <MateriasEnCurso enCurso={enCurso} onAbrirArchivos={abrirArchivos} />
            </section>

            {/* Reposicionado: Lista de exámenes con alta prioridad */}
            {examenes.length > 0 && (
                <ListaExamenes 
                    examenes={examenes} 
                    alEliminar={eliminarExamen} 
                    alMarcarCompletado={toggleExamenCompletado}
                    alEditar={editarExamen}
                />
            )}

            <section className="seccion-productividad">
                <div className="bloque-productividad">
                    <PomodoroTimer />
                    <CalendarioExamenes materias={materias} alAgregarExamen={agregarExamen} />
                </div>
                <ListaDeTareas />
            </section>

            {examenAEditar && (
                <ModalEdicionExamen 
                    examen={examenAEditar}
                    materiasDisponibles={materias}
                    alCerrar={() => setExamenAEditar(null)}
                    alGuardar={guardarEdicionExamen}
                />
            )}

            {modalArchivosAbierto && materiaSeleccionada && (
                <ModalArchivos 
                    materia={materiaSeleccionada}
                    onClose={() => setModalArchivosAbierto(false)}
                />
            )}

            <section className="contenedor-detalle-materias"></section>
        </main>
    );
};

export default ContenidoPrincipal;

