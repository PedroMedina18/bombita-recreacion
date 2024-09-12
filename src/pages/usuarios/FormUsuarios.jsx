import { useState, useEffect, useRef } from "react";
import { InputsGeneral, UnitSelect, InputCheckRadio, TogleSwiches } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { LoaderCircle } from "../../components/loader/Loader";
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { usuarios } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx"
import { IconRowLeft, IconKey } from "../../components/Icon.jsx"
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx"
import { getPersona, controlResultPost, habilitarEdicion, controlErrors } from "../../utils/actions.jsx"
import { useAuthContext } from '../../context/AuthContext.jsx';
import Navbar from "../../components/navbar/Navbar.jsx"
import Swal from 'sweetalert2';
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function FormUsuarios() {
    const { dataOptions, editUser, getUser, closeSession } = useAuthContext()
    const [loading, setLoading] = useState(true)
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [errorServer, setErrorServer] = useState("")
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [disabledInputs, setDisabledInputs] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate();
    const renderizado = useRef(0)
    const params = useParams();

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            if (Number(params.id)) {
                document.title = "Registro de Usuarios - Bombita Recreación"
                get_usuario()
            } else {
                document.title = "Edición de Usuarios - Bombita Recreación"
                setLoading(false)
            }
            return
        }
    }, [])

    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        clearErrors
    } = useForm();

    const get_usuario = async () => {
        try {
            const respuesta = await usuarios.get({ subDominio: [Number(params.id)] })
            const errors = controlErrors({ respuesta: respuesta, constrolError: setErrorServer })
            if (errors) return
            setErrorServer("")
            const data = respuesta.data.data
            const keys = Object.keys(data);
            keys.forEach(key => {
                setValue(key, data[`${key}`])
            });
            setValue(`cargo`, data["cargo_id"])
            setValue(`telefono_secundario`, data["telefono_secundario"]==="0"? "" : data["telefono_secundario"])
            setValue(`tipo_documento`, data["tipo_documento_id"])
            setDisabled(!data["estado"])

        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorObjet)
        } finally {
            setLoading(false)
        }
    }

    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message = params.id ? texts.confirmMessage.confirmEdit : texts.confirmMessage.confirmRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    if (Number(params.id) == 1 && !data.estado) {
                        toastError(texts.errorMessage.errorUsuarioProtect)
                        return
                    }
                    const body = {}
                    if (data.id_persona) {
                        body.id_persona = data.id_persona,
                            body.usuario = data.usuario,
                            body.contraseña = data.contraseña,
                            body.cargo = Number(data.cargo)

                    } else {
                        body.nombres = data.nombres,
                            body.apellidos = data.apellidos,
                            body.numero_documento = data.numero_documento,
                            body.tipo_documento = Number(data.tipo_documento),
                            body.telefono_principal = Number(data.telefono_principal),
                            body.telefono_secundario = Number(data.telefono_secundario),
                            body.correo = data.correo,
                            body.usuario = data.usuario,
                            body.contraseña = data.contraseña,
                            body.cargo = Number(data.cargo)
                        if (data.estado !== undefined) {
                            body.estado = data.estado
                        }
                    }
                    const actualUser = () => {
                        const usuarioActual = getUser().id == params.id
                        if (params.id && usuarioActual) {
                            closeSession()
                            navigate("/")
                        }
                    }

                    alertLoading("Cargando")
                    const res = params.id ? await usuarios.put(body, { subDominio: [Number(params.id)] }) : await usuarios.post(body)
                    controlResultPost({
                        respuesta: res,
                        useNavigate: {
                            navigate,
                            direction: "/usuarios/"
                        },
                        callbak: actualUser,
                        messageExito: params.id ? !(data.estado) ? texts.successMessage.userDisabled : texts.successMessage.editionUsuario : texts.successMessage.registerUsuario,
                    })
                }

            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    return (
        <Navbar name={`${params.id ? texts.pages.editUsuario.name : texts.pages.registerUsuario.name}`} descripcion={`${params.id ? texts.pages.editUsuario.description : texts.pages.registerUsuario.description}`} dollar={false}>
            <div className="w-100 d-flex justify-content-between">
                <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/usuarios/") }}> <IconRowLeft /> Regresar</ButtonSimple>
                {
                    params.id &&
                    <ButtonSimple type="button" className="mb-2" onClick={() => { navigate(`/password/usuario/${params.id}`) }}> <IconKey /></ButtonSimple>
                }
            </div>

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
                                <form className="w-100 d-flex flex-column"
                                    onSubmit={onSubmit}
                                >
                                    <input type="number" className="d-none"
                                        {
                                        ...register("id_persona")
                                        }
                                    />
                                    <InputCheckRadio label={`${texts.label.dataPersonaCheck}`} name="persona" id="persona" form={{ errors, register }} className={`${!disabledInputs ? "d-none" : ""}`} checked={disabledInputs}
                                        onClick={
                                            (e) => {
                                                setDisabledInputs(!disabledInputs)
                                                habilitarEdicion({
                                                    setValue,
                                                    setdataNewUser,
                                                    dataPersona
                                                })
                                            }
                                        }
                                        disabled={disabled}
                                    />
                                    {
                                        params.id &&
                                        <div className="w-100 d-flex">
                                            <TogleSwiches
                                                className="ms-auto mb-2"
                                                name="estado"
                                                id="estado"
                                                form={{ errors, register }}
                                                onChange={(e) => {
                                                    if (params.id == getUser().id && !e.target.checked) {
                                                        toastError(texts.errorMessage.errorUsuarioActual)
                                                        setValue("estado", true)
                                                        return
                                                    }
                                                    setDisabled(!e.target.checked)
                                                }}
                                            />

                                        </div>
                                    }
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-md-25  w-100 pe-0 pe-md-3">
                                            <UnitSelect label={texts.label.tipoDocuemnto} name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                                                options={dataOptions().tipos_documentos}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.selectTipoDocumento,
                                                    },
                                                }}
                                                onChange={
                                                    (e) => {
                                                        if (Boolean(e.target.value)) {
                                                            clearErrors("tipo_documento")
                                                        }
                                                        const newUser = {
                                                            ...dataNewUser,
                                                            tipo_documento: e.target.value
                                                        }
                                                        setdataNewUser(newUser)
                                                        if (!params.id) {
                                                            getPersona({
                                                                dataNewUser: newUser,
                                                                setPersona,
                                                                setValue,
                                                                setDisabledInputs
                                                            })
                                                        }
                                                    }
                                                }
                                                disabled={disabledInputs || disabled}
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
                                                        value: 9,
                                                        message: texts.inputsMessage.max9,
                                                    },
                                                    minLength: {
                                                        value: 7,
                                                        message: texts.inputsMessage.min7,
                                                    },
                                                    min: {
                                                        value: 4000000,
                                                        message: texts.inputsMessage.invalidDocument,
                                                    }

                                                }}
                                                onKeyUp={
                                                    (e) => {
                                                        const newUser = {
                                                            ...dataNewUser,
                                                            numero_documento: e.target.value
                                                        }
                                                        setdataNewUser(newUser)
                                                        if (debounceTimeout) {
                                                            clearTimeout(debounceTimeout);
                                                        }
                                                        const timeout = setTimeout(() => {
                                                            if (!params.id) {
                                                                getPersona({
                                                                    dataNewUser: newUser,
                                                                    setPersona,
                                                                    setValue,
                                                                    setDisabledInputs
                                                                })
                                                            }
                                                        }, 900);
                                                        setDebounceTimeout(timeout);
                                                    }
                                                }
                                                onBlur={(e) => {
                                                    if (!params.id) {
                                                        getPersona({
                                                            dataNewUser,
                                                            setPersona,
                                                            setValue,
                                                            setDisabledInputs
                                                        })
                                                    }
                                                }}
                                                disabled={disabledInputs || disabled}
                                                placeholder={texts.placeholder.numeroDocumento}
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
                                                        value: 3,
                                                        message: texts.inputsMessage.min3,
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
                                                disabled={disabledInputs || disabled}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.nombre}
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
                                                        value: 3,
                                                        message: texts.inputsMessage.min3,
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
                                                disabled={disabledInputs || disabled}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.apellidos}
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
                                                    min: {
                                                        value: 2000000000,
                                                        message: texts.inputsMessage.invalidTel,
                                                    },
                                                    pattern: {
                                                        value: pattern.tel,
                                                        message: texts.inputsMessage.invalidTel,
                                                    },
                                                }}
                                                disabled={disabledInputs || disabled}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.telefono}
                                            />
                                        </div>

                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputsGeneral type={"tel"} label={`${texts.label.telSecundario}`} name="telefono_secundario" id="telefono_secundario" form={{ errors, register }}
                                                params={{
                                                    maxLength: {
                                                        value: 11,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    },
                                                    min: {
                                                        value: 2000000000,
                                                        message: texts.inputsMessage.invalidTel,
                                                    },
                                                    pattern: {
                                                        value: pattern.tel,
                                                        message: texts.inputsMessage.invalidTel,
                                                    },
                                                }}
                                                disabled={disabledInputs || disabled}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.telefono}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"email"} label={`${texts.label.email}`} name="correo" id="correo" form={{ errors, register }}
                                                params={{
                                                    minLength: {
                                                        value: 10,
                                                        message: texts.inputsMessage.min10
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
                                                disabled={disabledInputs || disabled}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.correo}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <UnitSelect label={`${texts.label.cargo}`} name="cargo" id="cargo" form={{ errors, register }}
                                                options={dataOptions().cargos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.selectCargo
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    if (Boolean(e.target.value)) {
                                                        clearErrors("cargo")
                                                    }
                                                }}
                                                disabled={disabled}
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
                                                        value: 16,
                                                        message: texts.inputsMessage.max15
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
                                                disabled={disabled}
                                                placeholder={texts.placeholder.usuario}
                                            />
                                        </div>
                                        {
                                            !params.id &&
                                            <div className="w-100 w-md-50 ps-0 ps-md-3">
                                                <InputsGeneral type={"password"} label={`${texts.label.password}`} name="contraseña" id="contraseña" form={{ errors, register }}
                                                    params={{
                                                        required: {
                                                            value: true,
                                                            message: texts.inputsMessage.requirePassword
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
                                        }

                                    </div>
                                    {
                                        !params.id &&
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
                                                    },
                                                }}
                                                placeholder={texts.placeholder.repeatPassword}
                                            />
                                        </div>
                                    }

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

export default FormUsuarios