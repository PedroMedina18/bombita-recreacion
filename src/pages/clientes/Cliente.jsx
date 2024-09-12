import { useState, useEffect, useRef } from 'react';
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { clientes } from "../../utils/API.jsx";
import { formatoId, formatDateWithTime12Hour, normalizeDecimalNumber } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { controlErrors } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { IconRowLeft, IconUserCircleSolid } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import {TableEventos} from "../eventos/Eventos.jsx"

function Cliente() {
    const [errorServer, setErrorServer] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const renderizado = useRef(0);
    const params = useParams();

    useEffect(() => {
        document.title = "Cliente - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            get_data()
            return
        }
    }, [])

    const get_data = async () => {
        try {
            const cliente = await clientes.get({ subDominio: [Number(params.id)] })
            if (controlErrors({ respuesta: cliente, constrolError: setErrorServer })) return
            setData(cliente.data.data)
        } catch (error) {
            setErrorServer(texts.errorMessage.errorSystem)
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Navbar name={texts.pages.cliente.name} descripcion={texts.pages.cliente.description}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/clientes/") }}> <IconRowLeft /> Regresar</ButtonSimple>
            {
                loading ?
                    (
                        <div className="div-main justify-content-center p-4">
                            <LoaderCircle />
                        </div>
                    )
                    :
                    errorServer ?
                        (
                            <div className="div-main justify-content-center p-4">
                                <ErrorSystem error={errorServer} />
                            </div>
                        )
                        :
                        (
                            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                                <h3 className="h2 fw-bold">{`Cliente N° ${formatoId(data.id)}`}</h3>
                                <div className="w-100 d-flex flex-column flex-md-row my-3">
                                    <div className="w-100 w-md-40 d-flex  flex-column">
                                        <div className={`lg section-perfil d-flex align-items-center justify-content-center mt-2 mx-auto ${data.img_perfil ? "section-perfil-img" : ""}`}>

                                            <IconUserCircleSolid />

                                        </div>
                                    </div>
                                    <div className="w-100 w-md-60 d-flex flex-column">
                                        <div className="w-100 d-flex flex-wrap justify-content-around justify-content-md-between align-items-center">
                                            <div className="my-1 my-md-2 d-flex flex-column">
                                                <strong className="fs-5-5">Nombre:</strong>
                                                <p className="m-0 fs-5-5 mb-1">{`${data.nombres} ${data.apellidos}`}</p>
                                            </div>
                                            <div className="my-1 my-md-2 d-flex flex-column">
                                                <strong className="fs-5-5">Documento:</strong>
                                                <p className="m-0 fs-5-5 mb-1">{`${data.tipo_documento}-${data.numero_documento}`}</p>
                                            </div>
                                        </div>
                                        <div className="w-100 d-flex flex-wrap justify-content-around justify-content-md-between align-items-center">
                                            <div className="my-1 my-md-2 d-flex flex-column">
                                                <strong className="fs-5-5">Tel. Principal:</strong>
                                                <p className="m-0 fs-5-5 mb-1">{`${data.telefono_principal}`}</p>
                                            </div>
                                            <div className="my-1 my-md-2 d-flex flex-column">
                                                <strong className="fs-5-5">Tel. Secundario:</strong>
                                                <p className="m-0 fs-5-5 mb-1">{`${data.telefono_secundario}`}</p>
                                            </div>
                                            <div className="my-1 my-md-2 d-flex flex-column">
                                                <strong className="fs-5-5">Correo:</strong>
                                                <p className="m-0 fs-5-5 mb-1">{data.correo}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <TableEventos calendar={false} desabilititIcon={false} moneyIcon={false}
                                recreadoresIcon={false} filtrosTable={{cliente:Number(params.id)}}
                                optionsRegister={false} optionsSerch={false}/>
                            </div>
                        )
            }
            <Toaster />
        </Navbar>
    )
}

export default Cliente