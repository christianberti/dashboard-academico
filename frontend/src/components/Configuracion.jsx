import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, ShieldAlert, Key, GraduationCap, AlertTriangle } from 'lucide-react';
import './Configuracion.css';

const Configuracion = ({ carrerasUsuario, onCarreraEliminada }) => {
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const cambiarPassword = async (e) => {
        e.preventDefault();
        if (nuevaPassword !== confirmPassword) {
            setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
            return;
        }
        
        setCargando(true);
        const { error } = await supabase.auth.updateUser({ password: nuevaPassword });
        
        if (error) {
            setMensaje({ tipo: 'error', texto: error.message });
        } else {
            setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada correctamente' });
            setNuevaPassword('');
            setConfirmPassword('');
        }
        setCargando(false);
    };

    const eliminarCarrera = async (idCarrera, nombreCarrera) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar la carrera "${nombreCarrera}"? Se borrará TODO tu progreso en sus materias.`);
        if (!confirmacion) return;

        setCargando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Borrar progreso de materias de esta carrera para este usuario
            const { error: errProgreso } = await supabase
                .from('progreso_estudiante')
                .delete()
                .eq('user_id', user.id)
                .filter('id_materia', 'in', (
                    supabase
                    .from('plan_estudios')
                    .select('id')
                    .eq('id_carrera', idCarrera)
                ));
            
            // Nota: El filtro 'in' con subquery directo a veces falla en Supabase client antiguo. 
            // Preferimos traer los IDs primero por seguridad.
            const { data: idsMaterias } = await supabase
                .from('plan_estudios')
                .select('id')
                .eq('id_carrera', idCarrera);
            
            const idsList = idsMaterias.map(m => m.id);

            await supabase
                .from('progreso_estudiante')
                .delete()
                .eq('user_id', user.id)
                .in('id_materia', idsList);

            // 2. Borrar vínculo de carrera
            const { error } = await supabase
                .from('usuarios_carreras')
                .delete()
                .eq('user_id', user.id)
                .eq('id_carrera', idCarrera);

            if (error) throw error;
            
            setMensaje({ tipo: 'exito', texto: `Carrera "${nombreCarrera}" eliminada.` });
            onCarreraEliminada();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: 'Error al eliminar carrera: ' + err.message });
        } finally {
            setCargando(false);
        }
    };

    const eliminarCuenta = async () => {
        const confirm1 = window.confirm("¡ATENCIÓN! ¿Estás COMPLETAMENTE SEGURO de querer eliminar tu cuenta? Esta acción es irreversible y borrará todo tu historial académico.");
        if (!confirm1) return;
        
        const confirm2 = window.prompt("Para confirmar, escribe 'ELIMINAR MI CUENTA' en mayúsculas:");
        if (confirm2 !== "ELIMINAR MI CUENTA") {
            alert("Confirmación incorrecta. Abortando.");
            return;
        }

        setCargando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // Borrar todos los datos vinculados (RLS debería permitirlo)
            await supabase.from('usuarios_carreras').delete().eq('user_id', user.id);
            await supabase.from('progreso_estudiante').delete().eq('user_id', user.id);
            await supabase.from('eventos_examenes').delete().eq('user_id', user.id);
            
            // Cerrar sesión
            await supabase.auth.signOut();
            window.location.reload();
        } catch (err) {
            setMensaje({ tipo: 'error', texto: 'Error al eliminar cuenta: ' + err.message });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="contenedor-configuracion">
            <header className="config-header">
                <h1>Configuración</h1>
                <p>Gestiona tu cuenta y tus carreras</p>
            </header>

            {mensaje.texto && (
                <div className={`alerta-config ${mensaje.tipo}`}>
                    <ShieldAlert size={20} />
                    <span>{mensaje.texto}</span>
                </div>
            )}

            <div className="secciones-config">
                {/* Sección Password */}
                <section className="tarjeta-config">
                    <div className="titulo-seccion-config">
                        <Key size={22} />
                        <h2>Cambiar Contraseña</h2>
                    </div>
                    <form className="form-config" onSubmit={cambiarPassword}>
                        <div className="campo-form">
                            <label>Nueva Contraseña</label>
                            <input 
                                type="password" 
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="campo-form">
                            <label>Confirmar Contraseña</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite la contraseña"
                                required
                            />
                        </div>
                        <button type="submit" className="boton-primario-config" disabled={cargando}>
                            Actualizar Contraseña
                        </button>
                    </form>
                </section>

                {/* Sección Carreras */}
                <section className="tarjeta-config">
                    <div className="titulo-seccion-config">
                        <GraduationCap size={22} />
                        <h2>Mis Carreras</h2>
                    </div>
                    <div className="lista-carreras-config">
                        {carrerasUsuario.map(item => (
                            <div key={item.id_carrera} className="item-carrera-config">
                                <span>{item.carreras.nombre}</span>
                                <button 
                                    className="boton-borrar-carrera"
                                    onClick={() => eliminarCarrera(item.id_carrera, item.carreras.nombre)}
                                    title="Eliminar esta carrera"
                                    disabled={cargando}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Zona de Peligro */}
                <section className="tarjeta-config zona-peligro">
                    <div className="titulo-seccion-config">
                        <AlertTriangle size={22} />
                        <h2>Zona de Peligro</h2>
                    </div>
                    <p>Una vez que eliminas tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
                    <button className="boton-eliminar-cuenta" onClick={eliminarCuenta} disabled={cargando}>
                        Eliminar mi cuenta definitivamente
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Configuracion;
