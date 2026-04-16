import { useState } from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import './CalendarioExamenes.css';

const CalendarioExamenes = ({ materias, alAgregarExamen }) => {
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');

    const hoy = new Date().toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre || !fecha) return;

        const nuevoExamen = {
            id: Date.now(),
            nombre,
            fecha,
            completado: false
        };

        alAgregarExamen(nuevoExamen);
        setNombre('');
        setFecha('');
    };

    return (
        <article className="contenedor-calendario-examenes">
            <header>
                <div className="titulo-header">
                    <CalendarIcon size={20} />
                    <h2>Agendar Examen</h2>
                </div>
            </header>
            <form onSubmit={handleSubmit} className="formulario-examen">
                <div className="grupo-input">
                    <label>Materia</label>
                    <select
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="select-materia"
                    >
                        <option value="" disabled>Seleccionar materia...</option>
                        {materias.map((m) => (
                            <option key={m.id} value={m.nombre}>
                                {m.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grupo-input">
                    <label>Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        min={hoy}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="boton-agregar-examen">
                    <Plus size={18} />
                    <span>Agendar</span>
                </button>
            </form>
        </article>
    );
};

export default CalendarioExamenes;
