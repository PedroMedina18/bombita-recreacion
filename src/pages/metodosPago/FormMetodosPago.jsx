import { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { InputsGeneral, InputTextTarea, InputCheckRadio } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { metodoPago } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon.jsx";

function FormMetodoPago() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const renderizado = useRef(0);
    const [errorServer, setErrorServer] = useState("");

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (params.id) {
                get_metodosPago()
            }
            setLoading(false)
            return
        }
    }, [])

    const get_metodosPago = async () => {
        try {
            const respuesta = await metodoPago.get({subDominio:[Number(params.id)]})
            if (respuesta.status !== 200) {
                setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
                return
            }
            if (respuesta.data.status === false) {
                setErrorServer(`${respuesta.data.message}`)
                return
            }
            setErrorServer("")
            const keys = Object.keys(respuesta.data.data);
            keys.forEach(key => {
                setValue(key, respuesta.data.data[`${key}`])
            });

        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorObjet)
        } finally {
            setLoading(false)
        }
    }


    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm();

    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message = params.id ? texts.confirmMessage.confirmEdit : texts.confirmMessage.confirmRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const body = {
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        referencia: data.referencia,
                        capture: data.capture,
                        divisa: data.divisa
                    }
                    alertLoading("Cargando")
                    const res = params.id ? await metodoPago.put(body, { subDominio:[Number(params.id)]}) : await metodoPago.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id ? texts.successMessage.editionMetodoPago : texts.successMessage.registerMetodoPago,
                        useNavigate: { navigate: navigate, direction: "/metodos_pago/" }
                    })
                }

            } catch (error) {
                console.log(error)
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    return (
        <Navbar name={params.id ? texts.pages.editMetodoPago.name : texts.pages.registerMetodoPago.name} descripcion={params.id ? texts.pages.editMetodoPago.description : texts.pages.registerMetodoPago.description} dollar={false}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/metodos_pago/") }}> <IconRowLeft /> Regresar</ButtonSimple>
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
                                <form className="w-100 d-flex flex-column"

                                    onSubmit={onSubmit}>
                                    <InputsGeneral type={"text"} label={`${texts.label.nombre}`} name="nombre" id="nombre" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requireName,
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: texts.inputsMessage.max100,
                                            },
                                            pattern: {
                                                value: pattern.textWithNumber,
                                                message: texts.inputsMessage.invalidName,
                                            },
                                            validate: (value) => {
                                                if (hasLeadingOrTrailingSpace(value)) {
                                                    return texts.inputsMessage.noneSpace
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                        placeholder={texts.placeholder.nameMetodoPago}
                                    />
                                    <span className='fw-light m-0'>Seleccione que Aspectos desea registrar</span>
                                    <InputCheckRadio label={"Referencia"} id={"referencia"} name={"referencia"} form={{ errors, register }}/>
                                    <InputCheckRadio label={"Capture"} id={"capture"} name={"capture"} form={{ errors, register }}/>
                                    <InputCheckRadio label={"Monto en Divisa"} id={"divisa"} name={"divisa"} form={{ errors, register }}/>
                                    <InputTextTarea label={`${texts.label.descripcion}`} name="descripcion" id="descripcion" form={{ errors, register }}
                                        params={{
                                            maxLength: {
                                                value: 300,
                                                message: texts.inputsMessage.max300
                                            },
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requiredDesription,
                                            },
                                            validate: (value) => {
                                                if (hasLeadingOrTrailingSpace(value)) {
                                                    return texts.inputsMessage.noneSpace
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                        placeholder={texts.placeholder.descripcion}
                                    />
                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                                        {params.id? "Guardar" : "Registrar"}
                                    </ButtonSimple>
                                </form>
                            </div>
                        )
            }

            <Toaster />
        </Navbar>
    )
}

export default FormMetodoPago