import { historialAcademico } from '../data/datosPrueba.js'
import './ContenidoPrincipal.css'
import GraficoProgresoCarrera from './GraficoProgresoCarrera.jsx'
import ListaDeTareas from './ListaDeTareas.jsx'
import PomodoroTimer from './PomodoroTimer.jsx'
import TarjetaMetrica from './TarjetaMetrica.jsx'

const ContenidoPrincipal = () => {

  const promedioGeneral = historialAcademico.reduce((acumulador, materia) => acumulador + materia.nota, 0) / historialAcademico.length

  const metricas = [
    { titulo: 'Promedio General', valor: promedioGeneral.toFixed(2) },
    { titulo: 'Materias Aprobadas', valor: historialAcademico.filter(materia => materia.nota >= 60).length },
    { titulo: 'Finales Pendientes', valor: historialAcademico.filter(materia => materia.final !== "Aprobado").length }
  ]

  return (
    <main className='contenedor-main'>
      <header>
        <h1>Resumen Académico</h1>
      </header>
      <section className='contenedor-metricas'>
        {
          metricas.map((materia) => (
            <article key={materia.titulo}>
              <TarjetaMetrica titulo={materia.titulo} valor={materia.valor} />
            </article>
          ))
        }
      </section>
      <section className='contenedor-grafico'>
        <GraficoProgresoCarrera />
        <ListaDeTareas />
      </section>
      <PomodoroTimer />
    </main>
  )
}

export default ContenidoPrincipal