import { useState, useEffect, useRef } from "react";
import { InputsGeneral, InputTextTarea, MultiSelect } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { actividades, materiales } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { hasLeadingOrTrailingSpace, coincidences } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon";

function Actividades() {
  const [errorServer, setErrorServer] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState([]);
  const [optionsDefault, setOptionsDefault] = useState([]);
  const navigate = useNavigate();
  const renderizado = useRef(0);
  const params = useParams();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_materiales()
      setLoading(false)
      return
    }
  }, [])

  useEffect(() => {
    if (options.length) {
      if (params.id) {
        get_actividades()
      }
    }
  }, [options])

  //* funcion para buscar los permisos en la vase de datos
  const get_materiales = async () => {
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
      if (!params.id) {
        setLoading(false)
      }
    }
  }

  const get_actividades = async () => {
    try {
      const respuesta = await actividades.get({subDominio:[Number(params.id)]})
      if (respuesta.status !== 200) {
        setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
        return
      }
      if (respuesta.data.status === false) {
        setErrorServer(`${respuesta.data.message}`)
        return
      }
      setErrorServer("")
      setValue("nombre", respuesta.data.data.nombre)
      setValue("descripcion", respuesta.data.data.descripcion)
      setOptionsDefault(coincidences(options, respuesta.data.data.materiales))
      setSelectOptions(coincidences(options, respuesta.data.data.materiales))
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
        const message = params.id ? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
        const confirmacion = await alertConfim("Confirmar", message)
        if (confirmacion.isConfirmed) {
          const materiales = selectOptions.map((elements) => { return elements.value })
          const body = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            materiales: materiales
          }
          alertLoading("Cargando")
          const res = params.id ? await actividades.put(body, Number(params.id)) : await actividades.post(body)
          controlResultPost({
            respuesta: res,
            messageExito: params.id ? texts.successMessage.editionActividad : texts.successMessage.registerActividad,
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
    <Navbar name={params.id ? texts.pages.editActividad.name : texts.pages.registerActividades.name} descripcion={params.id ? texts.pages.editActividades.description : texts.pages.registerActividades.description}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/actividades") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                  <MultiSelect id="materiales" name="materiales" label={texts.label.materiales} options={options} placeholder="Materiales" save={setSelectOptions} optionsDefault={optionsDefault} />
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

export default Actividades