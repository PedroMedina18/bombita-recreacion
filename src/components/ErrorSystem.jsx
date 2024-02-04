import React from 'react'
import errorServidor from "../assets/error-servidor.svg"

function ErrorSystem({error}) {
    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center overflow-hidden ">
            <img src={errorServidor} alt="Erorr System"  className='img-error'/>
            <h3 className="h1 mt-2 fw-bold">{error}</h3>
        </div>
    )
}

export default ErrorSystem