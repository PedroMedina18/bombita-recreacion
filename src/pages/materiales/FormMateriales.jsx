import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { InputsGeneral, InputTextTarea } from "../../components/input/Inputs.jsx";
import { useAuthContext } from '../../context/AuthContext.jsx';
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { materiales } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { controlErrors ,controlResultPost } from "../../utils/actions.jsx";
import { Toaster } from "sonner";
import { IconRowLeft } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function FormMateriales() {
    const navigate = useNavigate();
    const params = useParams();
    const renderizado = useRef(0);
    const [loading, setLoading] = useState(true);
    const {getOption} = useAuthContext()
    const [errorServer, setErrorServer] = useState("")

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (params.id) {
                get_materiales()
            }
            setLoading(false)
            return
        }
    }, [])

    const get_materiales = async () => {
        try {
            const respuesta = await materiales.get({subDominio:[Number(params.id)]})
            const errors = controlErrors({respuesta: respuesta, constrolError:setErrorServer})
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
    } = useForm()

    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message = params.id ? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const body = {
                        nombre: data.nombre,
                        total: Number(data.total),
                        descripcion: data.descripcion,
                    }
                    alertLoading("Cargando")
                    const res = params.id ? await materiales.put(body, { subDominio:[Number(params.id)]}) : await materiales.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id ? texts.successMessage.editionMaterial : texts.successMessage.registerMaterial,
                        useNavigate: { navigate: navigate, direction: "/materiales/" },
                        callbak:()=>{getOption("material")}
                    })
                }
            } catch (error) {
                console.log(error)
                Swal.close()
                toastError(texts.errorMessage.errorConexion,)
            }
        }
    )
    return (
        <Navbar name={params.id ? texts.pages.editMaterial.name : texts.pages.registerMaterial.name} descripcion={params.id ? texts.pages.editMaterial.description : texts.pages.registerMaterial.description}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/materiales/") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                                    <InputsGeneral type={"text"} label={texts.label.nombre} name="nombre" id="nombre" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requireName
                                            },
                                            maxLength: {
                                                value: 100,
                                                message: texts.inputsMessage.max100
                                            },
                                            minLength: {
                                                value: 5,
                                                message: texts.inputsMessage.min5
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
                                        placeholder={texts.placeholder.nameMaterial}
                                    />
                                    <InputsGeneral type={"number"} label={`${texts.label.cantidadTotal}`} name="total" id="total" form={{ errors, register }}
                                        defaultValue={0}
                                        params={{
                                            min: {
                                                value: 0,
                                                message: texts.inputsMessage.min0
                                            },
                                            step: {
                                                value: 1,
                                                message: texts.inputsMessage.step1
                                            }
                                        }}
                                        placeholder="0"
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
                                        placeholder={texts.placeholder.descrpcion}
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

export default FormMateriales