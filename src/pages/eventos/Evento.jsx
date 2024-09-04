import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";
import { eventos } from "../../utils/API.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { alertConfim, toastError, alertLoading, alertMotivo } from "../../components/alerts.jsx";
import { formatoId, formatDateWithTime12Hour, formatTime12Hour, calcularEdad } from "../../utils/process.jsx";
import { controlErrors, controlResultPost } from "../../utils/actions.jsx";
import { IconRowLeft, IconCheck, IconX, IconLista } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import CardRecreador from "../../components/card/CardRecreador.jsx"
import Pildora from "../../components/Pildora.jsx"
import texts from "../../context/text_es.js";
import "../../components/input/input.css"
import "../../components/table/table.css"
import Swal from 'sweetalert2';

function Evento() {
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const navigate = useNavigate();
  const [dataEvento, setDataEvento] = useState(null);
  const [serviciosList, setServiciosList] = useState({ servicios: [], isRecreadores: false });
  const renderizado = useRef(0);
  const params = useParams();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const evento = await eventos.get({ subDominio: [Number(params.id)] })
      const recreadoresEvento = await eventos.get({ subDominio: ["recreadores", Number(params.id)] })
      if (controlErrors({ respuesta: evento, constrolError: setErrorServer, message200: "Error. Evento Encontrado" })) return
      if (controlErrors({ respuesta: recreadoresEvento, constrolError: setErrorServer, message200: "Error. Recreadores no encontrados" })) return

      const totalServicios = evento.data.data.servicios.reduce((accumulator, current) => {
        return accumulator + current.precio
      }, 0)
      const totalSobrecargos = evento.data.data.sobrecargos.reduce((accumulator, current) => {
        return accumulator + current.monto
      }, 0)
      setDataEvento({
        ...evento.data.data,
        totalServicios: totalServicios,
        totalSobrecargos: totalSobrecargos,
        totalEvento: totalServicios + totalSobrecargos,
      })
      setServiciosList({ servicios: recreadoresEvento.data.data.servicios, isRecreadores: recreadoresEvento.data.data.recreadores })
    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorSystem)
      setDataCargo(null)
    } finally {
      setLoading(false)
    }
  }


  const cardsRecreadores = ({ servicio }) => {
    const list = []
    for (let index = 0; index < servicio.numero_recreadores; index++) {
      const recreador = servicio.recreadores[index] ? servicio.recreadores[index] : null;
      list.push(
        <CardRecreador key={`card_${index}_${servicio.nombre}`}
          edad={recreador ? calcularEdad(recreador.fecha_nacimiento) : null}
          img={recreador ? recreador.img_perfil : null}
          nombre={recreador ? `${recreador.nombres} ${recreador.apellidos}` : null}
          genero={recreador ? recreador.genero : null}
          nivel={recreador ? recreador.nivel : null}
        />)
    }
    return list
  }

  const cancelarEvento = async () => {
    try {
      const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmCancelarEvento)
      if (confirmacion.isConfirmed) {
        alertMotivo("Motivo por el que se Cancela el evento", params.id, () => { navigate("/eventos/") })
      }
    } catch (error) {
      console.log(error)
      toastError(texts.errorMessage.errorSystem)
    }
  }

  const completarEvento = async () => {
    try {
      const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmCompletar)
      if (confirmacion.isConfirmed) {
        alertLoading("Cargando")
        const body = {
          estado: true
        }
        const evento = await eventos.put(body, { subDominio: [Number(params.id)] })
        controlResultPost({
          respuesta: evento,
          messageExito: texts.successMessage.eventoCompletado,
          useNavigate: { navigate: navigate, direction: "/eventos/" }
        })
      }
    } catch (error) {
      toastError(texts.errorMessage.errorSystem)
    }
  }

  return (
    <Navbar name={texts.pages.evento.name} descripcion={texts.pages.evento.description} dollar={false}>
      <div className="w-100 d-flex justify-content-between">
        <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/eventos/") }}> <IconRowLeft /> Regresar  </ButtonSimple>
        <div className="d-lfex">
          <ButtonSimple disabled={dataEvento?.info.estado !== null || dataEvento?.info.estado === true}
            type="button"
            className="mb-2"
            onClick={() => {
              cancelarEvento()
            }}
          >Cancelar <IconX /> </ButtonSimple>
          <ButtonSimple disabled={dataEvento?.info.estado !== null || dataEvento?.info.estado === false}
            type="button"
            className="mb-2 ms-2"
            onClick={() => {
              completarEvento()
            }}
          >Completado <IconCheck /> </ButtonSimple>

          <ButtonSimple disabled={!dataEvento?.info.estado === true}
            type="button"
            className="mb-2 ms-2"
            onClick={() => {
              navigate(`/evaluacion/${[Number(params.id)]}`)
            }}
          >Evaluación <IconLista /> </ButtonSimple>
        </div>
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
                <h3 className="h2 fw-bold">{`Evento N°${formatoId(dataEvento.info.id)}`}</h3>
                <div className="w-100 d-flex flex-column">
                  <div className="w-100 d-flex flex-column mx-auto">
                    <div className="w-100 d-flex justify-content-between">
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Cliente:</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Documento:</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Cooreo:</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.correo}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Tél: Principal</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.telefono_principal}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Asistentes:</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.numero_personas}`}</p>
                      </div>
                    </div>
                    <div className="w-100 d-flex justify-content-between">
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column w-50">
                        <strong className="fs-6">Dirección:</strong>
                        <p className="m-0 fs-6 mb-1">{`${dataEvento.info.direccion}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Fecha evento:</strong>
                        <p className="m-0 fs-6 mb-1">{`${formatDateWithTime12Hour(dataEvento.info.fecha_evento_inicio)}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Finaliza:</strong>
                        <p className="m-0 fs-6 mb-1">{`${formatTime12Hour(dataEvento.info.fecha_evento_final)}`}</p>
                      </div>
                    </div >
                    <div className="w-100 d-flex justify-content-between">
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Estado:</strong>
                        {dataEvento.info.estado === null && <Pildora contenido={"En espera"} color="bg-info"></Pildora>}
                        {Boolean(dataEvento.info.estado) === true && <Pildora contenido={"Completado"} color="bg-succes"></Pildora>}
                        {(Boolean(dataEvento.info.estado) === false && dataEvento.info.estado !== null) && <Pildora contenido={"Cancelado"} color="bg-danger"></Pildora>}
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Estado de Pago:</strong>
                        {dataEvento.info.estado_pago === 0 && <Pildora contenido={`${dataEvento.info.estado_pago_descripcion}`} color="bg-danger"></Pildora>}
                        {dataEvento.info.estado_pago === 1 && <Pildora contenido={`${dataEvento.info.estado_pago_descripcion}`} color="bg-warning"></Pildora>}
                        {dataEvento.info.estado_pago === 2 && <Pildora contenido={`${dataEvento.info.estado_pago_descripcion}`} color="bg-succes"></Pildora>}
                      </div>
                    </div>
                  </div>

                  {
                    (Boolean(dataEvento.info.estado) === false && dataEvento.info.estado !== null) &&
                    <div className="w-100 ">
                      <h2 className="text-center m-0 fw-bold ">Evento Cancelado!</h2>
                    </div>
                  }

                  <div className="accordion mt-5" id="accordionExample">
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button className="accordion-button fw-bold fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                          Servicios   -  Ref {Number(dataEvento.totalServicios).toFixed(2)}
                        </button>
                      </h2>
                      <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body d-flex flex-column">
                          <div className="w-100 d-flex justify-content-between align-items-center mb-2">
                            <strong className="m-0 fw-bold w-20 text-center">Codigo</strong>
                            <p className="m-0 fw-bold w-60 text-center">Servicio</p>
                            <p className="m-0 fw-bold w-20 text-center">Precio</p>
                          </div>
                          {
                            dataEvento.servicios.map((e, index) => (
                              <div key={`sobrecargo-${index}`} className="w-100 d-flex justify-content-between align-items-center mb-2">
                                <strong className="m-0 text-center w-20">{formatoId(e.id)}</strong>
                                <p className="m-0 text-center w-60">{e.nombre}</p>
                                <p className="m-0 text-center w-20">{Number(e.precio).toFixed(2)}</p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    {
                      Boolean(dataEvento.sobrecargos.length) &&
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button className="accordion-button fw-bold fs-5" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Sobrecargos    -  Ref {Number(dataEvento.totalSobrecargos).toFixed(2)}
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                          <div className="accordion-body d-flex flex-column">
                            <div className="w-100 d-flex justify-content-between align-items-center mb-2">
                              <strong className="m-0 fw-bold w-20 text-center">Codigo</strong>
                              <p className="m-0 fw-bold w-60 text-center">Sobrecargo</p>
                              <p className="m-0 fw-bold w-20 text-center">Precio</p>
                            </div>
                            {
                              dataEvento.sobrecargos.map((e, index) => (
                                <div key={`servicio-${index}`} className="w-100 d-flex justify-content-between align-items-center mb-2">
                                  <strong className="m-0 text-center w-20">{formatoId(e.id)}</strong>
                                  <p className="m-0 w-60 text-center">{e.nombre}</p>
                                  <p className="m-0 text-center w-20">{Number(e.monto).toFixed(2)}</p>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                    }
                    <div className="accordion-item">
                      <h2 className="accordion-header fw-bold fs-5 px-4 py-3">
                        Total - {Number(dataEvento.totalEvento).toFixed(2)}
                      </h2>
                    </div>
                  </div>
                  {
                    dataEvento.info.estado !== false &&
                    <div id="carouselExample" className="carousel slide mt-5">
                      <div className="carousel-inner">
                        {
                          serviciosList.servicios.map((servicio, index) => (
                            <div key={`recreadores-${index}`} className={`carousel-item ${index == 0 && "active"}`}>
                              <div className="w-100 d-flex flex-column ">
                                <h3 className="text-center fw-bold">Recreadores - Servicio N° {formatoId(servicio.id)}</h3>

                                <div className="w-100 d-flex flex-warp align-items-center justify-content-evenly">
                                  {cardsRecreadores({ servicio: servicio })}
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      {
                        serviciosList.servicios.length > 1 &&
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      }
                    </div>
                  }

                </div>
              </div>
            )
      }
      <Toaster closeButton={true} />
    </Navbar>
  )
}




export default Evento