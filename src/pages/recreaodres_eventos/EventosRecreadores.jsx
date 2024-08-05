import { useState, useEffect, useRef } from "react";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { recreadores, eventos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertLoading } from "../../components/alerts.jsx";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { hasLeadingOrTrailingSpace, coincidences } from "../../utils/process.jsx";
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Swal from 'sweetalert2';
import Navbar from "../../components/navbar/Navbar.jsx";
import texts from "../../context/text_es.js";
import pattern from "../../context/pattern.js";
import { IconRowLeft } from "../../components/Icon.jsx";

function EventosRecreadores() {
  const navigate = useNavigate();
  const renderizado = useRef(0);
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const dataEvento = await eventos.get({ subDominio: [Number(params.id_evento)], params: { "_info": "true" } })
      const recreadores = await eventos.get({ subDominio:["recreadores", Number(params.id_evento)]})

      if (dataEvento.status !== 200 || dataEvento.data.status === false) {
        setErrorServer('Error. Conexión Evento')
        return
      }

      if (recreadores.status !== 200 || recreadores.data.status === false) {
        setErrorServer('Error. Conexión  de Recreadores')
        return
      }

      console.log(dataEvento)
      console.log(recreadores)

    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorObjet)
    } finally {
      setLoading(false)
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
              <></>
            )
      }
    </Navbar>
  )
}

export default EventosRecreadores