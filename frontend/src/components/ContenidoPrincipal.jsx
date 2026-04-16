import { useEffect, useState } from "react";
import "./ContenidoPrincipal.css";
import GraficoProgresoCarrera from "./GraficoProgresoCarrera.jsx";
import ListaDeTareas from "./ListaDeTareas.jsx";
import MateriasEnCurso from "./MateriasEnCurso.jsx";
import PomodoroTimer from "./PomodoroTimer.jsx";
import TarjetaMetrica from "./TarjetaMetrica.jsx";
import CalendarioExamenes from "./CalendarioExamenes.jsx";
import ListaExamenes from "./ListaExamenes.jsx";
import API_BASE_URL from "../config";

const ContenidoPrincipal = ({ materias }) => {
    // Estado de exámenes con persistencia en Base de Datos
    const [examenes, setExamenes] = useState([]);
    const [cargandoExamenes, setCargandoExamenes] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/obtener_examenes.php`)
            .then(res => res.json())
            .then(datos => {
                setExamenes(datos);
                setCargandoExamenes(false);
            })
            .catch(err => {
                console.error("Error al cargar exámenes:", err);
                setCargandoExamenes(false);
            });
    }, []);

    const agregarExamen = (nuevo) => {
        fetch(`${API_BASE_URL}/gestionar_examenes.php`, {
            method: 'POST',
            body: JSON.stringify(nuevo),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                // Actualizamos localmente con el ID real de la base de datos
                const examenConId = { ...nuevo, id: data.id };
                setExamenes([...examenes, examenConId].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
            }
        })
        .catch(err => console.error("Error al guardar examen:", err));
    };

    const eliminarExamen = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este examen?")) {
            fetch(`${API_BASE_URL}/gestionar_examenes.php`, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(() => {
                setExamenes(examenes.filter(e => e.id !== id));
            })
            .catch(err => console.error("Error al eliminar examen:", err));
        }
    };

    const toggleExamenCompletado = (id) => {
        fetch(`${API_BASE_URL}/gestionar_examenes.php`, {
            method: 'PUT',
            body: JSON.stringify({ id, toggleCompletado: true }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            setExamenes(examenes.map(e => e.id === id ? { ...e, completado: !e.completado } : e));
        })
        .catch(err => console.error("Error al actualizar examen:", err));
    };

    const editarExamen = (examenActualizado) => {
        const nuevoNombre = prompt("Materia del examen:", examenActualizado.nombre);
        if (nuevoNombre === null) return;

        const nuevaFecha = prompt("Nueva fecha (AAAA-MM-DD):", examenActualizado.fecha);
        if (nuevaFecha === null) return;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha)) {
            alert("Formato de fecha inválido. Use AAAA-MM-DD");
            return;
        }

        fetch(`${API_BASE_URL}/gestionar_examenes.php`, {
            method: 'PUT',
            body: JSON.stringify({ id: examenActualizado.id, nombre: nuevoNombre, fecha: nuevaFecha }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
            setExamenes(examenes.map(e => 
                e.id === examenActualizado.id 
                ? { ...e, nombre: nuevoNombre, fecha: nuevaFecha } 
                : e
            ).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
        })
        .catch(err => console.error("Error al editar examen:", err));
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
                <MateriasEnCurso enCurso={enCurso} />
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

            <section className="contenedor-detalle-materias"></section>
        </main>
    );
};

export default ContenidoPrincipal;

