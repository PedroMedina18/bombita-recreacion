import { useState, useEffect, useRef } from "react";
import { InputsGeneral, UnitSelect, InputCheck, InputImgPerfil } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { LoaderCircle } from "../../components/loader/Loader";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { tipo_documentos, clientes } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { hasLeadingOrTrailingSpace, calcularEdad } from "../../utils/process.jsx";
import { habilitarEdicion, verifyOptionsSelect, getPersona, controlResultPost } from "../../utils/actions.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import Navbar from "../../components/navbar/Navbar"
import pattern from "../../context/pattern.js"
import { IconRowLeft } from "../../components/Icon"
import Swal from 'sweetalert2';

function Form_Clientes() {
    const [data_tipo_documentos, setTipoDocumentos] = useState([])
    const [cliente, setCliente] = useState({ id: null, numero_documento: null })
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [disabledInputs, setDisabledInputs] = useState(false)
    const navigate = useNavigate();
    const renderizado = useRef(0)
    const params = useParams();

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            get_data()
            return
        }
    }, [])

    // *Funcion para buscar los niveles y tipos de documentos
    const get_data = async () => {
        try {
            const get_tipo_documentos = await tipo_documentos.get({})
            verifyOptionsSelect({
                respuesta: get_tipo_documentos,
                setError: setErrorServer,
                setOptions: setTipoDocumentos
            })
            if (Number(params.numero_documento)) {
                setCliente({
                    ...cliente,
                    numero_documento: Number(params.numero_documento)
                })
                get_cliente()
            }
        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
        } finally {
            setLoading(false)
        }
    }

    const get_cliente = async () => {
        try {
            const respuesta = await clientes.get({ paramOne: Number(params.numero_documento), params: { "_info": "true" } })
            if (respuesta.status !== 200) {
                setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
                return
            }
            if (respuesta.data.status === false) {
                setErrorServer(`${respuesta.data.message}`)
                return
            }
            setErrorServer("")
            setCliente({
                ...cliente,
                id: respuesta.data.data.info.id
            })
            const keys = Object.keys(respuesta.data.data.info);
            keys.forEach(key => {
                setValue(key, respuesta.data.data.info[`${key}`])
            });
            setValue(`tipo_documento`, respuesta.data.data.info["tipo_documento_id"])

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

    // *Funcion para registrar 
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message = texts.confirmMessage.confirEdit
                const confirmacion = await alertConfim("Confirmar", message)
                const body = {}
                if (confirmacion.isConfirmed) {
                    body.nombres = data.nombres
                    body.apellidos = data.apellidos
                    body.numero_documento = numero_documento
                    body.tipo_documento = Number(data.tipo_documento)
                    body.telefono_principal = Number(data.telefono_principal)
                    body.telefono_secundario = Number(data.telefono_secundario)
                    body.correo = data.correo
                    alertLoading("Cargando")
                    const res = await clientes.put(body, cliente.id) 

                    controlResultPost({
                        respuesta: res,
                        messageExito: texts.successMessage.editionCliente,
                        useNavigate: { navigate: navigate, direction: "/clientes" }
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
        <Navbar name={`${texts.pages.editCliente.name}`} descripcion={`${texts.pages.editCliente.description}`}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/clientes") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                                <form className="w-100 d-flex flex-column" encType="multiport/form-data"
                                    onSubmit={onSubmit}>
                                    {/* Esta seccion se encarga de verificar que no haya personas repetidas */}
                                    <input type="number" className="d-none"
                                        {
                                        ...register("id_persona")
                                        }
                                    />


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
                                                disabled={disabledInputs}
                                                placeholder={texts.placeholder.numeroDocumento}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"text"} label={`${texts.label.namesCliente}`}
                                                name="nombres" id="nombres" form={{ errors, register }}
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
                                            <InputsGeneral type={"text"} label={`${texts.label.lastNamesCliente}`}
                                                name="apellidos" id="apellidos" form={{ errors, register }}
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
                                        
                                    </div>

                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                                        {"Guardar"}
                                    </ButtonSimple>
                                </form>
                            </div>
                        )
            }
            <Toaster />
        </Navbar>
    )
}

export default Form_Clientes