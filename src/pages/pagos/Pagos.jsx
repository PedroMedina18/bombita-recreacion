import { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { InputCheckRadio } from "../../components/input/Inputs.jsx";
import { LineDescription } from "../../components/otros/LineDescription.jsx";
import { ButtonSimple } from "../../components/button/Button";
import { eventos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { IconRowLeft, IconEvent, IconFactura } from "../../components/Icon.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx"
import ModalPagos from "../../components/modal/ModalPagos.jsx";
import ModalFactura from "../../components/modal/ModalFactura.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Swal from 'sweetalert2';
import dayjsEs from "../../utils/dayjs.js";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function Pagos() {
  const navigate = useNavigate();
  const { getUser } = useAuthContext();
  const [dolar] = useState(getUser().dollar.price);
  const [dataEvento, setEvento] = useState({});
  const [dataPago, setDataPago] = useState([]);
  const dayjs = dayjsEs();
  const [stateMetodosPago, setStateMetodosPago] = useState(false);
  const [tipoPago, setTipoPago] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [montoCancelar, setMontoCancelar] = useState(0);
  const renderizado = useRef(0);
  const [anticipo, setAnticipo] = useState(false);
  const [faltante, setFaltante] = useState(false);
  const [total, setTotal] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_pagos()
      return
    }
  }, [])

  useEffect(() => {
    const totalCancelado = dataPago.reduce((accumulator, current) => {
      return accumulator + current.monto
    }, 0)

    setEvento({
      ...dataEvento,
      totalCancelado: totalCancelado
    })
  }, [dataPago])

  const get_pagos = async () => {
    try {
      const evento = await eventos.get({ subDominio: [Number(params.id_evento)] })
      if (evento.status !== 200 || evento.data.status === false) {
        setErrorServer(`Error. Error de Conexión Evento`)
        return
      }
      if (evento.data.data.info.estado === false) {
        navigate("/eventos/")
      }
      const totalServicios = evento.data.data.servicios.reduce((accumulator, current) => {
        return accumulator + current.precio
      }, 0)
      const totalSobrecostos = evento.data.data.sobrecostos.reduce((accumulator, current) => {
        return accumulator + current.monto
      }, 0)
      const Pagos = evento.data.data.pagos.reduce((accumulator, current) => {
        return accumulator + current.monto
      }, 0)
      setMontoCancelar((totalServicios + totalSobrecostos) - Pagos)
      console.log(evento.data.data)
      const pagosAnticipo = evento.data.data.pagos.filter(e => e.tipo === 1)
      const pagosFaltante = evento.data.data.pagos.filter(e => e.tipo === 2)
      const pagosTotal = evento.data.data.pagos.filter(e => e.tipo === 3)
      const day = dayjs()
      const start = dayjs(evento.data.data.info.fecha_evento_final)
      setEvento({
        ...dataEvento,
        ...evento.data.data,
        totalServicios: totalServicios,
        totalSobrecostos: totalSobrecostos,
        totalEvento: totalServicios + totalSobrecostos,
        MontoPagado: Pagos,
        anticipoEvento: (totalServicios + totalSobrecostos) / 2,
        totalCancelado: 0,
        pagosAnticipo,
        pagosFaltante,
        pagosTotal,
        after:day.isAfter(start)
      })

    } catch (error) {
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
    }
  }

  // *the useform
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  const deleteSelect = (index) => {
    const array = [...dataPago];
    array.splice(index, 1)
    setDataPago(array)
  }

  const isTotal = () => {
    if (dataPago.info?.estado_pago === 2) {
      return true
    }
    const totalCancelado = dataEvento.totalCancelado ? dataEvento.totalCancelado : 0
    const cancelado = totalCancelado < montoCancelar
    return !cancelado
  }

  const onSubmit = async () => {
    try {
      if (!dataPago.length) {
        toastError(texts.errorMessage.errorNotPago)
        return
      }
      const totalCancelado = montoCancelar - dataEvento.totalCancelado
      if (Number(totalCancelado) > 0) {
        toastError(texts.errorMessage.errorNotTotal)
        return
      }
      const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmPago)
      if (confirmacion.isConfirmed) {
        const Form = new FormData()
        if (tipoPago && dataEvento.info.estado_pago === 0) {
          Form.append('tipo_pago', 3) //pago total
        }
        if (!tipoPago) {
          Form.append('tipo_pago', 1)//pago anticipo
        }
        if (tipoPago && dataEvento.info.estado_pago === 1) {
          Form.append('tipo_pago', 2) //pago faltante
        }
        Form.append('evento', Number(dataEvento.info.id))
        Form.append('pagos', JSON.stringify(dataPago))
        dataPago.forEach((e, index) => {
          if (e.capture) {
            Form.append(`capture_${Number(dataEvento.info.id)}_${e.metodo_pago}_${index}`, e.capture)
          }
        })
        alertLoading("Cargando")
        const respuesta = await eventos.postData(Form, { subDominio: ["pagos"] })
        controlResultPost({
          respuesta: respuesta,
          messageExito: texts.successMessage.registerPago,
          useNavigate: { navigate: navigate, direction: "/eventos/" }
        })
        if (respuesta.status = 200) {
          if (respuesta.data.status) {
            Swal.close()
            if (dataEvento.info.recreadores == 1) {
              navigate(`/eventos/${Number(params.id_evento)}/`)
            } else {
              navigate(`/eventos/recreadores/${Number(params.id_evento)}/`)
            }
          } else {
            Swal.close()
            toastError(`${respuesta.data.message}`)
          }
        } else {
          Swal.close()
          toastError(`Error.${respuesta.status} ${respuesta.statusText}`)
        }
      }
    } catch (error) {
      Swal.close()
      toastError(texts.errorMessage.errorConexion)
    }
  }

  return (
    <Navbar name={texts.pages.pagos.name}>
      <ModalPagos dataEvento={{ ...dataEvento, montoCancelar, tipo_pago: watch("tipo_pago") }} state={[stateMetodosPago, setStateMetodosPago]} titulo="Agregar pago" saveDataState={[dataPago, setDataPago]} />
      <div className='w-100 d-flex justify-content-between'>

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
                    <strong>N° de Asistentes:</strong>
                    <p className='m-0'>{`${dataEvento.info.numero_personas}`}</p>
                  </div>
                </div>
                <div className='w-100 my-2'>
                  <hr />
                  <div className="d-100 d-flex justify-content-end mb-3 flex-column flex-md-row  gap-1">
                    {
                      dataEvento.pagosAnticipo.length > 0 &&
                      <>
                        <ModalFactura
                          cliente={`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}
                          documento={`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}
                          id_evento={dataEvento.info.id}
                          listPagos={dataEvento.pagosAnticipo}
                          state={[anticipo, setAnticipo]}
                          tipo_pago={1}
                        />
                        <ButtonSimple type={"button"} onClick={() => { setAnticipo(!anticipo) }}>Pago de Anticipo <IconFactura /></ButtonSimple>
                      </>

                    }
                    {
                      dataEvento.pagosFaltante.length > 0 &&
                      <>
                        <ModalFactura
                          cliente={`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}
                          documento={`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}
                          id_evento={dataEvento.info.id}
                          listPagos={dataEvento.pagosFaltante}
                          state={[faltante, setFaltante]}
                          tipo_pago={2}
                        />
                        <ButtonSimple type={"button"} onClick={() => { setFaltante(!faltante) }}>Pago Restante <IconFactura /></ButtonSimple>
                      </>

                    }
                    {
                      dataEvento.pagosTotal.length > 0 &&
                      <>
                        <ModalFactura
                          cliente={`${dataEvento.info.nombres} ${dataEvento.info.apellidos}`}
                          documento={`${dataEvento.info.tipo_documento}-${dataEvento.info.numero_documento}`}
                          id_evento={dataEvento.info.id}
                          listPagos={dataEvento.pagosTotal}
                          state={[total, setTotal]}
                          tipo_pago={3}
                        />
                        <ButtonSimple type={"button"} onClick={() => { setTotal(!total) }}>Pago Completo <IconFactura /></ButtonSimple>
                      </>

                    }
                  </div>
                  <div className='w-100 d-flex align-items-center'>
                    <div className='w-50 d-flex justify-content-start'>
                      {
                        dataEvento.info.estado_pago === 2 ?
                          <InputCheckRadio className='me-2' form={{ errors, register }} id="radio_total" label={`Totalmente Cancelado`} name="tipo_pago" type='radio' checked={tipoPago} value="cancelado" />
                          :
                          <>
                            <InputCheckRadio className='me-2' form={{ errors, register }} id="radio_total" label={`${dataEvento.info.estado_pago === 0 && "Completo" || dataEvento.info.estado_pago === 1 && "Monto Faltante"}`} name="tipo_pago" type='radio' checked={tipoPago} value={`${dataEvento.info.estado_pago === 0 && "total" || dataEvento.info.estado_pago === 1 && "monto_faltante"}`} onClick={() => { setTipoPago(true); setMontoCancelar(dataEvento.totalEvento - dataEvento.MontoPagado) }} />
                            {
                              (dataEvento.info.estado_pago === 0) &&
                              <InputCheckRadio className='ms-2' form={{ errors, register }} id="radio_anticipo" label={"Anticipo"} name="tipo_pago" type='radio' checked={!tipoPago} value="anticipo" onClick={() => { setTipoPago(false); setMontoCancelar(dataEvento.anticipoEvento) }} />
                            }
                          </>
                      }

                    </div>
                    <ButtonSimple disabled={isTotal() || dataEvento.info.estado === 0 || dataEvento.info.estado === 1 || dataEvento.after} onClick={() => { setStateMetodosPago(!stateMetodosPago) }} className="my-2 ms-auto">
                      Metodos de Pago
                    </ButtonSimple>
                  </div>
                  <p className='h4 fw-bold'>Descripcion del evento</p>
                  {
                    dataEvento.servicios.map((e, index) => (
                      <LineDescription nombre={e.nombre} dolar={dolar} precio={e.precio} key={`sobrecostos_${index}`} />
                    ))
                  }
                  {
                    dataEvento.sobrecostos.map((e, index) => (
                      <LineDescription nombre={e.nombre} dolar={dolar} precio={e.monto} key={`sobrecostos_${index}`} />
                    ))
                  }
                  <hr />
                  <LineDescription nombre={"Servicios"} dolar={dolar} precio={dataEvento.totalServicios} />
                  {
                    Boolean(dataEvento.totalSobrecostos) &&
                    <LineDescription nombre={"Sobrecostos"} dolar={dolar} precio={dataEvento.totalSobrecostos} />
                  }
                  <LineDescription nombre={"Total"} dolar={dolar} precio={dataEvento.totalEvento} fs={5} />
                  {
                    dataEvento.MontoPagado > 0 &&
                    <LineDescription nombre={"Monto Cancelado"} dolar={dolar} precio={dataEvento.MontoPagado} fs={5} />
                  }
                  {
                    dataEvento.info.estado_pago !== 2 &&
                    <LineDescription nombre={"Monto a Cancelar"} dolar={dolar} precio={montoCancelar} fs={5} />
                  }

                  {
                    Boolean(dataPago.length) &&
                    <>
                      <hr />
                      <p className='h4 m-0 fw-bold mb-2'>Metodo de Pago</p>
                    </>
                  }
                  {
                    dataPago.map((e, index) => (
                      <LineDescription nombre={e.nombre} dolar={dolar} precio={e.monto} onDoubleClick={() => { deleteSelect(index) }} key={`debito${index}`} />
                    ))
                  }
                  {
                    Boolean(dataPago.length) &&
                    <>
                      <hr />
                      <LineDescription nombre={"Total a Debitar"} dolar={dolar} precio={dataEvento.totalCancelado} fs={5} />
                      {
                        !isTotal() &&
                        <LineDescription nombre={"Monto Faltante"} dolar={dolar} precio={montoCancelar - dataEvento.totalCancelado} fs={5} />
                      }
                    </>
                  }
                </div>
                <div className='w-100 d-flex'>
                  <ButtonSimple className="mt-4 mx-auto w-50" onClick={onSubmit} disabled={dataEvento.info.estado_pago === 2 || dataEvento.info.estado === 1 || dataEvento.info.estado === 0 || dataEvento.after}>
                    Registrar
                  </ButtonSimple>
                </div>
              </div>
            )
      }
      <Toaster />
    </Navbar>
  )
}

export default Pagos