import { useState, useEffect, useRef } from "react";
import { ButtonSimple } from "../../components/button/Button";
import { useNavigate, useParams } from 'react-router-dom';
import { recreadores } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { verifyOptionsSelect, controlResultPost, controlErrors } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
import Pildora from "../../components/Pildora.jsx"
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem";
import Navbar from "../../components/navbar/Navbar";
import texts from "../../context/text_es.js";
import { IconRowLeft, IconUserCircleSolid, IconCheck, IconX } from "../../components/Icon.jsx";
import ComponentCalendarRecreador from "../../components/calendar/ComponentCalendarRecreador.jsx"
import "../../components/input/input.css"
function Recreador() {
  const [errorServer, setErrorServer] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
      const recreador = await recreadores.get({ subDominio: [Number(params.id)] })
      const recreadorEventos = await recreadores.get({ subDominio: ["eventos", Number(params.id)] })
      controlErrors({ respuesta: recreador, constrolError: setErrorServer })
      controlErrors({ respuesta: recreadorEventos, constrolError: setErrorServer })
      if (controlErrors({ respuesta: recreador, constrolError: setErrorServer }) || controlErrors({ respuesta: recreadorEventos, constrolError: setErrorServer })) return
      setData(recreador.data.data)

    } catch (error) {
      console.log(error)
      setErrorServer(texts.errorMessage.errorSystem)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Navbar name={texts.pages.recreador.name} descripcion={texts.pages.recreador.description}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/recreadores/") }}> <IconRowLeft /> Regresar</ButtonSimple>

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
                <h3 className="h2 fw-bold">{`${data.nombres} ${data.apellidos}`}</h3>
                <div className="w-100 d-flex flex-column flex-md-row mt-3">
                  <div className="w-100 w-md-40 d-flex  flex-column">
                    <div className={`lg section-perfil d-flex align-items-center justify-content-center mt-2 mx-auto ${data.img_perfil ? "section-perfil-img" : ""}`}>
                      {
                        data.img_perfil ?
                          <img src={data.img_perfil} alt="img_perfil" className={`lg img-perfil ${data.img_perfil ? "" : "d-none"}`} />
                          :
                          <IconUserCircleSolid />
                      }
                    </div>
                  </div>
                  <div className="w-100 w-md-60 d-flex flex-column">
                    <div className="w-100 d-flex flex-wrap justify-content-around justify-content-md-between align-items-center">
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Codigo:</strong>
                        <p className="m-0 fs-5-5 mb-1">{formatoId(data.id)}</p>
                      </div>
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Documento:</strong>
                        <p className="m-0 fs-5-5 mb-1">{`${data.tipo_documento}-${data.numero_documento}`}</p>
                      </div>
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Genero:</strong>
                        <p className="m-0 fs-5-5 mb-1">{`${data.genero}`}</p>
                      </div>
                    </div>
                    <div className="w-100 d-flex flex-wrap justify-content-around justify-content-md-between align-items-center">
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Tel. Principal:</strong>
                        <p className="m-0 fs-5-5 mb-1">{`${data.telefono_principal}`}</p>
                      </div>
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Tel. Secundario:</strong>
                        <p className="m-0 fs-5-5 mb-1">{`${data.telefono_secundario}`}</p>
                      </div>
                    </div>
                    <div className="w-100 d-flex flex-wrap justify-content-around justify-content-md-between align-items-center">
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Correo:</strong>
                        <p className="m-0 fs-5-5 mb-1">{data.correo}</p>
                      </div>
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Nivel:</strong>
                        <p className="m-0 fs-5-5 mb-1">{`${data.nivel}`}</p>
                      </div>
                      <div className="my-1 my-md-2 d-flex flex-column">
                        <strong className="fs-5-5">Estado:</strong>
                        {data.estado ? <Pildora className="fs-5-5 py-8 px-4 mb-auto" contenido="Activo" color="bg-succes" /> : <Pildora className="fs-5-5 py-8 px-4 mb-auto" contenido="Inhabilitado" />}
                      </div>
                    </div>
                  </div>
                </div>
                <ComponentCalendarRecreador name={`Proximos Eventos`} id_recreador={data.id}/>
              </div>
            )
      }
      <Toaster closeButton={true} />
    </Navbar>
  )
}

export default Recreador