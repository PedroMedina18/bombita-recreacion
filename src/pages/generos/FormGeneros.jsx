import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.jsx';
import { InputsGeneral, InputTextTarea } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { generos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { controlErrors, controlResultPost } from "../../utils/actions.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function FormGeneros() {
    const navigate = useNavigate();
    const params = useParams();
    const renderizado = useRef(0)
    const {getOption} = useAuthContext()
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (params.id) {
                get_genero()
            }
            setLoading(false)
            return
        }
    }, [])

    const get_genero = async () => {
        try {
            const respuesta = await generos.get({ subDominio:[Number(params.id)] })
            const errors = controlErrors({respuesta:respuesta, constrolError:setErrorServer})
            if(errors) return
            setErrorServer("")
            const data = respuesta.data.data
            const keys = Object.keys(data);
            keys.forEach(key => {
                setValue(key, `${data[`${key}`]}`)
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
                    }
                    alertLoading("Cargando")
                    console.log(params.id)
                    const res = params.id ? await generos.put(body, { subDominio:[Number(params.id)]}) : await generos.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id ? texts.successMessage.editionGenero : texts.successMessage.registerGenero,
                        useNavigate: { navigate: navigate, direction: "/generos/" },
                        callbak:()=>{getOption("genero")}
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
        <Navbar name={params.id ? texts.pages.editGenero.name : texts.pages.registerGenero.name} descripcion={params.id ? texts.pages.editGenero.description : texts.pages.registerGenero.description}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/generos/") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                                        placeholder={texts.placeholder.nameGenero}
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
                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                                        {params.id ? "Guardar" : "Registrar"}
                                    </ButtonSimple>
                                </form>
                            </div>
                        )
            }
            <Toaster />
        </Navbar>
    )
}

export default FormGeneros