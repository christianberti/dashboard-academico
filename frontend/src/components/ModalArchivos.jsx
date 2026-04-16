import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Plus, Trash2, FileText, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './ModalArchivos.css';

const ModalArchivos = ({ materia, onClose }) => {
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nombre, setNombre] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        const cargarArchivos = async () => {
            const { data, error } = await supabase
                .from('archivos_materia')
                .select('*')
                .eq('id_progreso', materia.id)
                .order('fecha_subida', { ascending: false });

            if (error) {
                console.error("Error al cargar archivos:", error);
            } else {
                setArchivos(data);
            }
            setCargando(false);
        };

        cargarArchivos();
    }, [materia.id]);

    const agregarArchivo = async (e) => {
        e.preventDefault();
        if (!nombre || !url) return;

        const { data, error } = await supabase
            .from('archivos_materia')
            .insert([{
                id_progreso: materia.id,
                nombre_archivo: nombre,
                url_archivo: url,
                tipo_archivo: 'link'
            }])
            .select();

        if (error) {
            console.error("Error al guardar archivo:", error);
        } else if (data) {
            setArchivos([data[0], ...archivos]);
            setNombre('');
            setUrl('');
        }
    };

    const eliminarArchivo = async (id) => {
        const { error } = await supabase
            .from('archivos_materia')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error al eliminar archivo:", error);
        } else {
            setArchivos(archivos.filter(a => a.id !== id));
        }
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
