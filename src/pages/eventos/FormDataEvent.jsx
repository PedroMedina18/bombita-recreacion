import { useState, useEffect, useRef } from "react";
import { InputsGeneral, UnitSelect, InputTextTarea, InputCheck } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { toastError } from "../../components/alerts.jsx"
import { hasLeadingOrTrailingSpace, formatoFechaInput } from "../../utils/process.jsx"
import { getPersona, habilitarEdicion } from "../../utils/actions.jsx"
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { Collapse } from "bootstrap";
import { useFormEventContext } from "../../context/FormEventContext.jsx"


function FormDataEvent() {
    const { dataTipo_documentos, dataNewUser, setdataNewUser, dataPersona, setPersona, setDataEvent, dataEvent } = useFormEventContext()
    const [disabledInputs, setDisabledInputs] = useState(false)
    const navigate = useNavigate();
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [fechaActual] = useState(new Date())
    const renderizado = useRef(0)

    useEffect(() => {
        const keys = Object.keys(dataEvent);
        keys.forEach(key => {
            setValue(key, `${dataEvent[`${key}`]}`)
        });
        collapseElements()
    }, [])

    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,

    } = useForm();
    
    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            console.log(data)
            try {
                setDataEvent({
                    ...dataEvent,
                    ...data
                })
                navigate("/register/eventos/account")
            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    // *funcion para colapsar la sesion de cliente
    const collapseElements = (domm = null) => {
        const collapseClient = new Collapse("#Cliente", { toggle: false })
        const collapseDataClient = new Collapse("#DataCliente", { toggle: false })
        const checkDom = domm ? domm.target.checked : getValues("newClient")
        if (checkDom) {
            collapseClient.hide()
            collapseDataClient.show()
        } else {
            collapseClient.show()
            collapseDataClient.hide()
        }
    }

    return (
        <form className="w-100 d-flex flex-column"
            onSubmit={onSubmit}
        >
            <input type="number" className="d-none"
                {
                ...register("id_persona")
                }
            />
            <div className="w-100 d-flex flex-column justify-content-between align-item-center">
                <InputCheck label={`${texts.label.clienteCheck}`} name="newClient" id="newClient" form={{ errors, register }}

                    onClick={(e) => {
                        collapseElements(e)
                    }}
                />

                <div className="collapse show" id="Cliente">
                    <UnitSelect label={`${texts.label.cliente}`} name="cliente" id="cliente" form={{ errors, register }}
                        options={[]}
                        params={{
                            validate: (value) => {
                                if (!getValues("newClient")) {
                                    return texts.inputsMessage.selectCliente
                                } else {
                                    return true
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <div className="collapse" id="DataCliente">

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
                    }
                />

                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                    <div className="w-md-25  w-100 pe-0 pe-md-3">
                        <UnitSelect label={texts.label.tipoDocuemnto} name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                            options={dataTipo_documentos}
                            params={{
                                validate: (value) => {
                                    if (value === "") {
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

                    {/* Sección de cliente */}

                    <div className="w-100 w-md-75 ps-0 ps-md-3 ">
                        <InputsGeneral label={texts.label.documento} type="number" name="numero_documento" id="numero_documento" form={{ errors, register }}
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
                                    if (debounceTimeout) {
                                        clearTimeout(debounceTimeout);
                                    }
                                    const timeout = setTimeout(() => {
                                        getPersona({
                                            dataNewUser: { tipo_documento: dataNewUser.tipo_documento, numero_documento: e.target.value },
                                            setPersona,
                                            setValue,
                                            setDisabledInputs
                                        })
                                    }, 900);
                                    setDebounceTimeout(timeout);
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
                        <InputsGeneral type="text" label={texts.label.namesCliente} name="nombres" id="nombres" form={{ errors, register }}
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
                        <InputsGeneral type={"text"} label={`${texts.label.lastNamesCliente}`} name="apellidos" id="apellidos" form={{ errors, register }}
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
                                    value: 11,
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
                            placeholder={texts.placeholder.correo}
                        />
                    </div>
                </div>
            </div>

            <div className="w-100 d-flex flex-column justify-content-between align-item-center">

                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                    <div className="w-100 w-md-50 pe-0 pe-md-3">
                        <InputsGeneral type={"datetime-local"} label={`${texts.label.fechaEvento}`} name="fecha_evento" id="fecha_evento" form={{ errors, register }}
                            min={formatoFechaInput(fechaActual)}
                            params={{
                                required: {
                                    value: true,
                                    message: texts.inputsMessage.requireFechaEvent,
                                },
                            }}
                        />
                    </div>
                    <div className="w-100 w-md-50 ps-0 ps-md-3">
                        <InputsGeneral type={"number"} label={`${texts.label.numeroPersonas}`} name="numero_personas" id="numero_personas" form={{ errors, register }}
                            defaultValue={1}
                            params={{
                                required: {
                                    value: true,
                                    message: texts.inputsMessage.requirePersonas,
                                },
                                min: {
                                    value: 1,
                                    message: texts.inputsMessage.min1
                                },
                            }}
                            placeholder={texts.placeholder.numeroPersonas}
                        />
                    </div>
                </div>

                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                    <InputTextTarea label={`${texts.label.direccion}`} name="direccion" id="direccion" form={{ errors, register }}
                        params={{
                            required: {
                                value: true,
                                message: texts.inputsMessage.requiredDireccion,
                            },
                            maxLength: {
                                value: 500,
                                message: texts.inputsMessage.max500
                            },
                            validate: (value) => {
                                if (hasLeadingOrTrailingSpace(value)) {
                                    return texts.inputsMessage.noneSpace
                                } else {
                                    return true
                                }
                            }
                        }}
                        placeholder={texts.placeholder.direccion}
                    />
                </div>
            </div>
            <ButtonSimple type="submit" className="mx-auto w-50 mt-3" onClick={()=>{console.log(errors)}}>
                Registrar
            </ButtonSimple>
        </form>
    )
}

export default FormDataEvent