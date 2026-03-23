import './NavegacionLateral.css'

const NavegacionLateral = () => {

    const secciones = ["Resumen", "Materias", "Estadísticas", "Configuración"]

    return (
        <aside className='barra-lateral'>
            <header className="encabezado-nav">
                <h2>Informática UNLP</h2>
            </header>

            <nav>
                <ul className="lista-nav">
                    {secciones.map((registro) => (
                        <li key={registro} className="item-nav">
                            <a href="#" className="materia">{registro}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}

export default NavegacionLateral