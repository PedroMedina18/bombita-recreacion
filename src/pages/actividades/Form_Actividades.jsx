import { useState, useEffect } from "react";
import { InputsGeneral, InputTextTarea, MultiSelect } from "../../components/input/Input";
import { ButtonSimple } from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { actividades, materiales } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../utils/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx"
import { hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import {IconRowLeft} from "../../components/Icon"

function Actividades() {
  const [errorServer, setErrorServer] = useState("")
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectOptions, setSelectOptions] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    getMateriales()
  }, [])

  //* funcion para buscar los permisos en la vase de datos
  const getMateriales = async () => {
    try {
      const res = await materiales.get()
      verifyOptionsSelect({
        respuesta: res,
        setError: setErrorServer,
        setOptions
      })
    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorSystem)
    } finally {
      setLoading(false)
    }
  }

  //* the useform
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  //* Funcion para registrar
  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirRegister)
        if (confirmacion.isConfirmed) {
          const materiales = selectOptions.map((elements) => { return elements.value })
          const body = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            materiales: materiales
          }
          alertLoading("Cargando")
          const res = await actividades.post(body)
          controlResultPost({
            respuesta: res,
            messageExito: texts.successMessage.actividades,
            useNavigate: { navigate: navigate, direction: "/actividades" }
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
    <Navbar name={texts.pages.registerActividades.name} descripcion={texts.pages.registerActividades.description}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/actividades") }}> <IconRowLeft/> Regresar</ButtonSimple>

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
                  <InputsGeneral type={"text"} label={texts.label.nombre} name="nombre" id="nombre" form={{ errors, register }}
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
                  />
                  <InputTextTarea label={texts.label.descripcion} name="descripcion" id="descripcion" form={{ errors, register }}
                    params={{
                      maxLength: {
                        value: 200,
                        message: texts.inputsMessage.max200,
                      },
                      validate: (value) => {
                        if (hasLeadingOrTrailingSpace(value)) {
                          return texts.inputsMessage.noneSpace
                        } else {
                          return true
                        }
                      }
                    }}
                  />
                  <MultiSelect id="materiales" name="materiales" label={texts.label.materiales} options={options} placeholder="Materiales" save={setSelectOptions} />
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