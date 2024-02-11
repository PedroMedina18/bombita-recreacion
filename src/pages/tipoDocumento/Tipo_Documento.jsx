import Navbar from "../../components/navbar/Navbar"
import { InputText, InputTextTarea } from "../../components/input/Input"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { tipo_documentos } from "../../js/API.js";
import { alertConfim, toastError, alertLoading, alertAceptar } from "../../js/alerts.js"
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace } from "../../js/funtions.js"

function Tipo_Documento() {
    const navigate = useNavigate();

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
                const confirmacion = await alertConfim("Confirmar", "Por favor confirmar la solicitud de Registro")
                if (confirmacion.isConfirmed) {
                    const body = {
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                    }
                    alertLoading("Cargando")
                    const res = await tipo_documentos.post(body)
                    if (res.status = 200) {
                        if (res.data.status) {
                            Swal.close()
                            const aceptar=await alertAceptar("Exito!", "Tipo de Documento Registrado")
                            if(aceptar.isConfirmed){navigate("/inicio")}
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
                console.log(error)
                Swal.close()
                toastError("Error de Conexión",
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                )
            }
        }
    )

    return (
        <Navbar name="Registrar un Tipo de Documento" descripcion="Intruduzca los datos para agregar un nuevo tipo de documento">
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
                            validate: (value) => {
                                if (hasLeadingOrTrailingSpace(value)) {
                                    return "Sin espacios al inicio o al final"
                                } else {
                                    return true
                                }
                            }
                        }}
                    />
                    <InputTextTarea label="Descripcion" name="descripcion" id="descripcion" form={{ errors, register }}
                        params={{
                            maxLength: {
                                value: 200,
                                message: "Máximo 200 caracteres",
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
                    <ButtonSimple type="submit" className="mx-auto w-50 mt-5">
                        Registrar
                    </ButtonSimple>
                </form>
            </div>
            <Toaster />
        </Navbar>
    )
}

export default Tipo_Documento