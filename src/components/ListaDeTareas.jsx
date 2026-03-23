import { useState } from 'react'
import './ListaDeTareas.css'
import { Check, CheckCircle2, Plus, Trash2 } from 'lucide-react';

const ListaDeTareas = () => {

    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        if (todos.some(t => t.text.toLowerCase() === newTodo.toLowerCase())) return;
      
        setTodos([{ id: Date.now(), text: newTodo, completed: false}, ...todos]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <article className="contenedor-lista-tareas">
            <header>
                <h2>Lista de Tareas</h2>
            </header>
            <form onSubmit={addTodo} className='formulario-tareas'>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Nueva tarea..."
                    className='input-tarea'
                />
                <button type="submit" className='boton-agregar'>
                    <Plus size={20} />
                </button>
            </form>
            <div className='lista-items-tareas'>
                {todos.map(todo => (
                    <div key={todo.id} className='item-tarea'>
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`checkbox-tarea ${todo.completed ? 'checkbox-tarea-completado' : ''
                                }`}
                        >
                            {todo.completed && <Check size={14}/>}
                        </button>
                        <span className={`texto-tarea ${todo.completed ? 'texto-tarea-completado' : ''}`}>
                            {todo.text}
                        </span>
                        <button
                            onClick={() => deleteTodo(todo.id)}
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