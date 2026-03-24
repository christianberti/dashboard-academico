import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'
import './PomodoroTimer.css'

const PomodoroTimer = () => {

    const [pomodoro, setPomodoro] = useState(1500); // 25 min
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && pomodoro > 0) {
            interval = setInterval(() => {
                setPomodoro((prev) => prev - 1);
            }, 1000);
        } else if (pomodoro === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, pomodoro]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <article className='contenedor-timer'>
            <header>
                <h2> Modo Estudio</h2>
            </header>
            <div className='contenido-timer'>
                <p >{formatTime(pomodoro)}</p>
                <div className='botones-timer'>
                    <button className='boton-primario'
                        onClick={() => setIsActive(!isActive)}
                    >
                        {isActive ? 'Pausar' : 'Empezar'}
                    </button>
                    <button className='boton-secundario'
                        onClick={() => { setIsActive(false); setPomodoro(1500); }}
                    >
                        Reiniciar
                    </button>
                </div>
            </div>
        </article>
    )
}

export default PomodoroTimer