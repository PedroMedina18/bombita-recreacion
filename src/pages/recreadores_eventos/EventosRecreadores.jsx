import { useState, useEffect, useRef } from "react";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { SelectAsync } from "../../components/input/Inputs.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { recreadores, eventos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour, calcularEdad } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon.jsx";
import CardRecreador from "../../components/card/CardRecreador.jsx"

function EventosRecreadores() {
  const navigate = useNavigate();
  const params = useParams();
  const renderizado = useRef(0);
  const [dataEvento, setEvento] = useState({});
  const [dataServicios, setDataServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listRecreadores, setListRecreadores] = useState([]);
  const [errorServer, setErrorServer] = useState("");
  const [isRecreadores, setIsRecreadores] = useState(false)

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const evento = await eventos.get({ subDominio: [Number(params.id_evento)]})
      const recreadoresEvento = await eventos.get({ subDominio: ["recreadores", Number(params.id_evento)] })
      const listRecreadores = await recreadores.get()

      if (evento.status !== 200 || evento.data.status === false) {
        setErrorServer('Error. Conexión Evento')
        return
      }
      if (recreadoresEvento.status !== 200 || recreadoresEvento.data.status === false) {
        setErrorServer('Error. Conexión  de Recreadores')
        return
      }
      if (listRecreadores.status !== 200 || listRecreadores.data.status === false) {
        setErrorServer('Error. Conexión  de lista de  Recreadores')
        return
      }
      if (evento.data.data.info.id !== recreadoresEvento.data.data.evento) {
        setErrorServer('Error. Inconsistencias en la información proporcionada')
        return
      }

      setEvento({
        ...dataEvento,
        ...evento.data.data
      })

      setDataServicios(recreadoresEvento.data.data.servicios)
      setIsRecreadores(recreadoresEvento.data.data.isRecreadores)
      setListRecreadores(listRecreadores.data.data)
    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
    }
  }

  const cardsRecreadores = ({ servicio, indexServicio }) => {
    const list = []
    for (let index = 0; index < servicio.numero_recreadores; index++) {
      const recreador = servicio.recreadores[index] ? servicio.recreadores[index] : null;

      list.push(
        <CardRecreadorSelect key={`card_${index}_${servicio.nombre}`}
          id={`card_${index}_${servicio.nombre}`}
          recreador={recreador}
          optionsDefault={listRecreadores}
          dataFuntion={{
            indexRecreador: index,
            indexServicio,
            dataServicios,
            setDataServicios
          }}
        />)
    }
    return list
  }

  const onSubmit = async () => {
    try {
      const message = isRecreadores ? texts.confirmMessage.confirEdit : texts.confirmMessage.confirRegister
      const confirmacion = await alertConfim("Confirmar", message)
      if (confirmacion.isConfirmed) {
        const evento = Number(params.id_evento)
        const recreadores = []
        dataServicios.forEach((servicio) => {
          servicio.recreadores.forEach((recreador) => {
            recreadores.push({ id: recreador.id, servicio: servicio.id })
          })
        })
        const data = {
          evento: evento,
          recreadores: recreadores
        }
        const respuesta = isRecreadores ? await eventos.put(data, { subDominio: ["recreadores"] }) : await eventos.post(data, { subDominio: ["recreadores"] })
        controlResultPost({
          respuesta: respuesta,
          messageExito: isRecreadores ? texts.successMessage.editionEventoRecreadores : texts.successMessage.registerEventoRecreadores,
          useNavigate: { navigate: navigate, direction: "/eventos/" }
        })
      }
    } catch (error) {
      console.log(error)
      Swal.close()
      toastError(texts.errorMessage.errorConexion)
    }

  }

  return (
    <Navbar name={`${texts.pages.recreadores_eventos.name}`} descripcion={`${texts.pages.recreadores_eventos.description}`}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/eventos/") }}><IconRowLeft /> Regresar</ButtonSimple>
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
              <div className="div-main  px-3 px-md-4 px-lg-5 py-3">
                <div className='d-flex justify-content-between flex-wrap w-100'>
                  <div className='d-flex flex-column pe-2 mb-1 flex-fill'>
                    <strong>Evento:</strong>
                    <p className='m-0'>{formatoId(dataEvento.info.id)}</p>
                  </div>
                  <div className='d-flex flex-column px-2 mb-1 flex-fill'>
                    <strong>Documento:</strong>
                    <p className='m-0'>{`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Cliente:</strong>
                    <p className='m-0'>{`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Fecha:</strong>
                    <p className='m-0'>{`${formatDateWithTime12Hour(dataEvento.info.fecha_evento_inicio)}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Numero de Asistentes:</strong>
                    <p className='m-0'>{`${dataEvento.info.numero_personas}`}</p>
                  </div>
                </div>
                {
                  dataServicios.map((servicio, index) => (
                    <div className="w-100 d-flex flex-column mb-5" key={`container_${index}`}>
                      <hr className="w-100" />
                      <div className="d-flex flex-column flex-sm-row mb-4">
                        <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                          <strong>Servicio:</strong>
                          <p className='m-0'>{`${servicio.nombre}`}</p>
                        </div>
                        <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                          <strong>Número de Recreadores:</strong>
                          <p className='m-0'>{servicio.numero_recreadores}</p>
                        </div>
                        <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                          <strong>Duración:</strong>
                          <p className='m-0'>{`${servicio.duracion.horas < 10 ? `0${servicio.duracion.horas}` : servicio.duracion.horas}:${servicio.duracion.minutos < 10 ? `0${servicio.duracion.minutos}` : servicio.duracion.minutos}`}</p>
                        </div>

                      </div>
                      <div className="w-100 d-flex justify-content-evenly flex-wrap ">
                        {
                          cardsRecreadores({ servicio: servicio, indexServicio: index })
                        }
                      </div>

                    </div>
                  ))
                }
                <ButtonSimple className="mx-auto w-50 mt-5" onClick={onSubmit}>
                  Guardar
                </ButtonSimple>
              </div>
            )
      }
      <Toaster/>
    </Navbar>
  )
}


function CardRecreadorSelect({ recreador, id, optionsDefault, dataFuntion }) {
  const [value, setRecreador] = useState(recreador? recreador : null)
  const [debounceTimeoutRecreador, setDebounceTimeoutRecreador] = useState(null);
  const { indexServicio, indexRecreador, dataServicios, setDataServicios } = dataFuntion
  
  useEffect(()=>{
    console.log(recreador)
  },[value])



  const loadOptionsRecreador = (inputValue, callback) => {
    if (debounceTimeoutRecreador) {
      clearTimeout(debounceTimeoutRecreador);
    }

    const timeout = setTimeout(async () => {
      try {
        const respuesta = await recreadores.get({ subDominio: [inputValue] })
        if (respuesta.status !== 200) {
          callback([])
        }
        if (respuesta.data.status === false) {
          callback([])
        }
        callback(respuesta.data.data)
      }
      catch {
        callback([])
      }
    }, 800);

    setDebounceTimeoutRecreador(timeout);
  }

  return (
    <div className="d-flex flex-column justify-content-between align-items-center mx-2 ">
      <CardRecreador
        edad={recreador ? calcularEdad(recreador.fecha_nacimiento) : null}
        img={recreador ? recreador.img_perfil : null}
        nombre={recreador ? `${recreador.nombres} ${recreador.apellidos}` : null}
        genero={recreador ? recreador.genero : null}
        nivel={recreador ? recreador.nivel : null}
      />
      <div className="w-100">
        <SelectAsync
          id={id}
          placeholder={`${texts.placeholder.buscarRecreadores}`}
          optionsDefault={optionsDefault}
          getOptionLabel={(e) => { return `${e.nombres} ${e.apellidos}` }}
          getOptionValue={(e) => { return e.id }}
          value={value}
          setValue={setRecreador}
          loadOptions={loadOptionsRecreador}
          onChange={(e) => {
            let list = [...dataServicios]
            list[indexServicio].recreadores[indexRecreador] = e
            setDataServicios(list)
          }}
        />
      </div>
    </div>
  )
}

export default EventosRecreadores