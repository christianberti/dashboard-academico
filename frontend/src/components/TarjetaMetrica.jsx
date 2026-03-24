import './TarjetaMetrica.css'

const TarjetaMetrica = ({titulo, valor}) => {
  return (
    <article className='contenedor-tarjeta'>
      <h4>{titulo}</h4>
      <p><strong>{valor}</strong></p>
    </article>
  )
}

export default TarjetaMetrica