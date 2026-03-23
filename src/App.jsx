import './App.css'
import ContenidoPrincipal from './components/ContenidoPrincipal'
import NavegacionLateral from './components/NavegacionLateral'

function App() {
  
  return (
    <div className="contenedor-principal">
      <NavegacionLateral/>
      <ContenidoPrincipal/>
    </div>
  )
}

export default App
