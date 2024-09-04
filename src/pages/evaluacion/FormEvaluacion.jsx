import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { RadioStart, InputTextTarea } from "../../components/input/Inputs.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { evaluacion } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { formatoId, hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { controlErrors, controlResultPost } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import CardRecreador from "../../components/card/CardRecreador.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import { useAuthContext } from '../../context/AuthContext.jsx';
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import Swal from 'sweetalert2';
import pattern from "../../context/pattern.js";

function FormEvaluacion() {
  const navigate = useNavigate();
  const params = useParams();
  const renderizado = useRef(0)
  const [loading, setLoading] = useState(true)
  const [errorServer, setErrorServer] = useState("")
  const [dataEvaluacion, setData] = useState(null)
  const [valueRecreadores, setValueRecreador] = useState([])
  const [valuePreguntas, setValPreguntas] = useState([])

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_evaluacion()

    }
  }, []);

  //* the useform
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const confirmacion = await alertConfim("Confirmar", "Esta es su Evaluación?");
      if (!confirmacion) {
        return;
      }
      const body={
        evento:Number(params.id),
        recreadores:valueRecreadores,
        preguntas:valuePreguntas,
        opinion:data.opinion
      }
      alertLoading("Cargando")
      const res = await evaluacion.post(body);
      controlResultPost({
        respuesta: res,
        messageExito: "Muchas Gracias por su evaluacion",
        useNavigate: { navigate: navigate, direction: `/eventos/${params.id}` },
      });
    } catch (error) {
      console.log(error);
      Swal.close();
      toastError(texts.errorMessage.errorConexion);
    }
  });

  const get_evaluacion = async () => {
    try {
      const respuesta = await evaluacion.get({ subDominio: [Number(params.id)] })
      const errors = controlErrors({ respuesta: respuesta, constrolError: setErrorServer })
      if (errors) return
      const data = respuesta.data.data
      setErrorServer("")
      const listPreguntas = data.preguntas.map((e) => {
        return {
          id: e.id,
          value: e.value? e.value : 0 
        }
      })
      const listRcreadores = data.recreadores.map((e) => {
        return {
          id: e.id,
          value: e.value? e.value : 0 
        }
      })
      setData(data)
      setValue("opinion", data.evento.opinion)
      setValPreguntas(listPreguntas)
      setValueRecreador(listRcreadores)

    } catch (error) {
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Navbar name={texts.pages.evaluacion.name} descripcion={texts.pages.evaluacion.description}>
      <ButtonSimple type="button" className="mb-3"
        onClick={() => {
          navigate(`/eventos/${params.id}`);
        }}
      >
        <IconRowLeft />
        Regresar
      </ButtonSimple>

      {loading ?
        (
          <div className="div-main justify-content-center p-4">
            <LoaderCircle />
          </div>
        )
        : errorServer ?
          (
            <div className="div-main justify-content-center p-4">
              <ErrorSystem error={errorServer} />
            </div>
          )
          :
          (
            <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
              <form className="w-100 d-flex flex-column" onSubmit={onSubmit}>
                <h1 className='mb-2 fw-bold text-center'>Evaluacion Evento N°{formatoId(dataEvaluacion.evento.id)}</h1>
                <div id="carouselExample" className="carousel slide">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <div className='w-100 d-flex flex-column justify-content-center align-items-center'>
                        <div className='w-100 px-3 d-flex flex-wrap justify-content-center align-items-center'>
                          {
                            dataEvaluacion.preguntas?.map((e, index) => (
                              <div className='mx-3 mb-4 d-flex flex-column w-100 w-md-40' key={`pregunta-start-${index}`}>
                                <p className='fw-bold mb-1 text-center'>{e.pregunta}</p>
                                <RadioStart id={e.id} save={setValPreguntas} state={valuePreguntas} index={index} name={`pregunta-${index}`} check={Number(e.value)}/>
                              </div>
                            ))
                          }
                        </div>
                        <div className='w-100 w-md-50'>
                          <InputTextTarea label={`${texts.label.opinion}`} name="opinion" id="opinion" form={{ errors, register }}
                            params={{
                              required: {
                                value: true,
                                message: texts.inputsMessage.requiredOpinion,
                              },
                              maxLength: {
                                value: 300,
                                message: texts.inputsMessage.max300
                              },
                              validate: (value) => {
                                if (hasLeadingOrTrailingSpace(value)) {
                                  return texts.inputsMessage.noneSpace
                                } else {
                                  return true
                                }
                              }
                            }}
                            disabled={Boolean(dataEvaluacion.evento.evaluado)}
                            placeholder={texts.placeholder.opinion}
                          />
                        </div>
                        <ButtonSimple type="button" data-bs-target="#carouselExample" data-bs-slide="next">Siguiente</ButtonSimple>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <div className='w-100 d-flex flex-column justify-content-center align-items-center'>
                        <div className='w-100 px-3 d-flex flex-wrap justify-content-center align-items-center'>
                          {
                            dataEvaluacion.recreadores?.map((e, index) => (
                              <div className='mx-3 mb-5 d-flex flex-column justify-content-center align-items-center w-100 w-md-40' key={`recreador-start-${index}`}>
                                <CardRecreador img={e.img} nombre={`${e.nombres} ${e.apellidos}`}/>
                                <RadioStart id={e.id} save={setValueRecreador} state={valueRecreadores} index={index} name={`recreador-${index}`} check={Number(e.value)}/>
                              </div>
                            ))
                          }
                        </div>
                        <div className='w-100 w-md-50 d-flex justify-content-center'>
                        <ButtonSimple className={"mx-3"} type="button" data-bs-target="#carouselExample" data-bs-slide="prev">Regresar</ButtonSimple>
                        <ButtonSimple disabled={Boolean(dataEvaluacion.evento.evaluado)} className={"mx-3"} type="submit" >Guardar</ButtonSimple>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
      <Toaster />
    </Navbar>
  )
}

export default FormEvaluacion