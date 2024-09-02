import { useState, useEffect, useRef } from "react";
import { InputsGeneral} from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { LoaderCircle } from "../../components/loader/Loader";
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { usuarios } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx"
import { IconRowLeft } from "../../components/Icon.jsx"
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx"
import { getPersona, controlResultPost, habilitarEdicion, controlErrors } from "../../utils/actions.jsx"
import { useAuthContext } from '../../context/AuthContext.jsx';
import Navbar from "../../components/navbar/Navbar.jsx"
import Swal from 'sweetalert2';
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function Password() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [usuario, setUsuario] = useState(null)
    const renderizado = useRef(0)
    const params = useParams();

    useEffect(() => {
        if (renderizado.current === 0) {
            get_usuario()
        }
    }, [])

    const get_usuario = async () => {
        try {
            const respuesta = await usuarios.get({ subDominio: [Number(params.id)] })
            const errors = controlErrors({ respuesta: respuesta, constrolError: setErrorServer })
            if (errors) return
            setErrorServer("")
            const data = respuesta.data.data
            setValue(`usuario`, data["usuario"])
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
        watch,
        setValue
    } = useForm();

    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message =  texts.confirmMessage.confirmPassword
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const body={
                        contraseña:data.contraseña,
                        contraseña_repetida:data.contraseñaTwo
                    }
                    alertLoading("Cargando")
                    const res =  await usuarios.put(body, { subDominio: [Number(params.id)], params:{password:true} })
                    controlResultPost({
                        respuesta: res,
                        useNavigate: {
                            navigate,
                            direction: "/usuarios/"
                        },
                        messageExito: params.id ? texts.successMessage.editionUsuario : texts.successMessage.registerUsuario,
                    })
                }

            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    return (
        <Navbar name={`${texts.pages.passwordUser.name}`} descripcion={`${texts.pages.passwordUser.description}`} dollar={false}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/usuarios/") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                            //* Sección principal
                            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                                <form className="w-100 d-flex flex-column align-items-center"
                                    onSubmit={onSubmit}
                                >
                                    <div className="w-50 d-flex flex-column justify-content-between align-item-center">
                                        <div className="w-100 ps-0">
                                        <InputsGeneral type={"text"} label={`${texts.label.user}`} name="usuario" id="usuario" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireUser
                                                    },
                                                    minLength: {
                                                        value: 8,
                                                        message: texts.inputsMessage.min8
                                                    },
                                                    maxLength: {
                                                        value: 20,
                                                        message: texts.inputsMessage.max20
                                                    },
                                                    pattern: {
                                                        value: pattern.user,
                                                        message: texts.inputsMessage.invalidUser
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return texts.inputsMessage.noneSpace
                                                        } else {
                                                            return true
                                                        }
                                                    },
                                                }}
                                                disabled={true}
                                                placeholder={texts.placeholder.usuario}
                                            />
                                        </div>
                                        <div className="w-100 ps-0">
                                            <InputsGeneral type={"password"} label={`${texts.label.password}`} name="contraseña" id="contraseña" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requirePassword
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: texts.inputsMessage.min5
                                                    },
                                                    maxLength: {
                                                        value: 20,
                                                        message: texts.inputsMessage.max20
                                                    },
                                                    pattern: {
                                                        value: pattern.password,
                                                        message: texts.inputsMessage.invalidPassword,
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return texts.inputsMessage.noneSpace
                                                        } else {
                                                            return true
                                                        }
                                                    },
                                                }}
                                                placeholder={texts.placeholder.password}
                                            />
                                        </div>
                                        <div className="w-100 ps-0">
                                            <InputsGeneral type={"password"} label={texts.label.password2} name="contraseñaTwo" id="contraseñaTwo" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.confirmPassword
                                                    },
                                                    validate: (value) => {
                                                        if (!(value === watch("contraseña"))) {
                                                            return texts.inputsMessage.errorPassword
                                                        } else {
                                                            return true
                                                        }
                                                    },
                                                }}
                                                placeholder={texts.placeholder.repeatPassword}
                                            />
                                        </div>
                                    </div>

                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                                        Registrar
                                    </ButtonSimple>
                                </form>
                            </div>
                        )
            }
            <Toaster />
        </Navbar>
    )
}

export default Password