import { useState, useRef, useEffect } from 'react'
import { IconX, IconHamburgue } from "../Icon"
import "./modal.css"
import { ButtonSimple } from "../button/Button.jsx"


function ModalBase({ children, titulo, state, optionsSucces, opcionsDelete, styles={}}) {
    const [animateState, setAnimateState] = useState("")
    const [estado, setEstado] = state
    const renderizado = useRef(0);
    const [nombreSucces, callbackSucces] = optionsSucces
    const [nombreDelete, callbackDelete] = opcionsDelete
    const {witdh="witdh-lg"} = styles

    useEffect(() => {
        const body = document.querySelector("body")
        // Para evitar el sobre renderizado al cargar el componente
        if (renderizado.current === 1 ||  renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            return
        }
        if (estado) {
            body.setAttribute('style', 'overflow: hidden')
            setAnimateState("in:wipe:right")
        } else {
            body.setAttribute('style', 'overflow: auto')
            setAnimateState("out:wipe:left")
        }
    }, [estado])

    return (
        <div className={`overlay`} transition-style={animateState}
            onClick={(e) => {
                if (e.target.className === "overlay") {
                    setEstado(false)
                    callbackDelete()
                }
            }}>
            <div className='content-modal'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <div className='icon-menu'>
                        <IconHamburgue />
                    </div>
                    <h3 className='h3 m-0 fw-bold'>{titulo}</h3>
                    <button className='button-close' onClick={() => { setEstado(false); callbackDelete() }}>
                        <IconX />
                    </button>
                </div>
                <div className={`body-modal ${witdh}`}>
                    {children}
                </div>
                <div className='d-flex justify-content-end align-items-center mt-2'>
                    <ButtonSimple className="none-border-radius mx-2" onClick={() => { setEstado(false); callbackSucces() }}>
                        {nombreSucces}
                    </ButtonSimple>
                    <ButtonSimple className="none-border-radius mx-2" onClick={() => { setEstado(false); callbackDelete() }}>
                        {nombreDelete}
                    </ButtonSimple>

                </div>
            </div>
        </div>
    )
}

export default ModalBase