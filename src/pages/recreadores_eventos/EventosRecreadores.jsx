import { useState, useEffect, useRef } from "react";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { SelectAsync } from "../../components/input/Inputs.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { recreadores, eventos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour, calcularEdad } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { IconRowLeft, IconEvent } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import dayjsEs from "../../utils/dayjs.js";
import CardRecreador from "../../components/card/CardRecreador.jsx"

function EventosRecreadores() {
  const navigate = useNavigate();
  const params = useParams();
  const renderizado = useRef(0);
  const dayjs = dayjsEs();
  const [dataEvento, setEvento] = useState({});
  const [dataServicios, setDataServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listRecreadores, setListRecreadores] = useState([]);
  const [totalRecreadores, setTotalRecreadores] = useState(0);
  const [errorServer, setErrorServer] = useState("");
  const [isRecreadores, setIsRecreadores] = useState(false)
  const [listNav, setListNav] = useState(0)
  const [disabledButton, setDisabledButton] = useState(false)
  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const evento = await eventos.get({ subDominio: [Number(params.id_evento)] })
      const recreadoresEvento = await eventos.get({ subDominio: ["recreadores", Number(params.id_evento)] })
      const listRecreadores = await recreadores.get()

      if (evento.status !== 200 || evento.data.status === false) {
        setErrorServer('Error. Conexión Evento')
        return
      }
      if (evento.data.data.info.estado === false) {
        navigate("/eventos/")
      }
      if (evento.data.data.info.estado_pago === 0) {
        navigate("/eventos/")
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

      const day = dayjs()
      const start = dayjs(evento.data.data.info.fecha_evento_final)
      setDisabledButton(day.isAfter(start) || evento.data.data.info.estado===1 || evento.data.data.info.estado ===0)
      setEvento({
        ...dataEvento,
        ...evento.data.data
      })
      const totalRe = recreadoresEvento.data.data.servicios.reduce((accumulator, current) => {
        return accumulator + current.numero_recreadores
      }, 0)
      setTotalRecreadores(totalRe)
      setDataServicios(recreadoresEvento.data.data.servicios)
      setIsRecreadores(recreadoresEvento.data.data.recreadores)
      setListRecreadores(listRecreadores.data.data)
    } catch (error) {
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
      const message = isRecreadores ? texts.confirmMessage.confirmEditRecreadores : texts.confirmMessage.confirmRegisterRecreadores
      const confirmacion = await alertConfim("Confirmar", message)
      if (confirmacion.isConfirmed) {
        const evento = Number(params.id_evento)
        const listRecreadores = []
        dataServicios.forEach((servicio) => {
          servicio.recreadores.forEach((recreador) => {
            listRecreadores.push({ id: recreador.id, servicio: servicio.id })
          })
        })
        const duplicados = listRecreadores.map(obj => obj.id);
        if (duplicados.length !== new Set(duplicados).size) {
          toastError(texts.errorMessage.errorRecreadoresRepeat)
          return
        }
        if (listRecreadores.length !== totalRecreadores) {
          toastError(texts.errorMessage.errorRecreadoresFaltantes)
          return
        }
        alertLoading("Cargando")
        const data = {
          evento: evento,
          recreadores: listRecreadores
        }
        const respuesta = isRecreadores ? await eventos.put(data, { subDominio: ["recreadores", Number(params.id_evento)] }) : await eventos.post(data, { subDominio: ["recreadores"] })
        controlResultPost({
          respuesta: respuesta,
          messageExito: isRecreadores ? texts.successMessage.editionEventoRecreadores : texts.successMessage.registerEventoRecreadores,
          useNavigate: { navigate: navigate, direction: `/evento/${Number(params.id_evento)}/` }
        })
        // if (respuesta.status = 200) {
        //   if (respuesta.data.status) {
        //     Swal.close(`/eventos/pagos/${respuesta.data.id}/`)
        //     navigate()
        //   } else {
        //     Swal.close()
        //     toastError(`${respuesta.data.message}`)
        //   }
        // } else {
        //   Swal.close()
        //   toastError(`Error.${respuesta.status} ${respuesta.statusText}`)
        // }
      }
    } catch (error) {
      console.log(error)
      Swal.close()
      toastError(texts.errorMessage.errorConexion)
    }

  }

  return (
    <Navbar name={`${texts.pages.recreadores_eventos.name}`} descripcion={`${texts.pages.recreadores_eventos.description}`}>
      <div className="w-100 d-flex justify-content-between">

      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/eventos/") }}><IconRowLeft /> Regresar</ButtonSimple>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate(`/eventos/${Number(params.id_evento)}/`) }}> <IconEvent /> Evento</ButtonSimple>

      </div>
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
                    <strong>Evento N°:</strong>
                    <p className='m-0'>{formatoId(dataEvento.info.id)}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Cliente:</strong>
                    <p className='m-0'>{`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}</p>
                  </div>
                  <div className='d-flex flex-column px-2 mb-1 flex-fill'>
                    <strong>Documento:</strong>
                    <p className='m-0'>{`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Fecha:</strong>
                    <p className='m-0'>{`${formatDateWithTime12Hour(dataEvento.info.fecha_evento_inicio)}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0 align-items-center px-lg-2 mb-1 flex-fill'>
                    <strong>N° Asistentes:</strong>
                    <p className='m-0'>{`${dataEvento.info.numero_personas}`}</p>
                  </div>
                </div>

                <ul className="nav nav-tabs w-100 nav-recreador">
                  {
                    dataServicios.map((servicio, index) => (
                      <li className="nav-item" key={`servicio-${index}`} onClick={(e) => { setListNav(Number(e.target.dataset.bsSlideTo)) }}>
                        <button className={`nav-link ${index === listNav && 'active'} fw-bold`} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={`${index}`} aria-label={`Slide ${index + 1}`} aria-current="page">Servicio {index + 1}</button>
                      </li>
                    ))
                  }
                </ul>
                <div id="carouselExampleIndicators" className="carousel w-100 ">
                  <div className="carousel-inner overflow-visible">
                    {
                      dataServicios.map((servicio, index) => (
                        <div key={`servicio-carrusel-${index}`} className={`carousel-item ${index === 0 && "active"}`}>
                          <div className="w-100 d-flex flex-column mt-3" key={`container_${index}`}>
                            <div className="d-flex flex-column flex-sm-row  justify-content-center align-items-center">
                              <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                                <strong>Servicio N°:</strong>
                                <p className='m-0'>{`${formatoId(servicio.id)}`}</p>
                              </div>
                              <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                                <strong>Nombre:</strong>
                                <p className='m-0'>{`${servicio.nombre}`}</p>
                              </div>
                              <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                                <strong>Duración:</strong>
                                <p className='m-0'>
                                  {`${servicio.duracion.horas < 10 ? `0${servicio.duracion.horas}` : servicio.duracion.horas}:${servicio.duracion.minutos < 10 ? `0${servicio.duracion.minutos}` : servicio.duracion.minutos} ${servicio.duracion.horas === 0 ? "min" : "h"}`}
                                </p>
                              </div>

                            </div>
                            <div className="w-100 d-flex justify-content-evenly flex-wrap ">
                              {
                                cardsRecreadores({ servicio: servicio, indexServicio: index })
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <ButtonSimple className="mx-auto w-50 mt-5" onClick={onSubmit} disabled={disabledButton}>
                  Guardar
                </ButtonSimple>
              </div>
            )
      }
      <Toaster />
    </Navbar>
  )
}


function CardRecreadorSelect({ recreador, id, optionsDefault, dataFuntion }) {
  const [value, setRecreador] = useState(recreador ? recreador : null)
  const [debounceTimeoutRecreador, setDebounceTimeoutRecreador] = useState(null);
  const { indexServicio, indexRecreador, dataServicios, setDataServicios } = dataFuntion

  const loadOptionsRecreador = (inputValue, callback) => {
    if (debounceTimeoutRecreador) {
      clearTimeout(debounceTimeoutRecreador);
    }

    const timeout = setTimeout(async () => {
      try {
        const respuesta = await recreadores.get({ params: { search: inputValue, estado: 1 } })
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
        id={recreador ? recreador.id : null}
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