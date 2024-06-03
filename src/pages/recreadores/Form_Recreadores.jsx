import { useState, useEffect } from "react";
import { InputsGeneral, UnitSelect, InputCheck, InputImgPerfil } from "../../components/input/Input"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { LoaderCircle } from "../../components/loader/Loader";
import { useNavigate } from 'react-router-dom'
import { Toaster } from "sonner";
import { niveles, tipo_documentos, recreadores } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../utils/alerts.jsx";
import { hasLeadingOrTrailingSpace, calcularEdad } from "../../utils/process.jsx";
import { habilitarEdicion, verifyOptionsSelect, getPersona, controlResultPost } from "../../utils/actions.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import Navbar from "../../components/navbar/Navbar"
import pattern from "../../context/pattern.js"
import { IconRowLeft } from "../../components/Icon"

function Form_Recreadores() {
    const [data_tipo_documentos, setTipoDocumentos] = useState([])
    const [data_niveles, setNiveles] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [disabledInputs, setDisabledInputs] = useState(false)
    const [fechaActual] = useState(new Date())
    const navigate = useNavigate();

    useEffect(() => {
        get_data()
    }, [])

    // *Funcion para buscar los niveles y tipos de documentos
    const get_data = async () => {
        try {
            const get_niveles = await niveles.get()
            const get_tipo_documentos = await tipo_documentos.get()
            verifyOptionsSelect({
                respuesta: get_niveles,
                setError: setErrorServer,
                setOptions: setNiveles
            })
            verifyOptionsSelect({
                respuesta: get_tipo_documentos,
                setError: setErrorServer,
                setOptions: setTipoDocumentos
            })
        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
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
                console.log(data)
                if (confirmacion.isConfirmed) {
                    let body
                    if (data.id_persona) {
                        body = {
                            id_persona: data.id_persona,
                            fecha_nacimiento: data.fecha_nacimiento,
                            nivel: Number(data.nivel)
                        }
                    } else {
                        body = {
                            nombres: data.nombres,
                            apellidos: data.apellidos,
                            numero_documento: data.numero_documento,
                            tipo_documento: Number(data.tipo_documento),
                            telefono_principal: Number(data.telefono_principal),
                            telefono_secundario: Number(data.telefono_secundario),
                            correo: data.correo,
                            fecha_nacimiento: data.fecha_nacimiento,
                            nivel: Number(data.nivel)
                        }
                    }
                    alertLoading("Cargando")
                    const res = await recreadores.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: texts.successMessage.recreador,
                        useNavigate: { navigate: navigate, direction: "/recreadores" }
                    })
                }

            } catch (error) {
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    return (
        <Navbar name={`${texts.pages.registerRecreadores.name}`} descripcion={`${texts.pages.registerRecreadores.description}`}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/recreadores") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                                    onSubmit={onSubmit}>
                                    {/* Esta seccion se encarga de verificar que no haya personas repetidas */}
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
                                    <div className="w-100">
                                        <InputImgPerfil name="foto_perfil" id="foto_perfil" label={`${texts.label.fotoRecreador}`} form={{ errors, register }} />
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-25 pe-0 pe-md-3 d-flex align-items-center">
                                            <UnitSelect label={texts.label.tipoDocuemnto} name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                                                options={data_tipo_documentos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.selectTipoDocumento
                                                        } else {
                                                            return true
                                                        }
                                                    },

                                                }}
                                                isError={!watch("tipo_documento")}
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
                                        <div className="w-100 w-md-75 ps-0 ps-md-3 d-flex align-items-center">
                                            <InputsGeneral type={"number"} label={`${texts.label.documento}`} name="numero_documento" id="numero_documento" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireDocumento,
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: texts.inputsMessage.max10,
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
                                                placeholder={texts.placeholder.numeroDocumento}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"text"} label={`${texts.label.namesRecreador}`} name="nombres" id="nombres" form={{ errors, register }}
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
                                                        message: texts.inputsMessage.min5,
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
                                                placeholder={texts.placeholder.nombre}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputsGeneral type={"text"} label={`${texts.label.lastNamesRecreador}`} name="apellidos" id="apellidos" form={{ errors, register }}
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
                                                placeholder={texts.placeholder.apellidos}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"date"} label={`${texts.label.birthDate}`} name="fecha_nacimiento" id="fecha_nacimiento" form={{ errors, register }}
                                                max={`${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1) < 10 ? `0${fechaActual.getMonth() + 1}` : `${fechaActual.getMonth() + 1}`}-${fechaActual.getDate() < 10 ? `0${fechaActual.getDate()}` : fechaActual.getDate()}`}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: texts.inputsMessage.requireDate,
                                                    },
                                                    validate: (e) => {
                                                        const edad = calcularEdad(e, fechaActual)
                                                        if (edad < 15 || edad > 60) {
                                                            return `Edad ${edad} años, recreador Invalido`
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <UnitSelect label={texts.label.genero} name="genero" id="genero" form={{ errors, register }}
                                                options={data_tipo_documentos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.selectGenero
                                                        } else {
                                                            return true
                                                        }
                                                    },

                                                }}
                                                isError={!watch("genero")}
                                                onChange={
                                                    (e) => {
                                                        setdataNewUser({
                                                            ...dataNewUser,
                                                            genero: e.target.value
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
                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3 ">
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
                                                    minLength: {
                                                        value: 5,
                                                        message: texts.inputsMessage.onlyCharacter11,
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                                placeholder={texts.placeholder.telefono}
                                            />
                                        </div>

                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3 ">
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
                                                placeholder={texts.placeholder.correo}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <UnitSelect label={`${texts.label.nivel}`} name="nivel" id="nivel" form={{ errors, register }}
                                                options={data_niveles}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.selectNivel
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
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

export default Form_Recreadores