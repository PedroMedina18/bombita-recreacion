import { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Swal from 'sweetalert2';
import { Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { recreadores, servicios, materiales, actividades } from "../../js/API.js";
import { LoaderCircle } from "../../components/loader/Loader";
import { ButtonSimple } from "../../components/button/Button"
import { alertConfim, toastError, alertLoading } from "../../js/alerts.js"
import { InputText, InputTextTarea, InputDuration, MultiSelect, InputNumber } from "../../components/input/Input"
import ErrorSystem from "../../components/ErrorSystem";
import { hasLeadingOrTrailingSpace } from "../../js/functions.js"
import texts from "../../context/text_es.js"

function Form_Servicios() {
  const [loading, setLoading] = useState(true)
  const [errorServer, setErrorServer] = useState("")
  const [dataRecreadores, setDataRecreadores] = useState([])
  const [dataMateriales, setDataMateriales] = useState([])
  const [dataActividades, setDataActividades] = useState([])
  const [saveRecreadores, setSaveRecreadores] = useState([])
  const [saveMateriales, setSaveMateriales] = useState([])
  const [saveActividades, setSaveActividades] = useState([])
  const [submit, setSubmit] = useState(false)

  const { verificacion_options, controlResultPost } = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    get_data()
  }, [])

  // funcion para buscar los permisos en la vase de datos
  const get_data = async () => {
    try {
      const getRecreadores = await recreadores.get()
      const getMateriales = await materiales.get()
      const getActividades = await actividades.get()
      verificacion_options({
        respuesta: getRecreadores,
        setError: setErrorServer,
        setOptions: setDataRecreadores
      })
      verificacion_options({
        respuesta: getMateriales,
        setError: setErrorServer,
        setOptions: setDataMateriales
      })
      verificacion_options({
        respuesta: getActividades,
        setError: setErrorServer,
        setOptions: setDataActividades
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
  } = useForm();

  const onSubmit = handleSubmit(
    async (data) => {
      console.log("esta bien")
    }
  )

  return (
    <Navbar name={texts.page.registerServicio.name} descripcion={texts.page.registerServicio.description}>
      <ButtonSimple type="button" className="mb-3" onClick={() => { navigate("/servicios") }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z"></path></svg> Regresar</ButtonSimple>
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
                  <InputText id="nombre" label={texts.label.nombre} name="nombre" form={{ register, errors }} />
                  <div className="w-100 d-flex justify-content-between align-item-center">
                    <div className="w-md-15">
                      <InputDuration id="duracion" label={texts.label.duracion} name="duracion" form={{ register, errors }} />
                    </div>
                    <div className="w-md-20">
                      <InputNumber label={texts.label.recreadores} name="recreadores" id="recreadores" form={{ errors, register }}
                        params={{
                          required: {
                            value: true,
                            message: texts.message.requireRecreadores,
                          },
                        }}
                      />
                    </div>
                    <div className="w-md-15">
                      <InputNumber label={texts.label.precio} name="precio" id="precio" form={{ errors, register }}
                        params={{
                          required: {
                            value: true,
                            message: texts.message.requirePrecio,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-1">
                    <MultiSelect name="recreadores-servicio" label="Recreadores Permitidos" id="recreadores-servicio" options={dataRecreadores} save={setSaveRecreadores} placeholder={"Recreadores"} />
                    {Boolean(!saveRecreadores.length && submit) ? <span className="message-error visible">Seleccione los permisos del Cargo</span> : <span className="message-error invisible">Sin errores</span>}
                  </div>
                  <div className="mb-1">
                    <MultiSelect name="actividades" label="Actividades" id="actividades" options={dataActividades} save={setSaveActividades} placeholder={"Activiades que se realizan"} />
                    {Boolean(!saveActividades.length && submit) ? <span className="message-error visible">Seleccione los permisos del Cargo</span> : <span className="message-error invisible">Sin errores</span>}
                  </div>
                  <div className="mb-1">
                    <MultiSelect name="materiales" label="Materiales" id="materiales" options={dataMateriales} save={setSaveMateriales} placeholder={"Materiales que se necesitan"} />
                    {Boolean(!saveMateriales.length && submit) ? <span className="message-error visible">Seleccione los permisos del Cargo</span> : <span className="message-error invisible">Sin errores</span>}
                  </div>
                  {
                    saveMateriales.length ?
                      saveMateriales.map((element, index) =>
                      (
                        <div key={`${element.label}-${index}`} className="d-flex aling-item-center justify-content-between">
                          <label for={`${element.value}-material`}>{element.label}</label>
                          <input id={`${element.value}-material`} type="number" />
                        </div>
                      ))
                      :
                      ""
                  }

                  <InputTextTarea label={texts.label.descripcion} name="descripcion" id="descripcion" form={{ errors, register }}
                    params={{
                      maxLength: {
                        value: 500,
                        message: texts.message.max500,
                      },
                      validate: (value) => {
                        if (hasLeadingOrTrailingSpace(value)) {
                          return texts.message.noneSpace
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
            )
      }
      <Toaster />
    </Navbar>
  )
}

export default Form_Servicios