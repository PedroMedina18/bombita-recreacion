import { useState, useRef, useEffect } from 'react'
import { IconX, IconHamburgue } from "../Icon"
import "./modal.css"
import { ButtonSimple } from "../button/Button.jsx"
import logo_bombita from "../../assets/logo-bombita.png"

function ModalBase({
    children,
    titulo,
    state,
    logo = false,
    optionsSucces = [],
    opcionsDelete = [],
    disabledTrue = false,
    iconHamburgue = true,
    buttonSucces = true,
    buttonDelete = true,
    styles = {}
}) {
    const [animateState, setAnimateState] = useState("")
    const [estado, setEstado] = state
    const renderizado = useRef(0);
    const [nombreSucces = "Aceptar", callbackSucces = ()=>{}, buttonSuccesStyle = "none-border-radius mx-3 px-4 py-3"] = optionsSucces
    const [nombreDelete = "Cerrar", callbackDelete = ()=>{}, buttonDeleteStyle = "none-border-radius mx-3 px-4 py-3"] = opcionsDelete
    const { witdh = "witdh-lg",  witdh_content = "w-80"} = styles

    useEffect(() => {
        const body = document.querySelector("body")
        // Para evitar el sobre renderizado al cargar el componente
        if (renderizado.current === 1 || renderizado.current === 0) {
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
            <div className={`content-modal ${witdh_content}`}>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    {
                        iconHamburgue &&
                        <div className='icon-menu'>
                            <IconHamburgue />
                        </div>
                    }
                    {
                        logo &&
                        <img src={logo_bombita} alt="Logo" className='img-logo'/>
                    }
                    <h3 className='h3 m-0 fw-bold text-center'>{titulo}</h3>
                    <button className='button-close' onClick={() => { setEstado(false); callbackDelete() }}>
                        <IconX />
                    </button>
                </div>
                <div className={`body-modal ${witdh}`}>
                    {children}
                </div>
                <div className='d-flex justify-content-center justify-content-md-end align-items-center mt-2'>
                    {
                        buttonSucces &&
                        <ButtonSimple className={`${buttonSuccesStyle}`} onClick={() => { setEstado(false); callbackSucces() }} disabled={disabledTrue}>
                            {nombreSucces}
                        </ButtonSimple>
                    }
                    {

                        buttonDelete &&
                        <ButtonSimple className={`${buttonDeleteStyle}`} onClick={() => { setEstado(false); callbackDelete() }}>
                            {nombreDelete}
                        </ButtonSimple>
                    }
                </div>
            </div>
        </div>
    )
}

export default ModalBase