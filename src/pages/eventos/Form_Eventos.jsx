import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { LoaderCircle } from "../../components/loader/Loader";
import { Toaster } from "sonner";
import { tipo_documentos, servicios, sobrecargos, clientes } from "../../utils/API.jsx";
import { verifyOptionsSelect} from "../../utils/actions.jsx"
import Navbar from "../../components/navbar/Navbar"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import { FormEventContextProvider, useFormEventContext } from "../../context/FormEventContext.jsx";

function Form_Eventos() {
    const { setTipoDocumentos, setServicios, setSobrecargos, setClientes } = useFormEventContext()
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const renderizado = useRef(0)

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getData()
            return
        }
    }, [])

    // *funcion para buscar los tipos de documentos y los cargos
    const getData = async () => {
        try {
            const get_tipo_documentos = await tipo_documentos.get({})
            const get_servicios = await servicios.get({})
            const get_sobrecargos = await sobrecargos.get({})
            const get_clientes = await clientes.get({})
            verifyOptionsSelect({
                respuesta: get_tipo_documentos,
                setError: setErrorServer,
                setOptions: setTipoDocumentos
            })
            verifyOptionsSelect({
                respuesta: get_clientes,
                setError: setErrorServer,
                setOptions: setClientes
            })
            setServicios(get_servicios.data.data)
            setSobrecargos(get_sobrecargos.data.data)
        } catch (error) {
            console.log(error)
            setErrorServer(texts.inputsMessage.errorSystem)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Navbar name={`${texts.pages.registerEventos.name}`} descripcion={`${texts.pages.registerEventos.description}`}>
                {
                    loading ?
                        (
                            <div className="div-main justify-content-center p-4" >
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
                                //* Sección Principal

                                <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                                    <Outlet />
                                </div>
                            )
                }
                <Toaster />
        </Navbar >
    )
}

export default Form_Eventos