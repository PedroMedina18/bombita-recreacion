import { useState, useEffect, useRef } from "react";
import { ButtonSimple } from "../../components/button/Button";
import { useNavigate, useParams } from 'react-router-dom';
import { recreadores } from "../../utils/API.jsx";
import { LoaderCircle } from "../../components/loader/Loader";
import { verifyOptionsSelect, controlResultPost } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
import Pildora from "../../components/Pildora.jsx"
import { Toaster } from "sonner";
import ErrorSystem from "../../components/errores/ErrorSystem";
import Navbar from "../../components/navbar/Navbar";
import texts from "../../context/text_es.js";
import { IconRowLeft, IconUserCircleSolid, IconCheck, IconX } from "../../components/Icon.jsx";
import perfil from "../../assets/perfil.png"
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
      const respuesta = await recreadores.get({ subDominio: [Number(params.id)] })
      if (respuesta.status !== 200) {
        setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
        return
      }
      if (respuesta.data.status === false) {
        setErrorServer(`${respuesta.data.message}`)
        return
      }
      console.log(respuesta.data.data)
      setData(respuesta.data.data)
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

                <div className={`section-perfil d-flex align-items-center justify-content-center sm ${data.img_perfil ? "section-perfil-img" : ""}`}>
                  <IconUserCircleSolid id="svg-perfil" className={`${data.img_perfil ? "d-none" : ""}`} />
                  <img src={data.img_perfil ? data.img_perfil : perfil} alt="img_perfil" className={`img-perfil sm ${data.img_perfil ? "" : "d-none"}`} />
                </div>

                <div className="w-100 flex-column flex-md-row d-flex justify-content-between">
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Codigo:</strong>
                    <p className="m-0 fs-5-5 mb-1">{formatoId(data.id)}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Documento:</strong>
                    <p className="m-0 fs-5-5 mb-1">{`${data.tipo_documento}-${data.numero_documento}`}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Genero:</strong>
                    <p className="m-0 fs-5-5 mb-1">{`${data.genero}`}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Correo:</strong>
                    <p className="m-0 fs-5-5 mb-1">{data.correo}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Telefono Principal:</strong>
                    <p className="m-0 fs-5-5 mb-1">{`${data.telefono_principal}`}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Telefono Secundario:</strong>
                    <p className="m-0 fs-5-5 mb-1">{`${data.telefono_secundario}`}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Nivel:</strong>
                    <p className="m-0 fs-5-5 mb-1">{`${data.nivel}`}</p>
                  </div>
                  <div className="w-100 w-md-50">
                    <strong className="fs-5-5">Estado:</strong> <br />
                    {data.estado ? <Pildora className="fs-5-5 py-8 px-4" contenido="Activo" color="bg-succes" /> : <Pildora className="fs-5-5 py-8 px-4" contenido="Inhabilitado" />}
                  </div>
                </div>

                {/* 
                
                <div className="w-100 flex-column flex-md-row d-flex justify-content-between">
                  
                </div>
                
                </div>
                
                <div className="w-100 flex-column flex-md-row d-flex justify-content-between">
                  
                <div className="w-100 flex-column flex-md-row d-flex justify-content-start">
                  
                </div> */}

                <div>
                  DE AQUI EN ADELANTE DEBERIA IR TODA LA INFORMACION RELACIONADA CON LE RECREADOR COMO <br />
                  -EVENTOS EN LOS QUE PARTICIPO <br />
                  -EVENTOS EN LOS QUE DEBE ESTAR EN EL FUTURO <br />
                  -SERVICIOS EN LOS QUE PUEDE ESTAR <br />
                  -Y NO SE QUE MAS ASI QUE PONTE HACER LA TESIS :)
                </div>
              </div>
            )
      }
      <Toaster closeButton={true} />
    </Navbar>
  )
}

export default Recreador