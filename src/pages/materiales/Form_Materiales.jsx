import { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import { InputsGeneral, InputTextTarea } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button";
import { useNavigate, useParams } from 'react-router-dom';
import { materiales } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx"
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { Toaster } from "sonner";
import Navbar from "../../components/navbar/Navbar";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon";

function Form_Materiales() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const renderizado = useRef(0);
    const [errorServer, setErrorServer] = useState("")

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (params.id){
                get_materiales()
            }
            return
        }
    }, [])

    const get_materiales = async () => {
        try {
            const respuesta = await materiales.get({paramOne:Number(params.id)})
            console.log(respuesta)
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
                const message = params.id? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const body = {
                        nombre: data.nombre,
                        total: Number(data.total),
                        descripcion: data.descripcion,
                    }
                    alertLoading("Cargando")
                    const res = params.id? await materiales.put(body, Number(params.id)) : await materiales.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id? texts.successMessage.editionMaterial : texts.successMessage.registerMaterial,
                        useNavigate: { navigate: navigate, direction: "/materiales" }
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
        <Navbar name={params.id? texts.pages.editMaterial.name : texts.pages.registerMaterial.name} descripcion={params.id? texts.pages.editMaterial.description : texts.pages.registerMaterial.description}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/materiales") }}> <IconRowLeft/> Regresar</ButtonSimple>

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
                        Registrar
                    </ButtonSimple>
                </form>
            </div>
            <Toaster />
        </Navbar>
    )
}

export default Form_Materiales