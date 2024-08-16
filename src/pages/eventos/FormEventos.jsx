import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { Toaster } from "sonner";
import { toastError } from "../../components/alerts.jsx";
import { servicios, sobrecargos, clientes } from "../../utils/API.jsx";
import { controlErrors } from "../../utils/actions.jsx"
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useFormEventContext } from "../../context/FormEventContext.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import Navbar from "../../components/navbar/Navbar.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import texts from "../../context/text_es.js";

function FormEventos() {
    const navigate = useNavigate();
    const { setServicios, setSobrecargos, setClientes } = useFormEventContext()
    const [loading, setLoading] = useState(true)
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
            const get_servicios = await servicios.get()
            const get_sobrecargos = await sobrecargos.get()
            const get_clientes = await clientes.get()
            controlErrors({ respuesta: get_servicios, constrolError: toastError })
            controlErrors({ respuesta: get_sobrecargos, constrolError: toastError })
            controlErrors({ respuesta: get_clientes, constrolError: toastError })
            setClientes(get_clientes.data.data)
            setServicios(get_servicios.data.data)
            setSobrecargos(get_sobrecargos.data.data)
        } catch (error) {
            console.log(error)
            toastError(texts.inputsMessage.errorSystem)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Navbar name={`${texts.pages.registerEventos.name}`} descripcion={`${texts.pages.registerEventos.description}`}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/tipo_documentos/") }}> <IconRowLeft /> Regresar</ButtonSimple>

            {
                loading ?
                    (
                        <div className="div-main justify-content-center p-4" >
                            <LoaderCircle />
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

export default FormEventos