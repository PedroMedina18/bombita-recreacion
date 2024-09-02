import { useState, useEffect } from "react";
import { InputsGeneral, UnitSelect, InputTextTarea, InputCheckRadio, SelectAsync } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { clientes } from "../../utils/API.jsx";
import { toastError } from "../../components/alerts.jsx"
import { hasLeadingOrTrailingSpace, formatoFechaInput, FalseTrue } from "../../utils/process.jsx"
import { getPersona, habilitarEdicion } from "../../utils/actions.jsx"
import { Collapse } from "bootstrap";
import { useFormEventContext } from "../../context/FormEventContext.jsx"
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";


function FormDataEvent() {
    const { dataClientes, dataNewUser, valueCliente, setValueCliente, setdataNewUser, dataPersona, setPersona, setDataEvent, dataEvent } = useFormEventContext()
    const [ disabledInputs, setDisabledInputs ] = useState(false)
    const [ isClient, setIsClient ] = useState(true)
    const [ debounceTimeoutPersona, setDebounceTimeoutPersona ] = useState(null);
    const [ debounceTimeoutCliente, setDebounceTimeoutCliente ] = useState(null);
    const { dataOptions } = useAuthContext()
    const [ tipos_documentos ] = useState(dataOptions().tipos_documentos)
    const [ submit, setSubmit ] = useState(false);
    const navigate = useNavigate();
    const [ fechaActual ] = useState(new Date())

    useEffect(() => {
        const keys = Object.keys(dataEvent);
        keys.forEach(key => {
            setValue(key, dataEvent[`${key}`])
        });
        if (valueCliente) {
            setIsClient(true)
        }
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
            if(!valueCliente && !getValues("newClient")){
                return
            }
            try {
                setDataEvent({
                    ...dataEvent,
                    ...data
                })
                navigate("/register/eventos/account/")
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
        if (FalseTrue(checkDom)) {
            setIsClient(false)
            setValueCliente(null)
            collapseClient.hide()
            collapseDataClient.show()
        } else {
            setIsClient(true)
            collapseClient.show()
            collapseDataClient.hide()
        }
    }
    
    const loadOptionsCliente = (inputValue, callback) => {
        if (debounceTimeoutCliente) {
            clearTimeout(debounceTimeoutCliente);
        }

        const timeout = setTimeout(async () => {
            try {
                const respuesta = await clientes.get({subDominio:[inputValue]})
                if (respuesta.status !== 200) {
                    callback([])
                }
                if (respuesta.data.status === false) {
                    callback([])
                }
                callback(respuesta.data.data)
            }
            catch {
                callback([])
            }
        }, 800);

        setDebounceTimeoutCliente(timeout);
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
                <InputCheckRadio label={`${texts.label.clienteCheck}`} name="newClient" id="newClient" form={{ errors, register }} checked={!isClient}
                    onClick={(e) => {
                        collapseElements(e)
                    }}
                />

                <div className={`collapse show`} id="Cliente">
                    <div className={`w-100 ${Boolean(!valueCliente && submit && !getValues("newClient")) ? "error" : ""}`}>
                        <SelectAsync
                            id="cliente"
                            label={`${texts.label.cliente}`}
                            placeholder={`${texts.placeholder.buscarClientes}`}
                            optionsDefault={dataClientes}
                            getOptionLabel={(e) => { return `${e.nombres} ${e.apellidos} ${e.tipo_documento}-${e.numero_documento}`}}
                            getOptionValue={(e) => { return e.id}}
                            value={valueCliente}
                            setValue={setValueCliente}
                            loadOptions={loadOptionsCliente}
                        />
                        {Boolean(!valueCliente && submit && !getValues("newClient")) ? (
                            <span className="message-error visible">
                                {texts.inputsMessage.selectCliente}
                            </span>
                        ) : (
                            <span className="message-error invisible">Sin errores</span>
                        )}
                    </div>

                </div>
            </div>

            <div className="collapse" id="DataCliente">

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
                />

                <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                    <div className="w-md-25  w-100 pe-0 pe-md-3 d-flex align-item-center">
                        <UnitSelect label={texts.label.tipoDocuemnto} name="tipo_documento" id="tipo_documento" form={{ errors, register }}
                            options={tipos_documentos}
                            params={{
                                validate: (value) => {
                                    if (!(value) && !isClient) {
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

                    <div className="w-100 w-md-75 ps-0 ps-md-3 d-flex align-item-center">
                        <InputsGeneral label={texts.label.documento} type="number" name="numero_documento" id="numero_documento" form={{ errors, register }}
                            params={{
                                required: {
                                    value: !isClient,
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
                                min:{
                                    value:4000,
                                    message: texts.inputsMessage.invalidDocument,
                                }
                            }}
                            onKeyUp={
                                (e) => {
                                    setdataNewUser({
                                        ...dataNewUser,
                                        numero_documento: e.target.value
                                    })
                                    if (debounceTimeoutPersona) {
                                        clearTimeout(debounceTimeoutPersona);
                                    }
                                    const timeout = setTimeout(() => {
                                        getPersona({
                                            dataNewUser: { tipo_documento: dataNewUser.tipo_documento, numero_documento: e.target.value },
                                            setPersona,
                                            setValue,
                                            setDisabledInputs
                                        })
                                    }, 900);
                                    setDebounceTimeoutPersona(timeout);
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
                                    value: !isClient,
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
                                    value: !isClient,
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
                                    value: !isClient,
                                    message: texts.inputsMessage.requireTel,
                                },
                                maxLength: {
                                    value: 11,
                                    message: texts.inputsMessage.onlyCharacter11,
                                },
                                minLength: {
                                    value: 11,
                                    message: texts.inputsMessage.onlyCharacter11,
                                },
                                min:{
                                    value:200000000,
                                    message: texts.inputsMessage.invalidTel,
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
                                },
                                min:{
                                    value:200000000,
                                    message: texts.inputsMessage.invalidTel,
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
                        <InputsGeneral type={"datetime-local"} label={`${texts.label.fechaEvento}`} name="fecha_evento_inicio" id="fecha_evento_inicio" form={{ errors, register }}
                            params={{
                                required: {
                                    value: true,
                                    message: texts.inputsMessage.requireFechaEvent,
                                },
                                min:{
                                    value:formatoFechaInput(fechaActual),
                                    message:texts.inputsMessage.fechaMenor,
                                }
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
            <ButtonSimple type="submit" className="mx-auto w-50 mt-3"
                onClick={(e) => {
                    setSubmit(true);
                }}>
                Siguiente
            </ButtonSimple>
        </form>
    )
}

export default FormDataEvent