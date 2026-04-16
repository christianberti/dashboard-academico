import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Check, X } from 'lucide-react';
import './SelectorCarrera.css';

const SelectorCarrera = ({ onFinished, alCerrar, carrerasYaInscrito = [] }) => {
    const [carreras, setCarreras] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        const traerCarreras = async () => {
            const { data, error } = await supabase
                .from('carreras')
                .select('*')
                .order('id', { ascending: true });
            
            if (error) console.error("Error al traer carreras:", error);
            else {
                // Filtrar las que ya tiene inscritas
                const filtradas = data.filter(c => !carrerasYaInscrito.includes(c.id));
                setCarreras(filtradas);
            }
            setCargando(false);
        };
        traerCarreras();
    }, [carrerasYaInscrito]);

    const toggleCarrera = (id) => {
        if (seleccionadas.includes(id)) {
            setSeleccionadas(seleccionadas.filter(item => item !== id));
        } else {
            setSeleccionadas([...seleccionadas, id]);
        }
    };

    const confirmarSeleccion = async () => {
        if (seleccionadas.length === 0) return;
        setGuardando(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            for (const idCarrera of seleccionadas) {
                // 1. Vincular usuario con carrera
                const { error: errorVinculo } = await supabase
                    .from('usuarios_carreras')
                    .insert([{ 
                        user_id: user.id, 
                        id_carrera: idCarrera,
                        es_activa: idCarrera === seleccionadas[0] // La primera será la activa por defecto
                    }]);
                
                if (errorVinculo && errorVinculo.code !== '23505') {
                    throw errorVinculo;
                }

                // 2. Inicializar progreso (traer materias del plan)
                const { data: materiasPlan, error: errorPlan } = await supabase
                    .from('plan_estudios')
                    .select('id')
                    .eq('id_carrera', idCarrera);
                
                if (errorPlan) throw errorPlan;

                if (materiasPlan && materiasPlan.length > 0) {
                    const registrosProgreso = materiasPlan.map(mp => ({
                        id_materia: mp.id,
                        user_id: user.id,
                        estado: 'Pendiente'
                    }));

                    const { error: errorProgreso } = await supabase
                        .from('progreso_estudiante')
                        .insert(registrosProgreso);
                    
                    if (errorProgreso) console.warn("Aviso:", errorProgreso.message);
                }
            }

            onFinished();
        } catch (err) {
            console.error("Error al configurar carreras:", err);
            alert("Error al configurar tus carreras.");
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return null;

    return (
        <div className="selector-carrera-overlay">
            <div className="selector-carrera-card">
                <header className="selector-header">
                    {carrerasYaInscrito.length > 0 && (
                        <div className="contenedor-cerrar">
                            <button className="boton-cerrar-selector" onClick={alCerrar}>
                                <X size={24} />
                            </button>
                        </div>
                    )}
                    <h2>{carrerasYaInscrito.length > 0 ? 'Inscribirse en otra carrera' : '¿Qué estás estudiando?'}</h2>
                    <p>Selecciona las carreras que estás cursando en la facultad.</p>
                </header>

                <div className="lista-carreras-grid">
                    {carreras.length === 0 ? (
                        <p className="mensaje-vacio">Ya estás inscrito en todas las carreras disponibles.</p>
                    ) : (
                        carreras.map((carrera) => (
                            <div 
                                key={carrera.id} 
                                className={`opcion-carrera ${seleccionadas.includes(carrera.id) ? 'seleccionada' : ''}`}
                                onClick={() => toggleCarrera(carrera.id)}
                            >
                                <span>{carrera.nombre}</span>
                                {seleccionadas.includes(carrera.id) && <Check size={20} color="var(--color-primario)" />}
                            </div>
                        ))
                    )}
                </div>

                <footer className="selector-footer">
                    {carreras.length > 0 && (
                        <>
                            <p className="info-seleccion">
                                {seleccionadas.length} carrera(s) seleccionada(s)
                            </p>
                            <button 
                                className="boton-confirmar-carrera" 
                                onClick={confirmarSeleccion}
                                disabled={seleccionadas.length === 0 || guardando}
                            >
                                {guardando ? 'Configurando...' : 'Confirmar Inscripción'}
                            </button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default SelectorCarrera;
