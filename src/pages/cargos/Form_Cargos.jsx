import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';
import { permisos, cargos } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { InputsGeneral, InputTextTarea, InputCheck, MultiSelect, InputImgPerfil } from "../../components/input/Inputs.jsx";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { hasLeadingOrTrailingSpace, coincidences } from "../../utils/process.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem";
import Navbar from "../../components/navbar/Navbar";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon";

function Cargos() {
    const [loading, setLoading] = useState(true);
    const [errorServer, setErrorServer] = useState("");
    const [options, setOptions] = useState([]);
    const [imgLogo, setImgLogo] = useState(null)
    const [optionsDefault, setOptionsDefault] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [checkInput, setCheckInput] = useState(false);
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
        if (options.length) {
            if (params.id){
                get_cargos()
            }
        }
    }, [options])

    // *funcion para buscar los permisos en la base de datos
    const get_Permisos = async () => {
        try {
            const res = await permisos.get()
            verifyOptionsSelect({
                respuesta:res,
                setError:setErrorServer,
                setOptions
            })
        } catch (error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
        } finally{
            if (!params.id){
                setLoading(false)
            }
        }
    }

    const get_cargos = async () => {
        try {
            const respuesta = await cargos.get(Number(params.id))
            if (respuesta.status !== 200) {
                setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
                return
            }
            if (respuesta.data.status === false) {
                setErrorServer(`${respuesta.data.message}`)
                return
            } 
            setErrorServer("")
            if(respuesta.data.data.permisos){
                setOptionsDefault(coincidences(options, respuesta.data.data.permisos))
                setSelectOptions(coincidences(options, respuesta.data.data.permisos))
            }
            setValue("nombre", respuesta.data.data.nombre)
            setValue("descripcion", respuesta.data.data.descripcion)
            setValue("administrador", respuesta.data.data.administrador? true : false)
            setCheckInput(respuesta.data.data.administrador? true : false)
            setImgLogo(respuesta.data.data.img_logo? respuesta.data.data.img_logo : null)
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
                const permisos = selectOptions.map((elements) => { return elements.value })
                const $archivo = document.getElementById(`icono`).files[0]
                const message = params.id? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const Form = new FormData()
                    Form.append('nombre', data.nombre)
                    Form.append('descripcion', data.descripcion)
                    Form.append('administrador', data.administrador)
                    Form.append('permisos', permisos)
                    Form.append('img_logo', $archivo?$archivo:null)
                    alertLoading("Cargando")
                    const res = params.id? await cargos.putData(Form, Number(params.id)) : await cargos.postData(Form)
                    controlResultPost({
                        respuesta:res, 
                        messageExito:texts.successMessage.cargo,
                        useNavigate:{navigate:navigate, direction:"/cargos"}
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
        <Navbar  name={params.id? texts.pages.editCargos.name : texts.pages.registerCargos.name} descripcion={params.id? texts.pages.editCargos.description : texts.pages.registerCargos.description}>
            <ButtonSimple type="button" className="mb-2" onClick={()=>{navigate("/cargos")}}> <IconRowLeft/> Regresar</ButtonSimple>
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
                                
                                <form className="w-100 d-flex flex-column"
                                    onSubmit={onSubmit}>
                                    <InputsGeneral type={"text"} label={`${texts.label.nombre}`} name="nombre" id="nombre" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: texts.inputsMessage.requireName,
                                            },
                                            maxLength: {
                                                value: 50,
                                                message:texts.inputsMessage.max50,
                                            },
                                            minLength: {
                                                value: 5,
                                                message: texts.inputsMessage.min5
                                            },
                                            pattern: {
                                                value: pattern.textWithNumber,
                                                message: texts.inputsMessage.invalidName,
                                            },
                                            validate:(value)=>{
                                                if(hasLeadingOrTrailingSpace(value)){
                                                    return texts.inputsMessage.noneSpace
                                                }else {
                                                    return true
                                                }
                                            }
                                        }}
                                        placeholder={"Nombre del Cargo"}
                                    />
                                    <InputTextTarea label={`${texts.label.descripcion}`} name="descripcion" id="descripcion" form={{ errors, register }}
                                        params={{
                                            maxLength: {
                                                value: 500,
                                                message: texts.inputsMessage.max500
                                            },
                                            validate:(value)=>{
                                                if(hasLeadingOrTrailingSpace(value)){
                                                    return texts.inputsMessage.noneSpace
                                                }else {
                                                    return true
                                                }
                                            }
                                        }}
                                        placeholder={texts.placeholder.descripcion}
                                    />
                                    <InputCheck label={`${texts.label.admin}`} name="administrador" id="administrador" form={{ errors, register }} isError={Boolean(!selectOptions.length)} checked={checkInput}
                                        params={{
                                            validate: (value) => {
                                                if (!selectOptions.length && !value) {
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
                                            (<MultiSelect name="permisos" label={`${texts.label.permisos}`} id="permisos" options={options} save={setSelectOptions} optionsDefault={optionsDefault} placeholder={"Permisos"} />)
                                            :
                                            ""
                                    }
                                    <div className="w-100 mt-2">
                                        <InputImgPerfil name="icono" id="icono" label={`Icono`} form={{ errors, register }} tamaño="sm" imgPerfil={imgLogo}/>
                                    </div>

                                    {Boolean(!selectOptions.length && errors["administrador"]) ? <span className="message-error visible">{texts.inputsMessage.selecPermisos}</span> : <span className="message-error invisible">Sin errores</span>}
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

export default Cargos