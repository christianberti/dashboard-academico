import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './LoginAuth.css';

const LoginAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('¡Registro exitoso! Por favor verifica tu email o inicia sesión.');
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <header className="auth-header">
                    <h1>Academic Hub</h1>
                    <p>{isSignUp ? 'Crea tu cuenta para empezar' : 'Bienvenido de nuevo'}</p>
                </header>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleAuth}>
                    <div className="auth-field">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="tu@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="boton-auth" disabled={loading}>
                        {loading ? 'Cargando...' : (isSignUp ? 'Registrarse' : 'Entrar')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                        <button onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? 'Inicia sesión' : 'Regístrate aquí'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginAuth;
