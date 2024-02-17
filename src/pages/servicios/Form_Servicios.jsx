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
import { InputText, InputTextTarea, InputCheck, MultiSelect } from "../../components/input/Input"
import ErrorSystem from "../../components/ErrorSystem";
import { hasLeadingOrTrailingSpace } from "../../js/functions.js"

function Form_Servicios() {
  const [loading, setLoading] = useState(true)
  const [errorServer, setErrorServer] = useState("")
  const [dataRecreadores, setDataRecreadores] = useState([])
  const [dataMateriales, setDataMateriales] = useState([])
  const [dataActividades, setDataActividades] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
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
        setDataRecreadores
      })
      verificacion_options({
        respuesta: getMateriales,
        setError: setErrorServer,
        setDataMateriales
      })
      verificacion_options({
        respuesta: getActividades,
        setError: setErrorServer,
        setDataActividades
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

  return (
    <Navbar name="Registrar un Cargo" descripcion="Intruduzca los datos para agregar un nuevo cargo">
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/cargos") }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.939 4.939 6.879 12l7.06 7.061 2.122-2.122L11.121 12l4.94-4.939z"></path></svg> Regresar</ButtonSimple>
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