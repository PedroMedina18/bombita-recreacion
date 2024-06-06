import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { permisos, cargos } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button"
import { alertConfim, toastError, alertLoading } from "../../utils/alerts.jsx"
import { InputsGeneral, InputTextTarea, InputCheck, MultiSelect, InputImgPerfil } from "../../components/input/Input"
import {verifyOptionsSelect, controlResultPost} from "../../utils/actions.jsx"
import {hasLeadingOrTrailingSpace} from "../../utils/process.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem";
import Navbar from "../../components/navbar/Navbar"
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import {IconRowLeft} from "../../components/Icon"

function Cargos() {
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [options, setOptions] = useState([])
    const [selectOptions, setSelectOptions] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        get_Permisos()
    }, [])

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
            setLoading(false)
        }
    }

    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    // * Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const permisos = selectOptions.map((elements) => { return elements.value })
                const $archivo = document.getElementById(`icono`).files[0]
                const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirRegister)
                if (confirmacion.isConfirmed) {
                    const Form = new FormData()
                    Form.append('nombre', data.nombre)
                    Form.append('descripcion', data.descripcion)
                    Form.append('administrador', data.administrador)
                    Form.append('permisos', permisos)
                    Form.append('img_logo', $archivo?$archivo:null)
                    alertLoading("Cargando")
                    const res = await cargos.postData(Form)
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
        <Navbar  name={texts.pages.registerCargos.name} descripcion={texts.pages.registerCargos.description}>
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
                                    <InputCheck label={`${texts.label.admin}`} name="administrador" id="administrador" form={{ errors, register }} isError={Boolean(!selectOptions.length)}
                                        params={{
                                            validate: (value) => {
                                                if (!selectOptions.length && !value) {
                                                    return texts.inputsMessage.noneSpace
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                    {
                                        !watch("administrador") ?
                                            (<MultiSelect name="permisos" label={`${texts.label.permisos}`} id="permisos" options={options} save={setSelectOptions} placeholder={"Permisos"} />)
                                            :
                                            ""
                                    }
                                    <div className="w-100 mt-2">
                                        <InputImgPerfil name="icono" id="icono" label={`Icono`} form={{ errors, register }} tamaño="sm"/>
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