import React from 'react'


export default function Saludo(props) {
  
  
  return (
    <div>
      <span>Good morning,  <b>{props.name}!</b></span>
      <br />
      <span>Current Month: {props.month}</span>
    </div>
  );
}
