import React from 'react'
import errorServidor from "../../assets/error-servidor.svg"
import "./error.css"



// Componenete de Error al Consultar la API
function ErrorSystem({error}) {
    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center overflow-hidden ">
            <img src={errorServidor} alt="Erorr System"  className='img-error'/>
            <p className="h1 mt-2 fw-bold text-center">{error}</p>
        </div>
    )
}

export default ErrorSystem