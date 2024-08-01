import React from 'react'
import './otros.css'

export function LineDescription({nombre, precio, dolar, fs=6, ...props}) {
    return (
        <div className='line-description' {...props}>
            <strong className={`fs-${fs}`}>{nombre}</strong>
            <p>{precio.toFixed(2)} $</p>
            <p>{(precio * dolar).toFixed(2)} Bs.S</p>
        </div>
    )
}

