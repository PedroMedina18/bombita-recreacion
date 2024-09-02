import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';
import { permisos, cargos } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { InputsGeneral, InputTextTarea, InputCheckRadio, MultiSelect, InputImgPerfil } from "../../components/input/Inputs.jsx";
import { controlErrors, verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { hasLeadingOrTrailingSpace, coincidences } from "../../utils/process.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import { useAuthContext } from '../../context/AuthContext.jsx';
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function FormCargos() {
    const [loading, setLoading] = useState(true);
    const [errorServer, setErrorServer] = useState("");
    const [permisosList, setPermisosList] = useState([]);
    const [imgLogo, setImgLogo] = useState(null);
    const [permisosDefault, setPermisosDefault] = useState([]);
    const [selectPermisos, setSelectPermisos] = useState([]);
    const [checkInput, setCheckInput] = useState(false);
    const {getOption} = useAuthContext();
    const navigate = useNavigate();
    const renderizado = useRef(0);
    const params = useParams();

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            get_Permisos()
            return
        }
    }, [])

    useEffect(() => {
        if (permisosList.length) {
            if (params.id) {
                get_cargos()
            }
        }
    }, [permisosList])

    // *funcion para buscar los permisos en la base de datos
    const get_Permisos = async () => {
        try {
            const res = await permisos.get()
            verifyOptionsSelect({
                respuesta: res,
                setOptions: setPermisosList,
                label:(e)=>{return e.nombre}
            })
        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
        } finally {
            if (!params.id) {
                setLoading(false)
            }
        }
    }

    const get_cargos = async () => {
        try {
            const respuesta = await cargos.get({ subDominio: [Number(params.id)] })
            const errors = controlErrors({ respuesta: respuesta, constrolError: setErrorServer })
            if (errors) return
            const data = respuesta.data.data
            setErrorServer("")
            if (data.permisos) {
                setPermisosDefault(coincidences(permisosList, data.permisos))
                setSelectPermisos(coincidences(permisosList, data.permisos))
            }
            setValue("nombre", data.nombre)
            setValue("descripcion", data.descripcion)
            setValue("administrador", data.administrador ? true : false)
            setCheckInput(data.administrador ? true : false)
            setImgLogo(data.img ? data.img : null)
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
        setValue,
        formState: { errors },
        watch
    } = useForm();

    // * Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const permisos = selectPermisos.map((elements) => { return elements.value })
                const $archivo = document.getElementById(`icono`).files[0]
                const message = params.id ? texts.confirmMessage.confirmEdit : texts.confirmMessage.confirmRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const Form = new FormData()
                    Form.append('nombre', data.nombre)
                    Form.append('descripcion', data.descripcion)
                    Form.append('administrador', data.administrador)
                    Form.append('permisos', permisos)
                    Form.append('img', $archivo ? $archivo : null)
                    alertLoading("Cargando")
                    const res = params.id ? await cargos.putData(Form, { subDominio: [Number(params.id)] }) : await cargos.postData(Form)
                    controlResultPost({
                        respuesta: res,
                        messageExito: params.id ? texts.successMessage.editionCargo : texts.successMessage.registerCargo,
                        useNavigate: { navigate: navigate, direction: "/cargos/" },
                        callbak:()=>{getOption("cargo")}
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
        <Navbar name={params.id ? texts.pages.editCargo.name : texts.pages.registerCargos.name} descripcion={params.id ? texts.pages.editCargo.description : texts.pages.registerCargos.description}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/cargos/") }}> <IconRowLeft /> Regresar</ButtonSimple>
            {
                loading ?
                    (
                        <div className="div-main justify-content-center">
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
                            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">

                                <form className="w-100 d-flex flex-column" encType="multiport/form-data"
                                    onSubmit={onSubmit}>
                                    <InputsGeneral type={"text"} label={`${texts.label.nombre}`} name="nombre" id="nombre" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requireName,
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: texts.inputsMessage.max50,
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
                                        placeholder={texts.placeholder.nameCargo}
                                    />
                                    <InputTextTarea label={`${texts.label.descripcion}`} name="descripcion" id="descripcion" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requiredDesription,
                                            },
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
                                        placeholder={texts.placeholder.descripcion}
                                    />
                                    <InputCheckRadio label={`${texts.label.admin}`} name="administrador" id="administrador" form={{ errors, register }} isError={Boolean(!selectPermisos.length)} checked={checkInput}
                                        params={{
                                            validate: (value) => {
                                                if (!selectPermisos.length && !value) {
                                                    return texts.inputsMessage.noneSpace
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                        onClick={
                                            (e) => {
                                                setCheckInput(!checkInput)
                                            }
                                        }
                                    />
                                    {
                                        !watch("administrador") ?
                                            (
                                                <div className={`${Boolean(!selectPermisos.length && errors["administrador"]) ? "error" : ""}`}>

                                                    <MultiSelect name="permisos" label={`${texts.label.permisos}`} id="permisos" options={permisosList} save={setSelectPermisos} optionsDefault={permisosDefault} placeholder={"Permisos"} />
                                                </div>
                                            )
                                            :
                                            ""
                                    }
                                    {Boolean(!selectPermisos.length && errors["administrador"]) ? <span className="message-error visible">{texts.inputsMessage.selecPermisos}</span> : <span className="message-error invisible">Sin errores</span>}

                                    <div className="w-100 mt-2">
                                        <InputImgPerfil name="icono" id="icono" label={`Icono`} form={{ errors, register }} tamaño="sm" imgPerfil={imgLogo} />
                                    </div>


                                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                                        {params.id ? "Guardar" : "Registrar"}
                                    </ButtonSimple>
                                </form>
                            </div>
                        )
            }
            <Toaster />
        </Navbar>
    )
}

export default FormCargos