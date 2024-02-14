import { useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import { InputText, InputTextTarea } from "../../components/input/Input"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { niveles } from "../../js/API.js";
import { alertConfim, toastError, alertLoading } from "../../js/alerts.js"
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace } from "../../js/functions.js"

function Form_Niveles() {
    const { controlResultPost } = useContext(AuthContext)
    const navigate = useNavigate();

    // the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

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
                    const res = await niveles.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: "Nivel Registrado",
                        navigate: "/niveles"
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
        <Navbar name="Registrar un nuevo Nivel" descripcion="Intruduzca los datos para agregar un nuevo nivel">
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/niveles") }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z"></path></svg> Regresar</ButtonSimple>

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

export default Form_Niveles