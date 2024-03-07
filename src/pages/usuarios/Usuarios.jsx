import { useState, useEffect } from "react";
import { InputsGeneral, UnitSelect, InputCheck } from "../../components/input/Input"
import { ButtonSimple } from "../../components/button/Button"
import { LoaderCircle } from "../../components/loader/Loader";
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { cargos, tipo_documentos, usuarios } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../utils/alerts.jsx"
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx"
import {getPersona, verifyOptionsSelect, controlResultPost, habilitarEdicion} from "../../utils/actions.jsx"
import Navbar from "../../components/navbar/Navbar"
import Swal from 'sweetalert2';
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";


function Usuarios() {
    const [data_tipo_documentos, setTipoDocumentos] = useState([])
    const [data_cargos, setCargos] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [disabledInputs, setDisabledInputs] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        getData()
    }, [])

    // *funcion para buscar los tipos de documentos y los cargos
    const getData = async () => {
        try {
            const get_cargos = await cargos.get()
            const get_tipo_documentos = await tipo_documentos.get()
            verifyOptionsSelect({
                respuesta:get_cargos,
                setError:setErrorServer,
                setOptions:setCargos
            })
            verifyOptionsSelect({
                respuesta:get_tipo_documentos,
                setError:setErrorServer,
                setOptions:setTipoDocumentos
            })
        } catch (error) {
            console.log(error)
            setErrorServer(texts.inputsMessage.errorSystem)
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

    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirRegister)
                if (confirmacion.isConfirmed) {
                    let body
                    if (data.id_persona) {
                        body = {
                            id_persona: data.id_persona,
                            usuario: data.usuario,
                            contraseña: data.contraseña,
                            cargo: Number(data.cargo)
                        }
                    } else {
                        body = {
                            nombres: data.nombres,
                            apellidos: data.apellidos,
                            numero_documento:data.numero_documento,
                            tipo_documento: Number(data.tipo_documento),
                            telefono_principal: Number(data.telefono_principal),
                            telefono_secundario: Number(data.telefono_secundario),
                            correo: data.correo,
                            usuario: data.usuario,
                            contraseña: data.contraseña,
                            cargo: Number(data.cargo)
                        }
                    }
                    alertLoading("Cargando")
                    const res = await usuarios.post(body)
                    controlResultPost({
                        respuesta:res,
                        useNavigate:{
                            navigate,
                            direction:"/inicio"
                        },
                        messageExito:texts.successMessage.usuario,
                    })
                }

            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    return (
        <Navbar name={`${texts.pages.registerUsuairo.name}`} descripcion={`${texts.pages.registerUsuairo.description}`}>
            {
                loading ?
                    (
                        <div className="w-100 d-flex justify-content-center align-items-center bg-white p-5 border rounded heigh-85">
                            <LoaderCircle />
                        </div>
                    )
                    :
                    errorServer ?
                        (
                            <div className="w-100 d-flex flex-column justify-content-center align-items-center bg-white p-5 border rounded heigh-85">
                                <ErrorSystem error={errorServer} />
                            </div>
                        )
                        :
                        (
                            <div className="w-100 bg-white p-4 border rounded d-flex flex-column justify-content-center align-items-center">
                                <form className="w-100 d-flex flex-column"
                                    onSubmit={onSubmit}
                                    autoComplete={"off"}
                                >
                                    <input type="number" className="d-none"
                                        {
                                        ...register("id_persona")
                                        }
                                    />
                                    <InputCheck label={`${texts.label.dataPersonaCheck}`} name="persona" id="persona" form={{ errors, register }} className={`${!disabledInputs ? "d-none" : ""}`} checked={disabledInputs}
                                        onClick={
                                            (e) => {
                                                setDisabledInputs(!disabledInputs)
                                                habilitarEdicion({
                                                    setValue,
                                                    setdataNewUser,
                                                    dataPersona
                                                })
                                            }
                                        } />
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-md-25  w-100 pe-0 pe-md-3">
                                            <UnitSelect label={texts.label.tipoDocuemnto} name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                                                options={data_tipo_documentos}
                                                params={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return texts.inputsMessage.selectTipoDocumento
                                                        } else {
                                                            return true
                                                        }
                                                    },
                                                }}
                                                onChange={
                                                    (e) => {
                                                        setdataNewUser({
                                                            ...dataNewUser,
                                                            tipo_documento: e.target.value
                                                        })
                                                        getPersona({
                                                            dataNewUser, 
                                                            setPersona, 
                                                            setValue, 
                                                            setDisabledInputs
                                                        })
                                                    }
                                                }
                                                disabled={disabledInputs}

                                            />
                                        </div>

                                        <div className="w-100 w-md-75 ps-0 ps-md-3 ">
                                            <InputsGeneral label={texts.label.documento} type="number" name="numero_documento" id="numero_documento" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireDocumento,
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message:  texts.inputsMessage.max10,
                                                    },
                                                    minLength: {
                                                        value: 7,
                                                        message: texts.inputsMessage.min7,
                                                    },
                                                }}
                                                onKeyUp={
                                                    (e) => {
                                                        setdataNewUser({
                                                            ...dataNewUser,
                                                            numero_documento: e.target.value
                                                        })
                                                    }
                                                }
                                                onBlur={(e) => {
                                                    getPersona({
                                                        dataNewUser, 
                                                        setPersona, 
                                                        setValue, 
                                                        setDisabledInputs
                                                    })
                                                }}
                                                disabled={disabledInputs}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type="text" label={texts.label.namesUser} name="nombres" id="nombres" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireNames,
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: texts.inputsMessage.max200,
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: texts.inputsMessage.min7,
                                                    },
                                                    pattern: {
                                                        value: pattern.textNoneNumber,
                                                        message: texts.inputsMessage.invalidNombres,
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return texts.inputsMessage.noneSpace
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputsGeneral type={"text"} label={`${texts.label.lastNamesUser}`} name="apellidos" id="apellidos" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireLastName,
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: texts.inputsMessage.max200,
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: texts.inputsMessage.min5,
                                                    },
                                                    pattern: {
                                                        value: pattern.textNoneNumber,
                                                        message: texts.inputsMessage.invalidLastNames,
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return texts.inputsMessage.noneSpace
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"tel"} label={`${texts.label.telPrincipal}`} name="telefono_principal" id="telefono_principal" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireTel,
                                                    },
                                                    maxLength: {
                                                        value: 11,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    },
                                                    minLength: {
                                                        value: 11,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>

                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputsGeneral type={"tel"} label={`${texts.label.telSecundario}`} name="telefono_secundario" id="telefono_secundario" form={{ errors, register }}
                                                params={{
                                                    maxLength: {
                                                        value: 11,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    },
                                                    minLength: {
                                                        value:11,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"email"} label={`${texts.label.email}`} name="correo" id="correo" form={{ errors, register }}
                                                params={{
                                                    minLength: {
                                                        value: 5,
                                                        message: texts.inputsMessage.min5
                                                    },
                                                    maxLength: {
                                                        value: 100,
                                                        message: texts.inputsMessage.max100
                                                    },
                                                    pattern: {
                                                        value: pattern.email,
                                                        message: texts.inputsMessage.invalidEmail
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return texts.inputsMessage.noneSpace
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <UnitSelect label={`${texts.label.cargo}`} name="cargo" id="cargo" form={{ errors, register }} 
                                            options={data_cargos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.selectCargo
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
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
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
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
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 w-md-50 d-flex justify-content-between align-item-cente pe-0 pe-md-3">
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
                                                }
                                            }}
                                        />
                                    </div>

                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-5">
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

export default Usuarios