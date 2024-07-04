import { useState, useEffect, useRef } from "react";
import { InputsGeneral, UnitSelect, InputCheck, InputImgPerfil } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { LoaderCircle } from "../../components/loader/Loader";
import { useParams, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { niveles, tipo_documentos, recreadores, generos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { hasLeadingOrTrailingSpace, calcularEdad } from "../../utils/process.jsx";
import { habilitarEdicion, verifyOptionsSelect, getPersona, controlResultPost } from "../../utils/actions.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import texts from "../../context/text_es.js";
import Navbar from "../../components/navbar/Navbar"
import pattern from "../../context/pattern.js"
import { IconRowLeft } from "../../components/Icon"
import Swal from 'sweetalert2';

function Form_Recreadores() {
    const [data_tipo_documentos, setTipoDocumentos] = useState([])
    const [recreador, setRecreador] = useState({id:null, numero_documento:null, img:null})
    const [data_niveles, setNiveles] = useState([])
    const [data_generos, setGeneros] = useState([])
    const [loading, setLoading] = useState(true)
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [errorServer, setErrorServer] = useState("")
    const [dataNewUser, setdataNewUser] = useState({ tipo_documento: null, numero_documento: null })
    const [dataPersona, setPersona] = useState({})
    const [disabledInputs, setDisabledInputs] = useState(false)
    const [fechaActual] = useState(new Date())
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
            const get_niveles = await niveles.get({})
            const get_tipo_documentos = await tipo_documentos.get({})
            const get_generos = await generos.get({})
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
            verifyOptionsSelect({
                respuesta: get_generos,
                setError: setErrorServer,
                setOptions: setGeneros
            })
            if (Number(params.numero_documento)){
                setRecreador({
                    ...recreador,
                    numero_documento:Number(params.numero_documento)
                })
                get_recreador()
            }
        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
        } finally {
            setLoading(false)
        }
    }

    const get_recreador = async () => {
        try {
            const respuesta = await recreadores.get({paramOne:Number(params.numero_documento), params:{"_info":"true"} })
            if (respuesta.status !== 200) {
                setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
                return
            }
            if (respuesta.data.status === false) {
                setErrorServer(`${respuesta.data.message}`)
                return
            } 
            setErrorServer("")
            setRecreador({
                ...recreador,
                img:respuesta.data.data.info.img_perfil,
                id:respuesta.data.data.info.id
            })
            const keys = Object.keys(respuesta.data.data.info);
            keys.forEach(key => {
                setValue(key, respuesta.data.data.info[`${key}`])
            });
            setValue(`genero`, respuesta.data.data.info["genero_id"])
            setValue(`nivel`, respuesta.data.data.info["nivel_id"])
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
            const $archivo = document.getElementById(`img_perfil`).files[0]
            const message = recreador.id? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
            const confirmacion = await alertConfim("Confirmar", message)
            if (confirmacion.isConfirmed) {
                const Form = new FormData()
                if (data.id_persona) {
                    Form.append('id_persona', data.id_persona)
                    Form.append('fecha_nacimiento', data.fecha_nacimiento)
                    Form.append('nivel', data.nivel)
                    Form.append('genero', data.genero)
                    Form.append('img_perfil', $archivo?$archivo:null)
                } else {
                    Form.append('nombres', data.nombres)
                    Form.append('apellidos', data.apellidos)
                    Form.append('numero_documento', data.numero_documento)
                    Form.append('tipo_documento', Number(data.tipo_documento))
                    Form.append('telefono_principal', Number(data.telefono_principal))
                    Form.append('telefono_secundario', Number(data.telefono_secundario))
                    Form.append('correo', data.correo)
                    Form.append('fecha_nacimiento', data.fecha_nacimiento)
                    Form.append('nivel', Number(data.nivel))
                    Form.append('genero', Number(data.genero))
                    Form.append('img_perfil', $archivo?$archivo:null)
                }
                Form.append('img_perfil', $archivo?$archivo:null)
                alertLoading("Cargando")
                const res = recreador.id? await recreadores.putData(Form, recreador.id) : await recreadores.postData(Form)
                
                controlResultPost({
                    respuesta: res,
                    messageExito:recreador.id? texts.successMessage.editionRecreador : texts.successMessage.registerRecreador,
                    useNavigate: { navigate: navigate, direction: "/recreadores" }
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
        <Navbar name={`${recreador.id? texts.pages.editRecreadores.name : texts.pages.registerRecreadores.name}`} descripcion={`${recreador.id? texts.pages.editRecreadores.description : texts.pages.registerRecreadores.description}`}>
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
                                <form className="w-100 d-flex flex-column" encType="multiport/form-data"
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
                                        } 
                                    />
                                    <div className="w-100">
                                        <InputImgPerfil name="img_perfil" id="img_perfil" label={`${texts.label.fotoRecreador}`} form={{ errors, register }} imgPerfil={recreador.img}/>
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
                                                        if(!recreador.id){
                                                            getPersona({
                                                                dataNewUser:{tipo_documento: e.target.value, numero_documento: dataNewUser.numero_documento},
                                                                setPersona,
                                                                setValue,
                                                                setDisabledInputs
                                                            })
                                                        }
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
                                                        if (debounceTimeout) {
                                                            clearTimeout(debounceTimeout);
                                                        }
                                                        const timeout = setTimeout(() => {
                                                            if(!recreador.id){
                                                                getPersona({
                                                                    dataNewUser:{tipo_documento: dataNewUser.tipo_documento, numero_documento: e.target.value},
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
                                                    if(!recreador.id){
                                                        getPersona({
                                                            dataNewUser,
                                                            setPersona,
                                                            setValue,
                                                            setDisabledInputs
                                                        })
                                                    }
                                                }}
                                                disabled={disabledInputs}
                                                placeholder={texts.placeholder.numeroDocumento}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-item-center">
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"text"} label={`${texts.label.namesRecreador}`} 
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
                                            <InputsGeneral type={"text"} label={`${texts.label.lastNamesRecreador}`} 
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
                                        <div className="w-100 w-md-50 pe-0 pe-md-3">
                                            <InputsGeneral type={"date"} label={`${texts.label.birthDate}`} 
                                                name="fecha_nacimiento" id="fecha_nacimiento" form={{ errors, register }}
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
                                                options={data_generos}
                                                params={{
                                                    validate: (value) => {
                                                        if ((value === "")) {
                                                            return texts.inputsMessage.seletGenero
                                                        } else {
                                                            return true
                                                        }
                                                    }
                                                }}

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
                                        {recreador.id? "Guardar" : "Registrar"}
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