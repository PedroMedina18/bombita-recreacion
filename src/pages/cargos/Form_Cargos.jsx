import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { permisos, cargos } from "../../js/API.js";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button"
import { alertConfim, toastError, alertLoading } from "../../js/alerts.js"
import { InputText, InputTextTarea, InputCheck, MultiSelect } from "../../components/input/Input"
import ErrorSystem from "../../components/ErrorSystem";
import {hasLeadingOrTrailingSpace} from "../../js/functions.js"

function Cargos() {
    const [loading, setLoading] = useState(true)
    const [errorServer, setErrorServer] = useState("")
    const [options, setOptions] = useState([])
    const [selectOptions, setSelectOptions] = useState([])
    const { verificacion_options, controlResultPost } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        get_Permisos()
    }, [])

    // funcion para buscar los permisos en la vase de datos
    const get_Permisos = async () => {
        try {
            const res = await permisos.get()
            verificacion_options({
                respuesta:res,
                setError:setErrorServer,
                setOptions
            })
        } catch (error) {
            console.log(error)
            setErrorServer("Error de Sistema")
        } finally{
            setLoading(false)
        }
    }
    // the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();

    // Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const permisos = selectOptions.map((elements) => { return elements.value })
                const confirmacion = await alertConfim("Confirmar", "Por favor confirmar la solicitud de Registro")
                if (confirmacion.isConfirmed) {
                    const body = {
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        administrador: data.administrador,
                        permisos: permisos
                    }
                    alertLoading("Cargando")
                    const res = await cargos.post(body)
                    controlResultPost({
                        respuesta:res, 
                        messageExito:"Cargo Registrado", 
                        navigate:"/cargos"
                    })
                }
            } catch (error) {
                console.log(error)
                Swal.close()
                toastError("Error de Conexión",
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                )
            }
        }
    )

    return (
        <Navbar  name="Registrar un Cargo" descripcion="Intruduzca los datos para agregar un nuevo cargo">
            <ButtonSimple type="button" className="mb-2" onClick={()=>{navigate("/cargos")}}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z"></path></svg> Regresar</ButtonSimple>
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
                                    onSubmit={onSubmit}>
                                    <InputText label="Nombre" name="nombre" id="nombre" form={{ errors, register }}
                                        params={{
                                            required: {
                                                value: true,
                                                message: "Se requiere un nombre",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "Máximo 50 caracteres",
                                            },
                                            pattern: {
                                                value: /^[a-zA-ZÁ-ÿ\s]+$/,
                                                message: "Nombre invalido",
                                            },
                                            validate:(value)=>{
                                                if(hasLeadingOrTrailingSpace(value)){
                                                    return "Sin espacios al inicio o al final"
                                                }else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                    <InputTextTarea label="Descripcion" name="descripcion" id="descripcion" form={{ errors, register }}
                                        params={{
                                            maxLength: {
                                                value: 500,
                                                message: "Máximo 500 caracteres",
                                            },
                                            validate:(value)=>{
                                                if(hasLeadingOrTrailingSpace(value)){
                                                    return "Sin espacios al inicio o al final"
                                                }else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                    <InputCheck label="Administrador" name="administrador" id="administrador" form={{ errors, register }} isError={Boolean(!selectOptions.length)}
                                        params={{
                                            validate: (value) => {
                                                if (!selectOptions.length && !value) {
                                                    return "Seleccione los permisos"
                                                } else {
                                                    return true
                                                }
                                            }
                                        }}
                                    />
                                    {
                                        !watch("administrador") ?
                                            (<MultiSelect name="Permisos" id="permisos" options={options} save={setSelectOptions} placeholder={"Permisos"} />)
                                            :
                                            ""
                                    }
                                    {Boolean(!selectOptions.length && errors["administrador"]) ? <span className="message-error visible">Seleccione los permisos del Cargo</span> : <span className="message-error invisible">Sin errores</span>}
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

export default Cargos