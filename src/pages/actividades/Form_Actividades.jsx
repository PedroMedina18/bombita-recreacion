import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar";
import { InputText, InputTextTarea, MultiSelect } from "../../components/input/Input";
import { ButtonSimple } from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { actividades, materiales } from "../../js/API.js";
import { alertConfim, toastError, alertLoading } from "../../js/alerts.js";
import { LoaderCircle } from "../../components/loader/Loader";
import ErrorSystem from "../../components/ErrorSystem";
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { hasLeadingOrTrailingSpace } from "../../js/functions.js";

function Actividades() {
  const [errorServer, setErrorServer] = useState("")
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const { controlResultPost, verificacion_options } = useContext(AuthContext)
  const [selectOptions, setSelectOptions] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    get_Materiales()
  }, [])

  // funcion para buscar los permisos en la vase de datos
  const get_Materiales = async () => {
    try {
      const res = await materiales.get()
      verificacion_options({
        respuesta: res,
        setError: setErrorServer,
        setOptions
      })
    } catch (error) {
      console.log(error)
      setErrorServer("Error de Sistema")
    } finally {
      setLoading(false)
    }
  }

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
          const materiales = selectOptions.map((elements) => { return elements.value })
          const body = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            materiales:materiales
          }
          alertLoading("Cargando")
          const res = await actividades.post(body)
          controlResultPost({
            respuesta: res,
            messageExito: "Actividad Registrado",
            useNavigate:{navigate:navigate, direction:"/actividades"}
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
    <Navbar name="Registrar una Actividad" descripcion="Intruduzca los datos para agregar una nueva Actividad">
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/actividades") }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z"></path></svg> Regresar</ButtonSimple>

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
                  <MultiSelect id="materiales" name="materiales" label="Materiales" options={options} placeholder="Materiales"  save={setSelectOptions}/>
                  <ButtonSimple type="submit" className="mx-auto w-50 mt-5">
                    Registrar
                  </ButtonSimple>
                </form>
              </div>
            )
      }
      <Toaster closeButton={true} />
    </Navbar>
  )
}

export default Actividades