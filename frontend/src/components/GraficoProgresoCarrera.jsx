import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from 'recharts';
import './GraficoProgresoCarrera.css';

const GraficoProgresoCarrera = ({datosMaterias}) => {
    
    const TOTAL_MATERIAS_CARRERA = 24;

    if (!datosMaterias || datosMaterias.length === 0) {
        return <p>Cargando gráfico...</p>;
    }

    const aprobadas = datosMaterias.filter(m => m.estado === 'Aprobada').length;
    const enCurso = datosMaterias.filter(m => m.estado === 'En Curso').length;
    const pendientes = TOTAL_MATERIAS_CARRERA - aprobadas - enCurso;
    const porcentajeAvance = Math.round((aprobadas / TOTAL_MATERIAS_CARRERA) * 100);

    const dataProgreso = [
        { 
            name: 'Aprobadas', 
            value: aprobadas, 
            fill: '#059669' // var(--color-exito)
        },
        { 
            name: 'En Curso', 
            value: enCurso, 
            fill: '#0284c7' // var(--color-info)
        },
        { 
            name: 'Pendientes', 
            value: pendientes, 
            fill: '#94a3b8' // var(--color-texto-secundario)
        }
    ];

    return (
        <article className="contenedor-grafico-progreso">
            <header className="encabezado-grafico">
                <h2>Resumen de Materias</h2>
            </header>

            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={dataProgreso}
                        cx="50%" 
                        cy="50%"
                        startAngle={90} 
                        endAngle={-270}
                        innerRadius={60} 
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>

            <p className="mensaje-resumen-final">
                Has completado el <span className="porcentaje-resaltado">{porcentajeAvance}%</span> de tu plan de estudios.
            </p>
        </article>
    );
};

export default GraficoProgresoCarrera;