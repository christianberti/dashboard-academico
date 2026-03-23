import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from 'recharts';
import { historialAcademico } from '../data/datosPrueba';
import './GraficoProgresoCarrera.css';

const GraficoProgresoCarrera = () => {
    
    // --- Lógica de Negocio (Igual que antes) ---
    const TOTAL_MATERIAS_CARRERA = 24; // Puedes ajustar este número según tu carrera
    const totalAprobadas = historialAcademico ? historialAcademico.length : 0;
    const materiasTotales = TOTAL_MATERIAS_CARRERA || 24;
    
    // Agregamos materias 'En Curso' dummy para la visualización visual
    const totalEnCurso = 3; 
    const totalPendientes = materiasTotales - totalAprobadas - totalEnCurso;
    const porcentajeAvance = Math.round((totalAprobadas / materiasTotales) * 100);

    // --- Estructura de Datos con 3 Categorías y Tus Colores (Igual) ---
    const dataProgreso = [
        { 
            name: 'Aprobadas', 
            value: totalAprobadas, 
            fill: 'var(--color-primario)'
        },
        { 
            name: 'En Curso', 
            value: totalEnCurso, 
            fill: 'var(--color-secundario)'
        },
        { 
            name: 'Pendientes', 
            value: totalPendientes, 
            fill: '#818181'
        }
    ];

    return (
        <article className="contenedor-grafico-progreso">
            <header className="encabezado-grafico">
                <h2>Resumen de Materias</h2>
            </header>

            {/* Ajustamos el alto para el círculo completo */}
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={dataProgreso}
                        cx="50%" // Centro horizontal
                        cy="50%" // CENTRO VERTICAL CORREGIDO para círculo completo
                        startAngle={90} // Comienza arriba (12 en punto) para mejor lectura
                        endAngle={-270} // Da la vuelta completa de 360 grados
                        innerRadius={60} 
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {/* NOTA: Ya no hay Label en el centro, queda vacío tal cual lo pediste */}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>

            {/* --- 2. Mensaje Final estructurado (Igual que antes, debajo) --- */}
            <p className="mensaje-resumen-final">
                Has completado el <span className="porcentaje-resaltado">{porcentajeAvance}%</span> de tu plan de estudios.
            </p>
        </article>
    );
};

export default GraficoProgresoCarrera;