import { useEffect, useState } from 'react'
import './ListaDeTareas.css'
import { Check, CheckCircle2, Plus, Trash2 } from 'lucide-react';

const ListaDeTareas = () => {

    const [tareas, setTareas] = useState(localStorage.getItem('tareas') ? JSON.parse(localStorage.getItem('tareas')) : []);
    const [nuevaTarea, setNuevaTarea] = useState('');

    useEffect(() => {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    }, [tareas]);

    const agregarTarea = (e) => {
        e.preventDefault();
        if (!nuevaTarea.trim()) return;
        
        // Evitar duplicados
        if (tareas.some(t => t.texto.toLowerCase() === nuevaTarea.toLowerCase())) return;

        const tareaNueva = { 
            id: Date.now(), 
            texto: nuevaTarea, 
            completada: false 
        };

        setTareas([...tareas, tareaNueva]);
        setNuevaTarea('');
    };

    const toggleTarea = (id) => {
        setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
    };

    const eliminarTarea  = (id) => {
        setTareas(tareas.filter(t => t.id !== id));
    };

    return (
        <article className="contenedor-lista-tareas">
            <header>
                <h2>Lista de Tareas</h2>
            </header>
            <form onSubmit={agregarTarea} className='formulario-tareas'>
                <input
                    type="text"
                    value={nuevaTarea}
                    onChange={(e) => setNuevaTarea(e.target.value)}
                    placeholder="Nueva tarea..."
                    className='input-tarea'
                />
                <button type="submit" className='boton-agregar'>
                    <Plus size={20} />
                </button>
            </form>
            <div className='lista-items-tareas'>
                {tareas.map(tarea => (
                    <div key={tarea.id} className='item-tarea'>
                        <button
                            onClick={() => toggleTarea(tarea.id)}
                            className={`checkbox-tarea ${tarea.completada ? 'checkbox-tarea-completado' : ''
                                }`}
                        >
                            {tarea.completada && <Check size={14}/>}
                        </button>
                        <span className={`texto-tarea ${tarea.completada ? 'texto-tarea-completado' : ''}`}>
                            {tarea.texto}
                        </span>
                        <button
                            onClick={() => eliminarTarea(tarea.id)}
                            className='boton-eliminar'
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </article>
    )
}

export default ListaDeTareas