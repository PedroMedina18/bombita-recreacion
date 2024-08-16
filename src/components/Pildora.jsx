import React from 'react'

function Pildora({contenido, color="bg-danger"}) {
  return (
    <span className={`badge p-2 fs-7 bg-success ${color}`}>{contenido}</span>
  )
}

export default Pildora