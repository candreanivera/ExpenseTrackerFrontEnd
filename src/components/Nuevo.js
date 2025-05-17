import React, {useState} from 'react'

export default function Nuevo() {

  //value initiali<ed with '', since the input is text and starts empty
  const [text, setText] = useState('')
  const [updated, setUpdated] = useState('')
  const [text2, setText2] = useState('')
  const [text3, setText3] = useState('')
  const [text4, setText4] = useState('')

  //event.target.value is what it's written on the input
  const textOnChange = (event) => {
    setText(event.target.value)
  }
  
  const buttonOnClick = () => {
    setUpdated(text)
  }

  const mostrarText2 = (evento) => {
    setText2(evento.target.value);
  }

  const mostrarText4 = (evento) => {
    setText4(evento.target.value);
  }

  return (
    <div style={{ marginTop: '20px' }}>
      Oli, soy el nuevo componente
      <div>
      <input type="text" value={text} onChange={textOnChange} />
      </div>
      <div>
      <input type="text" value={text} onChange={event => setText(event.target.value)} />
      </div>
      <button onClick={buttonOnClick} >Update</button>
      <p>Input Text: {text}</p>
      <p>Updated Text: {updated}</p>
      <br />
      <div>
        <input type="text" value={text2} onChange = {mostrarText2}/>
        <p>{text2}</p>
      </div>
      <br />
      <div>
        <input type="text" value={text3} onChange = {event => setText3((event.target.value).toUpperCase())}/>
        <p>{text3}</p>
      </div>
      <br />
      <div style={{ marginBottom: '200px' }}>
        <input type="text" value={text4} onChange = {mostrarText4}/>
        {text4.length > 0 && (
          <>
          <p>{text4}</p>
          <p>La cantidad de caracteres escritos fue: {text4.length}</p>
          </>
        )}
      </div>
    </div>
  )
}

