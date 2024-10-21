import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { InputsGeneral, InputTextTarea, MoneyInput } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { sobrecostos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { controlResultPost } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import Swal from 'sweetalert2';
import pattern from "../../context/pattern.js";

function FormSobrecostos() {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(true)
    const renderizado = useRef(0)
    const [errorServer, setErrorServer] = useState("")

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (params.id) {
                get_sobrecosto()
            }
            setLoading(false)
            return
        }
    }, [])

    const get_sobrecosto = async () => {
        try {
            const respuesta = await sobrecostos.get({subDominio:[Number(params.id)]})
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
                setValue(key, `${respuesta.data.data[`${key}`]}`)
            });
            setValue("monto", `${Number(respuesta.data.data.monto).toFixed(2)}`)
        } catch (error) {
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
    } = useForm()

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
                        monto: parseFloat(data.monto),
                    }
                    alertLoading("Cargando")
                    const res = params.id ? await sobrecostos.put(body, { subDominio:[Number(params.id)]}) : await sobrecostos.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id ? texts.successMessage.editionSobrecosto : texts.successMessage.registerSobrecosto,
                        useNavigate: { navigate: navigate, direction: "/sobrecostos/" }
                    })
                }
            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )
    return (
        <Navbar name={`${params.id ? texts.pages.editSobrecosto.name : texts.pages.registerSobrecostos.name}`} descripcion={`${params.id ? texts.pages.editSobrecosto.description : texts.pages.registerSobrecostos.description}`}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/sobrecostos/") }}><IconRowLeft /> Regresar</ButtonSimple>

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
                                                message: texts.inputsMessage.requiredName,
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: texts.inputsMessage.max100
                                            },
                                            minLength: {
                                                value: 3,
                                                message: texts.inputsMessage.min3,
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
                                        placeholder={texts.placeholder.nameSobrecostos}
                                    />
                                    <InputTextTarea label={`${texts.label.descripcion}`} name="descripcion" id="descripcion" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requiredDesription,
                                            },
                                            maxLength: {
                                                value: 300,
                                                message: texts.inputsMessage.max300
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
                                    <MoneyInput
                                        label={texts.label.monto}
                                        name="monto"
                                        id="monto"
                                        form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requiredMonto,
                                            },
                                            validate: (e) => {
                                                if (e <= 0) {
                                                    return texts.inputsMessage.minMonto;
                                                } else {
                                                    return true;
                                                }
                                            },
                                        }}
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

export default FormSobrecostos