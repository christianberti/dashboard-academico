import "./ContenidoPrincipal.css";
import GraficoProgresoCarrera from "./GraficoProgresoCarrera.jsx";
import ListaDeTareas from "./ListaDeTareas.jsx";
import MateriasEnCurso from "./MateriasEnCurso.jsx";
import PomodoroTimer from "./PomodoroTimer.jsx";
import TarjetaMetrica from "./TarjetaMetrica.jsx";

const ContenidoPrincipal = ({ materias }) => {
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
            <header>
                <h1>Resumen Académico</h1>
            </header>
            <section className="contenedor-metricas">
                {metricas.map((materia) => (
                    <TarjetaMetrica
                        key={materia.titulo}
                        titulo={materia.titulo}
                        valor={materia.valor}
                    />
                ))}
            </section>
            <section className="contenedor-grafico">
                <GraficoProgresoCarrera datosMaterias={materias} aprobadas={aprobadas} enCurso={enCurso}/>
                <MateriasEnCurso enCurso={enCurso} />
            </section>
            <section className="contenedor-detalle-materias"></section>
            <PomodoroTimer />
            <ListaDeTareas />
        </main>
    );
};

export default ContenidoPrincipal;
