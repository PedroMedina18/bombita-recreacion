import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { InputsGeneral, InputTextTarea, MultiSelect } from "../../components/input/Inputs.jsx";
import { useAuthContext } from '../../context/AuthContext.jsx';
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useForm } from "react-hook-form";
import { actividades,  } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { controlResultPost, controlErrors } from "../../utils/actions.jsx";
import { hasLeadingOrTrailingSpace, coincidences } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { IconRowLeft } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function FormActividades() {
  const {dataOptions, getOption} = useAuthContext()
  const [materiales] = useState(dataOptions().materiales)
  const [errorServer, setErrorServer] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState([]);
  const [optionsDefault, setOptionsDefault] = useState([]);
  const navigate = useNavigate();
  const renderizado = useRef(0);
  const params = useParams();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      if (params.id) {
        get_actividad()
      }
      return
    }
  }, [])
  const get_actividad = async () => {
    try {
      const respuesta = await actividades.get({subDominio:[Number(params.id)]})
      const errors = controlErrors({respuesta: respuesta, constrolError:setErrorServer})
      if(errors) return
      const data = respuesta.data.data
      setErrorServer("")
      setValue("nombre", data.nombre)
      setValue("descripcion", data.descripcion)
      setOptionsDefault(coincidences(materiales, data.materiales))
      setSelectOptions(coincidences(materiales, data.materiales))
    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
    }
  }


  //* the useform
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  //* Funcion para registrar
  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const message = params.id ? texts.confirmMessage.confirmEdit : texts.confirmMessage.confirmRegister
        const confirmacion = await alertConfim("Confirmar", message)
        if (confirmacion.isConfirmed) {
          const materiales = selectOptions.map((elements) => { return elements.value })
          const body = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            materiales: materiales
          }
          alertLoading("Cargando")
          const res = params.id ? await actividades.put(body, { subDominio:[Number(params.id)]}) : await actividades.post(body)
          controlResultPost({
            respuesta: res,
            messageExito: params.id ? texts.successMessage.editionActividad : texts.successMessage.registerActividad,
            useNavigate: { navigate: navigate, direction: "/actividades/" },
            callbak: ()=>{getOption("actividad")}
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
    <Navbar name={params.id ? texts.pages.editActividad.name : texts.pages.registerActividades.name} descripcion={params.id ? texts.pages.editActividad.description : texts.pages.registerActividades.description}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/actividades/") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
              <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
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
                    placeholder={texts.placeholder.nameActividad}
                  />
                  <InputTextTarea label={texts.label.descripcion} name="descripcion" id="descripcion" form={{ errors, register }}
                    params={{
                      required: {
                        value: true,
                        message: texts.inputsMessage.requiredDesription,
                      },
                      maxLength: {
                        value: 300,
                        message: texts.inputsMessage.max300,
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
                  <MultiSelect id="materiales" name="materiales" label={texts.label.materiales} options={materiales} placeholder="Materiales" save={setSelectOptions} optionsDefault={optionsDefault} />
                  <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                    {params.id ? "Guardar" : "Registrar"}
                  </ButtonSimple>
                </form>
              </div>
            )
      }
      <Toaster closeButton={true} />
    </Navbar>
  )
}

export default FormActividades