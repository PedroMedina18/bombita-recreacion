import React from 'react'

function Pildora({contenido, color="bg-danger", className="p-0 fs-7"}) {
  return (
    <span className={`badge ${className}  bg-success ${color}`}>{contenido}</span>
  )
}

export default Pildora