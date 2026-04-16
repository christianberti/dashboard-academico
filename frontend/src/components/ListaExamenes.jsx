import { Trash2, Edit2, CheckCircle, Clock } from 'lucide-react';
import './ListaExamenes.css';

const ListaExamenes = ({ examenes, alEliminar, alMarcarCompletado, alEditar }) => {
    
    if (examenes.length === 0) return null;

    const formatearFecha = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha.toLocaleDateString('es-AR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const esProximo = (fechaStr) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fecha = new Date(fechaStr + 'T00:00:00');
        return fecha >= hoy;
    };

    return (
        <section className="contenedor-lista-examenes">
            <header className="header-examenes">
                <div className="titulo-seccion-examenes">
                    <Clock size={24} />
                    <h2>Próximos Exámenes</h2>
                </div>
                <span className="conteo-examenes">{examenes.filter(e => !e.completado).length} Pendientes</span>
            </header>
            
            <div className="grilla-examenes">
                {examenes.map((examen) => (
                    <div key={examen.id} className={`tarjeta-examen ${examen.completado ? 'examen-completado' : ''} ${!esProximo(examen.fecha) && !examen.completado ? 'examen-vencido' : ''}`}>
                        <div className="info-examen">
                            <span className="fecha-examen">{formatearFecha(examen.fecha)}</span>
                            <h3>{examen.nombre}</h3>
                        </div>
                        
                        <div className="acciones-examen">
                            <button 
                                onClick={() => alMarcarCompletado(examen.id)}
                                className={`boton-examen-accion check ${examen.completado ? 'activo' : ''}`}
                            >
                                <CheckCircle size={16} />
                                <span>{examen.completado ? 'Reabrir' : 'Completar'}</span>
                            </button>
                            <button 
                                onClick={() => alEditar(examen)}
                                className="boton-examen-accion edit"
                            >
                                <Edit2 size={16} />
                                <span>Editar</span>
                            </button>
                            <button 
                                onClick={() => alEliminar(examen.id)}
                                className="boton-examen-accion delete"
                            >
                                <Trash2 size={16} />
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ListaExamenes;
