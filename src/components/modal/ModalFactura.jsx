import { useState, useRef, useEffect } from 'react'
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { ButtonSimple } from "../button/Button.jsx"
import { totalItems } from "../table/Table.jsx"
import { LoaderCircle } from "../loader/Loader.jsx"
import { IconImg } from "../Icon.jsx"
import { useForm } from "react-hook-form"
import "./modal.css"
import "../table/table.css"
import Pildora from "../Pildora.jsx"
import ErrorSystem from "../errores/ErrorSystem.jsx"
import ModalBase from "./ModalBase.jsx";
import Swal from 'sweetalert2';

function ModalFactura({ state, listPagos, id_evento, tipo_pago, cliente, documento }) {
  const [estado, setEstado] = state
  const totalPago = listPagos.reduce((accumulator, current) => {
    return accumulator + current.monto
  }, 0)
  const dolar = { id: listPagos[0].metodo_pago_id, precio: listPagos[0].precio_dolar }
  const fecha = listPagos[0].fecha_registro
  return (
    <ModalBase titulo={`Factura N°${formatoId(id_evento)}${tipo_pago}`} logo={true} iconHamburgue={false} state={[estado, setEstado]} buttonSucces={false} buttonDelete={false} styles={{ witdh_content:"w-100 w-md-50"}}>
      <>
        <div className='w-100 d-flex flex-column px-3'>
          <p className='m-0 mb-1 fs-6'><strong>Evento: </strong> {formatoId(id_evento)}</p>
          <p className='m-0 mb-1 fs-6'><strong>Cliente: </strong> {cliente} {documento}</p>
          <p className='m-0 mb-1 fs-6'><strong>Fecha: </strong> {formatDateWithTime12Hour(fecha)}</p>
          <p className='m-0 mb-1 fs-6'><strong>Tipo Pago: </strong>
            {tipo_pago === 1 && <Pildora contenido={`Anticipo`} color="bg-warning"></Pildora>}
            {tipo_pago === 2 && <Pildora contenido={`Pago Faltante`} color="bg-info"></Pildora>}
            {tipo_pago === 3 && <Pildora contenido={`Pago Completo`} color="bg-succes"></Pildora>}
          </p>
          <p className='m-0 mb-1 fs-6'><strong>Detalles: </strong></p>
          {
            listPagos.map((e, index) => (
              <div className='m-0 mb-1 ps-2 d-flex w-100' key={`ref-${tipo_pago}-${index}`}>
                <strong>{e.metodo_pago}: </strong>
                <p className='m-0 mb-1 fs-6 ms-2'>{e.monto}$</p>
                <p className='m-0 mb-1 fs-6 mx-5'>{(e.monto * dolar.precio).toFixed(2)} Bs.S</p>
                {
                  e.referencia &&
                  <p className='m-0 mb-1 fs-6 mx-5'>Codigo Ref:{e.referencia}</p>
                }
                {
                  e.capture &&
                  <span className='m-0 mb-1 fs-6 mx-5 img-logo cursor-pointer' onClick={() => {
                    Swal.fire({
                      imageUrl: e.capture,
                      imageAlt: "capture",
                      confirmButtonText: "Aceptar",
                      confirmButtonColor: "rgb(var(--principal))",
                    });
                  }}><IconImg /></span>
                }
              </div>
            ))
          }
          <p className='m-0 mb-1 fs-6'><strong>Total:</strong> {totalPago}$    -   {(totalPago * dolar.precio).toFixed(2)}Bs.S</p>
        </div>
      </>
    </ModalBase>
  )
}

export default ModalFactura