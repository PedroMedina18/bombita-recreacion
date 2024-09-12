import { useState, useEffect, useRef } from 'react';
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { servicios } from "../../utils/API.jsx";
import { formatoId, formatDateWithTime12Hour, normalizeDecimalNumber } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import { controlErrors } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import { TableEventos } from "../eventos/Eventos.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";

function Servicio() {
  const [errorServer, setErrorServer] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const renderizado = useRef(0);
  const params = useParams();

  useEffect(() => {
    document.title = "Servicio - Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const servicio = await servicios.get({ subDominio: [Number(params.id)] })
      if (controlErrors({ respuesta: servicio, constrolError: setErrorServer })) return
      setData(servicio.data.data)
    } catch (error) {
      setErrorServer(texts.errorMessage.errorSystem)
      setData(null)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Navbar name={texts.pages.servicio.name} descripcion={texts.pages.servicio.description}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/servicios/") }}> <IconRowLeft /> Regresar</ButtonSimple>
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
                <h3 className="h2 fw-bold">{`Servicio N° ${formatoId(data.id)}`}</h3>
                <div className="w-100 d-flex flex-column">
                  <div className="w-100 d-flex flex-column mx-auto">
                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between">
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Nombre:</strong>
                        <p className="m-0 fs-6 mb-1">{`${data.nombre}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Duración:</strong>
                        <p className="m-0 fs-6 mb-1 text-start text-md-center">{`${data.duracion.horas < 10 ? `0${data.duracion.horas}` : data.duracion.horas}:${data.duracion.minutos < 10 ? `0${data.duracion.minutos}` : data.duracion.minutos} ${data.duracion.horas === 0 ? "min" : "h"}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">N° Recreadores:</strong>
                        <p className="m-0 fs-6 mb-1 text-start text-md-center">{`${data.numero_recreadores}`}</p>
                      </div>

                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Precio:</strong>
                        <p className="m-0 fs-6 mb-1">{`${normalizeDecimalNumber(data.precio)} $`}</p>
                      </div>
                    </div>
                    <div className="w-100 d-flex flex-column flex-md-row justify-content-between">
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Descripcion:</strong>
                        <p className="m-0 fs-6 mb-1">{`${data.descripcion}`}</p>
                      </div>

                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Fecha de Registros:</strong>
                        <p className="m-0 fs-6 mb-1">{`${formatDateWithTime12Hour(data.fecha_registro)}`}</p>
                      </div>
                      <div className="my-1 mx-2 my-md-2 d-flex flex-column">
                        <strong className="fs-6">Ultima Modificación:</strong>
                        <p className="m-0 fs-6 mb-1">{`${formatDateWithTime12Hour(data.fecha_actualizacion)}`}</p>
                      </div>
                    </div >
                  </div>
                  <div className='d-flex flex-column flex-md-row gap-1 justify-content-between my-3'>
                    <div className='w-100 w-md-45'>
                      <h4 className="h4 fw-bold text-center mb-2">Lista de Actividades</h4>
                      <ol className='list-group list-group-numbered'>
                        {
                          data.actividades.map((e) => (
                            <li className='list-group-item' key={`actividad-${e.id}`}>{e.nombre}</li>
                          ))
                        }
                      </ol>
                    </div>
                    <div className='w-100 w-md-45 mt-3 mt-md-0'>
                      <h4 className="h4 fw-bold text-center mb-2">Lista de Materiales</h4>
                      <ol className="list-group list-group-numbered">
                        {
                          data.materiales.map((e) => (
                            <li className="list-group-item d-flex justify-content-between align-items-start" key={`servicio-${e.id}`}>
                              <div className="ms-2 me-auto">
                                <div className="fw-bold">{e.nombre}</div>
                              </div>
                              <span className="badge text-bg-primary rounded-pill">{e.cantidad}</span>
                            </li>
                          ))
                        }
                      </ol>
                    </div>
                  </div>
                  <TableEventos calendar={false} desabilititIcon={false} moneyIcon={false}
                    recreadoresIcon={false} filtrosTable={{servicio:Number(params.id)}}
                    optionsRegister={false} optionsSerch={false}/>
                </div>
              </div>
            )
      }
    <Toaster/>
    </Navbar>
  )
}

export default Servicio