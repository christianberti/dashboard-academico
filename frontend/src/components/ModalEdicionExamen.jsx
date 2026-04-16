import React, { useState } from 'react';
import { X, Calendar, BookOpen, Save } from 'lucide-react';
import './ModalEdicionExamen.css';

const ModalEdicionExamen = ({ examen, materiasDisponibles, alCerrar, alGuardar }) => {
    const [nombre, setNombre] = useState(examen.nombre);
    const [fecha, setFecha] = useState(examen.fecha);

    const handleSubmit = (e) => {
        e.preventDefault();
        alGuardar({ ...examen, nombre, fecha });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-edicion-examen" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-titulo">
                        <Calendar className="icono-titulo" />
                        <div>
                            <h2>Editar Examen</h2>
                            <p>Modifica los detalles del evento</p>
                        </div>
                    </div>
                    <button className="boton-cerrar" onClick={alCerrar}>
                        <X size={24} />
                    </button>
                </header>

                <form className="formulario-edicion-examen" onSubmit={handleSubmit}>
                    <div className="campo-formulario">
                        <label><BookOpen size={16} /> Materia</label>
                        <select 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        >
                            {materiasDisponibles.map(m => (
                                <option key={m.id} value={m.nombre}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-formulario">
                        <label><Calendar size={16} /> Fecha</label>
                        <input 
                            type="date" 
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="boton-secundario" onClick={alCerrar}>Cancelar</button>
                        <button type="submit" className="boton-primario">
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default ModalEdicionExamen;
