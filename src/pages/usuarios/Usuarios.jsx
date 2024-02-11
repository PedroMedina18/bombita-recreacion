import Navbar from "../../components/navbar/Navbar"
import { InputText, UnitSelect, InputNumber, InputEmail, InputPassword, InputTel, InputCheck } from "../../components/input/Input"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { LoaderCircle } from "../../components/loader/Loader";
import ErrorSystem from "../../components/ErrorSystem";
import { useNavigate } from 'react-router-dom'
import { cargos, tipo_documentos, usuarios } from "../../js/API.js";
import { alertConfim, toastError, alertLoading, alertAceptar } from "../../js/alerts.js"
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace, verificacion_options, habilitarEdicion, get_persona } from "../../js/funtions.js"
import { useState, useEffect } from "react";


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
        get_data()
    }, [])

    const get_data = async () => {
        try {
            const get_cargos = await cargos.get()
            const get_tipo_documentos = await tipo_documentos.get()
            verificacion_options({
                respuesta:get_cargos,
                setError:setErrorServer,
                setOptions:setCargos
            })
            verificacion_options({
                respuesta:get_tipo_documentos,
                setError:setErrorServer,
                setOptions:setTipoDocumentos
            })
        } catch (error) {
            console.log(error)
            setErrorServer("Error de Sistema")
        } finally {
            setLoading(false)
        }
    }
    

    // the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm();

    // Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const confirmacion = await alertConfim("Confirmar", "Por favor confirmar la solicitud de Registro")
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
                    if (res.status = 200) {
                        if (res.data.status) {
                            Swal.close()
                            const aceptar = await alertAceptar("Exito!", "Usuario Registrado")
                            if (aceptar.isConfirmed) { navigate("/inicio") }
                        } else {
                            Swal.close()
                            toastError(`${res.data.message}`,
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                            )
                        }
                    } else {
                        Swal.close()
                        toastError(`Error.${res.status} ${res.statusText}`,
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                        )
                    }
                }

            } catch (error) {
                Swal.close()
                toastError("Error de Conexión",
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                )
            }
        }
    )
    return (
        <Navbar name="Registrar un Nuevo Usuario" descripcion="Intruduzca los datos para agregar un nuevo usuario al sistema">
            {
                loading ?
                    (
                        <div className="w-100 d-flex justify-content-center align-items-center bg-white p-5 round heigh-85">
                            <LoaderCircle />
                        </div>
                    )
                    :
                    errorServer ?
                        (
                            <div className="w-100 d-flex flex-column justify-content-center align-items-center bg-white p-5 round heigh-85">
                                <ErrorSystem error={errorServer} />
                            </div>
                        )
                        :
                        (
                            <div className="w-100 bg-white p-3 round">
                                <form className="w-100 d-flex flex-column"
                                    onSubmit={onSubmit}
                                    autoComplete={"off"}
                                >
                                    <input type="number" className="d-none"
                                        {
                                        ...register("id_persona")
                                        }
                                    />
                                    <InputCheck label="Datos de persona ya registrados en el sistema" name="persona" id="persona" form={{ errors, register }} className={`${!disabledInputs ? "d-none" : ""}`} checked={disabledInputs}
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
                                            <UnitSelect label="Tipo de Documento" name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                                                options={data_tipo_documentos}
                                                params={{
                                                    validate: (value) => {
                                                        if (!value) {
                                                            return "Seleccione un tipo de documento"
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
                                                        get_persona({
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
                                            <InputNumber label="Número de Documento" name="numero_documento" id="numero_documento" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere el número de documento",
                                                    },
                                                    maxLength: {
                                                        value: 10,
                                                        message: "Máximo 10 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 7,
                                                        message: "Minimo 7 caracteres",
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
                                                    get_persona({
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
                                            <InputText label="Nombres del Usuario" name="nombres" id="nombres" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere los nombres",
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: "Máximo 200 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: "Minimo 5 caracteres",
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-ZÁ-ÿ\s]+$/,
                                                        message: "Nombres invalidos",
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return "Sin espacios al inicio o al final"
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
                                            <InputText label="Apellidos del Usuario" name="apellidos" id="apellidos" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere los apellidos",
                                                    },
                                                    maxLength: {
                                                        value: 200,
                                                        message: "Máximo 200 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: "Minimo 5 caracteres",
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-ZÁ-ÿ\s]+$/,
                                                        message: "Apellidos invalidos",
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return "Sin espacios al inicio o al final"
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
                                            <InputTel label="Teléfono Principal" name="telefono_principal" id="telefono_principal" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere un número de teléfono",
                                                    },
                                                    maxLength: {
                                                        value: 11,
                                                        message: "Solo se admiten 11 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 11,
                                                        message: "Solo se admiten 11 caracteres",
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputTel label="Teléfono Secundario" name="telefono_secundario" id="telefono_secundario" form={{ errors, register }}
                                                params={{
                                                    maxLength: {
                                                        value: 11,
                                                        message: "Solo se admiten 11 caracteres",
                                                    },
                                                    minLength: {
                                                        value: 5,
                                                        message: "Solo se admiten 11 caracteres",
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                isError={!disabledInputs}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputEmail label="Correo Electrónico" name="correo" id="correo" form={{ errors, register }}
                                                params={{
                                                    minLength: {
                                                        value: 6,
                                                        message: "Minimo 6 caracteres"
                                                    },
                                                    maxLength: {
                                                        value: 100,
                                                        message: "Minimo 100 caracteres"
                                                    },
                                                    pattern: {
                                                        value: /^\w+([.-_+/$%&?¡¿]?\w+)@\w+([.-]?\w+)(.\w)+$/,
                                                        message: "Correo  no valido"
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return "Sin espacios al inicio o al final"
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
                                            <UnitSelect label="Cargo" name="cargo" id="cargo" form={{ errors, register }} 
                                            options={data_cargos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return "Seleccione un cargo"
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
                                            <InputText label="Usuario" name="usuario" id="usuario" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere el usuario",
                                                    },
                                                    minLength: {
                                                        value: 8,
                                                        message: "Minimo 8 caracteres"
                                                    },
                                                    maxLength: {
                                                        value: 20,
                                                        message: "Minimo 20 caracteres"
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_!@#$%^&*(),.?":{}|<>]*$/,
                                                        message: "Usuario  no valido"
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return "Sin espacios al inicio o al final"
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="w-100 w-md-50 ps-0 ps-md-3">
                                            <InputPassword label="Contraseña" name="contraseña" id="contraseña" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere la contraseña",
                                                    },
                                                    minLength: {
                                                        value: 6,
                                                        message: "Minimo 6 caracteres"
                                                    },
                                                    maxLength: {
                                                        value: 20,
                                                        message: "Minimo 18 caracteres"
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_!@#$%^&*(),.?":{}|<>]*$/,
                                                        message: "Contraseña  no valido"
                                                    },
                                                    validate: (value) => {
                                                        if (hasLeadingOrTrailingSpace(value)) {
                                                            return "Sin espacios al inicio o al final"
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-100 w-md-50 d-flex justify-content-between align-item-cente pe-0 pe-md-3">
                                        <InputPassword label="Repita la contraseña" name="contraseñaTwo" id="contraseñaTwo" form={{ errors, register }}
                                            params={{
                                                required: {
                                                    value: true,
                                                    message: "Se requiere confirmar la contraseña",
                                                },
                                                validate: (value) => {
                                                    if (!(value === watch("contraseña"))) {
                                                        return "las contraseñas no Coinciden"
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