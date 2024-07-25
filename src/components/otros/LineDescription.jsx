import React from 'react'
import './otros.css'

export function LineDescription({nombre, precio, dolar, fs=6}) {
    return (
        <div className='line-description'>
            <strong className={`fs-${fs}`}>{nombre}</strong>
            <p>{precio} $</p>
            <p>{(precio * dolar).toFixed(2)} Bs.S</p>
        </div>
    )
}

