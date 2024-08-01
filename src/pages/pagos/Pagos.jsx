import { useState, useEffect, useRef } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { InputsGeneral, InputTextTarea, InputCheckRadio } from "../../components/input/Inputs.jsx";
import { LineDescription } from "../../components/otros/LineDescription.jsx";
import { ButtonSimple } from "../../components/button/Button";
import { metodoPago, eventos, pagos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import ModalPagos from "../../components/modal/ModalPagos.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx"
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";

function Pagos() {
  const navigate = useNavigate();
  const { getUser } = useAuthContext();
  const [dolar] = useState(getUser().dollar.price);
  const [dataEvento, setEvento] = useState({})
  const [dataPago, setDataPago] = useState([])
  const [stateMetodosPago, setStateMetodosPago] = useState(false)
  const params = useParams();
  const [loading, setLoading] = useState(true)
  const renderizado = useRef(0)
  const [TipoPago, setTipoPago] = useState(true)
  const [errorServer, setErrorServer] = useState("")

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_pagos()
      return
    }
  }, [])

  useEffect(() => {
    const totalPagado = dataPago.reduce((accumulator, current) => {
      return accumulator + current.monto
    }, 0)

    setEvento({
      ...dataEvento,
      totalPagado: totalPagado
    })
  }, [dataPago])

  const get_pagos = async () => {
    try {
      const evento = await eventos.get({ subDominio: [Number(params.id_evento)], params: { "_info": "true" } })

      if (evento.status !== 200 || evento.data.status === false) {
        setErrorServer(`Error. Error de Conexión Evento`)
        return
      }
      const totalServicios = evento.data.data.servicios.reduce((accumulator, current) => {
        return accumulator + current.precio
      }, 0)
      const totalSobrecargos = evento.data.data.sobrecargos.reduce((accumulator, current) => {
        return accumulator + current.monto
      }, 0)
      setEvento({
        ...dataEvento,
        ...evento.data.data,
        totalServicios: totalServicios,
        totalSobrecargos: totalSobrecargos,
        totalEvento: totalServicios + totalSobrecargos,
        anticipoEvento: (totalServicios + totalSobrecargos) / 2,
        totalPagado: 0
      })

    } catch (error) {
      console.log(error)
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
    const totalEvento = dataEvento.totalEvento ? dataEvento.totalEvento : 0
    const totalPagado = dataEvento.totalPagado ? dataEvento.totalPagado : 0
    const anticipoEvento = dataEvento.anticipoEvento ? dataEvento.anticipoEvento : 0
    if (TipoPago) {
      const cancelado = totalPagado < totalEvento
      return !cancelado
    } else {
      const cancelado = totalPagado < anticipoEvento
      return !cancelado
    }
  }

  return (
    <Navbar name={texts.pages.pagos.name}>
      <ModalPagos dataEvento={{ ...dataEvento, TipoPago }} state={[stateMetodosPago, setStateMetodosPago]} titulo="Agregar pago" saveDataState={[dataPago, setDataPago]} />
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/eventos") }}><IconRowLeft /> Regresar</ButtonSimple>

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
                    <p className='m-0'>{`${formatDateWithTime12Hour(dataEvento.info.fecha_evento)}`}</p>
                  </div>
                  <div className='d-flex flex-column pe-sm-2 ps-sm-0  px-lg-2 mb-1 flex-fill'>
                    <strong>Numero de Asistentes:</strong>
                    <p className='m-0'>{`${dataEvento.info.numero_personas}`}</p>
                  </div>
                </div>
                <div className='w-100 my-2'>
                  <hr />
                  <div className='w-100 d-flex'>
                    <div className='w-50 d-flex justify-content-start'>
                      <InputCheckRadio className='me-2' form={{ errors, register }} id="radio_total" label={"Pago Total"} name="tipo_pago" type='radio' checked={TipoPago} value="total" onClick={() => { setTipoPago(true) }} />
                      <InputCheckRadio className='ms-2' form={{ errors, register }} id="radio_anticipo" label={"Pago Anticipado"} name="tipo_pago" type='radio' checked={!TipoPago} value="anticipo" onClick={() => { setTipoPago(false) }} />
                    </div>
                    <ButtonSimple disabled={isTotal()} onClick={() => { setStateMetodosPago(true) }} className="my-2 ms-auto">
                      Metodos de Pago
                    </ButtonSimple>
                  </div>
                  <p className='h4 fw-bold'>Descripcion del evento</p>
                  {
                    dataEvento.servicios.map((e, index) => (
                      <LineDescription nombre={e.nombre} dolar={dolar} precio={e.precio} key={`sobrecargos_${index}`} />
                    ))
                  }
                  {
                    dataEvento.sobrecargos.map((e, index) => (
                      <LineDescription nombre={e.nombre} dolar={dolar} precio={e.monto} key={`sobrecargos_${index}`} />
                    ))
                  }
                  <hr />
                  <LineDescription nombre={"Servicios"} dolar={dolar} precio={dataEvento.totalServicios} />
                  {
                    Boolean(dataEvento.totalSobrecargos) &&
                    <LineDescription nombre={"Sobrecargos"} dolar={dolar} precio={dataEvento.totalSobrecargos} />
                  }
                  <LineDescription nombre={"Total"} dolar={dolar} precio={dataEvento.totalEvento} fs={5} />
                  <LineDescription nombre={"Monto a Cancelar"} dolar={dolar} precio={TipoPago ? dataEvento.totalEvento : dataEvento.anticipoEvento} fs={5} />
                  {
                    Boolean(dataPago.length) &&
                    <>
                    <hr />
                    <p className='h4 m-0 fw-bold'>Metodo de Pago</p>
                    </>
                  }
                  {
                    dataPago.map((e, index) => (
                      <LineDescription nombre={e.metodo_pago} dolar={dolar} precio={e.monto} onDoubleClick={() => { deleteSelect(index) }} key={`debito${index}`} />
                    ))
                  }
                  {
                    Boolean(dataPago.length) &&
                    <>
                    <hr />
                      <LineDescription nombre={"Total Debitado"} dolar={dolar} precio={dataEvento.totalPagado} fs={5} />
                      <LineDescription nombre={"Monto Faltante"} dolar={dolar} precio={TipoPago ? (dataEvento.totalEvento - dataEvento.totalPagado) : (dataEvento.anticipoEvento - dataEvento.totalPagado)} fs={5} />
                    </>
                  }
                </div>
              </div>
            )
      }
      <Toaster />
    </Navbar>
  )
}

export default Pagos