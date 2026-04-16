import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Plus, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import API_BASE_URL from '../config';
import './ModalArchivos.css';

const ModalArchivos = ({ materia, onClose }) => {
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nombre, setNombre] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetch(`${API_BASE_URL}/gestionar_archivos.php?id_progreso=${materia.id}`)
            .then(res => res.json())
            .then(datos => {
                setArchivos(datos);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error al cargar archivos:", err);
                setCargando(false);
            });
    }, [materia.id]);

    const agregarArchivo = (e) => {
        e.preventDefault();
        if (!nombre || !url) return;

        const nuevo = {
            id_progreso: materia.id,
            nombre_archivo: nombre,
            url_archivo: url,
            tipo_archivo: 'link'
        };

        fetch(`${API_BASE_URL}/gestionar_archivos.php`, {
            method: 'POST',
            body: JSON.stringify(nuevo),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                setArchivos([{ ...nuevo, id: data.id, fecha_subida: new Date().toISOString() }, ...archivos]);
                setNombre('');
                setUrl('');
            }
        })
        .catch(err => console.error("Error al guardar archivo:", err));
    };

    const eliminarArchivo = (id) => {
        fetch(`${API_BASE_URL}/gestionar_archivos.php?id=${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setArchivos(archivos.filter(a => a.id !== id));
        })
        .catch(err => console.error("Error al eliminar archivo:", err));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-archivos" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="modal-titulo">
                        <FileText className="icono-titulo" />
                        <div>
                            <h2>Archivos y Recursos</h2>
                            <p>{materia.nombre}</p>
                        </div>
                    </div>
                    <button className="boton-cerrar" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="modal-cuerpo">
                    <form className="formulario-nuevo-archivo" onSubmit={agregarArchivo}>
                        <input 
                            type="text" 
                            placeholder="Nombre del recurso (ej: Apuntes Unidad 1)" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <input 
                            type="url" 
                            placeholder="URL del archivo (Drive, Dropbox, etc.)" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                        <button type="submit" className="boton-subir">
                            <Plus size={20} />
                            <span>Agregar</span>
                        </button>
                    </form>

                    <div className="lista-archivos">
                        {cargando ? (
                            <p className="mensaje-estado">Cargando recursos...</p>
                        ) : archivos.length === 0 ? (
                            <div className="vacio-container">
                                <p>No hay archivos aún. ¡Agrega el primero!</p>
                            </div>
                        ) : (
                            archivos.map(archivo => (
                                <div key={archivo.id} className="item-archivo">
                                    <div className="info-archivo">
                                        <LinkIcon size={18} className="icono-link" />
                                        <div className="texto-archivo">
                                            <strong>{archivo.nombre_archivo}</strong>
                                            <span>Subido el {new Date(archivo.fecha_subida).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="acciones-archivo">
                                        <a 
                                            href={archivo.url_archivo} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="boton-abrir"
                                            title="Abrir recurso"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                        <button 
                                            className="boton-eliminar-archivo"
                                            onClick={() => eliminarArchivo(archivo.id)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalArchivos;
