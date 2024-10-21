import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";
import { cargos, usuarios } from "../../utils/API.jsx";
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { controlErrors } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import { IconRowLeft, IconUserCircleSolid } from "../../components/Icon.jsx";
import "../../components/input/input.css"
import "../../components/table/table.css"
import Pildora from "../../components/Pildora.jsx"
import texts from "../../context/text_es.js";

function Cargo() {
  const [loading, setLoading] = useState(true);
  const [errorServer, setErrorServer] = useState("");
  const [data, setData] = useState(null);
  const [usuariosList, setUsuarios] = useState([]);
  const renderizado = useRef(0);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title="Cargo - Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      get_data()
      return
    }
  }, [])

  const get_data = async () => {
    try {
      const cargo = await cargos.get({ subDominio: [Number(params.id)] })
      const usuarioRes = await usuarios.get({ params: { cargo: Number(params.id) } })
      if(controlErrors({ respuesta: cargo, constrolError: setErrorServer, message200: "Error. Cargo no Encontrado" })) return
      if(controlErrors({ respuesta: usuarioRes, constrolError: setErrorServer, message200: "Error. Usuarios de Cargo no Encontrado" }))return
      setData(cargo.data.data)
      setUsuarios(usuarioRes.data.data ? usuarioRes.data.data : [])
    } catch (error) {
      setErrorServer(texts.errorMessage.errorSystem)
      setData(null)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Navbar name={texts.pages.cargo.name} descripcion={texts.pages.cargo.description} dollar={false}>
      <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/cargos/") }}> <IconRowLeft /> Regresar</ButtonSimple>
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
                <h3 className="h2 fw-bold">{`${data.nombre}`}</h3>
                <div className="w-100 d-flex flex-column">
                  <div className="d-flex flex-column flex-md-row  justify-content-between mt-3">
                    <div className={`lg section-perfil d-flex align-items-center justify-content-center mt-2 mx-auto align-self-start ${data.img ? "section-perfil-img" : ""}`}>
                      {
                        data.img ?
                          <img src={data.img} alt="img_perfil" className={`lg img-perfil ${data.img ? "" : "d-none"}`} />
                          :
                          <IconUserCircleSolid />
                      }
                    </div>
                    <div className="w-100 w-sm-50 d-flex flex-column">
                      <p className="m-0 mb-2 text-start fs-5-5"><strong>Codigo: </strong> {formatoId(data.id)}</p>
                      <p className="m-0 mb-2 text-start fs-5-5"><strong>Descripción: </strong> {data.descripcion}</p>
                      {
                        data.administrador ?
                          (
                            <p className="m-0 mb-2 text-start fs-5-5"><strong>Permisos: </strong> Posee permisos de administrador</p>
                          )
                          :

                          <div>
                            <strong className="m-0 mb-2 text-start fs-5-5">Permisos:</strong>
                            {
                              data.permisos.map((permiso, index) => (
                                <p key={`permiso_${index}`} className="m-0 mb-2 ms-4 text-start fs-5-5"><strong>{permiso.nombre}: </strong>{permiso.descripcion}</p>

                              ))
                            }
                          </div>

                      }
                      <p className="m-0 mb-2 text-start fs-5-5"><strong>Fecha de Registro: </strong> {formatDateWithTime12Hour(data.fecha_registro)}</p>
                      <p className="m-0 mb-2 text-start fs-5-5"><strong>Ultima Modificación: </strong> {formatDateWithTime12Hour(data.fecha_actualizacion)}</p>
                    </div>

                  </div>
                  {
                    Boolean(usuariosList.length) &&
                    <div className="w-100 mt-2">
                      <h3 className="text-center fw-bold">Lista de usuarios con el Cargo</h3>
                      <div className="container-table">

                        <table className="table-data border-table border-none tr-select mt-2">
                          <thead>
                            <tr>
                              <th scope="col">N°</th>
                              <th scope="col">Codigo</th>
                              <th scope="col">Usuario</th>
                              <th scope="col">Nombre</th>
                              <th scope="col">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              usuariosList.map((usuario, index) => (
                                <tr key={`${index}-column-usuario`} onDoubleClick={() => { navigate(`/edit/usuario/${usuario.id}`) }}>
                                  <td >
                                    {index + 1}
                                  </td>
                                  <td >
                                    {formatoId(usuario.id)}
                                  </td>
                                  <td >
                                    {usuario.usuario}
                                  </td>
                                  <td >
                                    {`${usuario.nombres} ${usuario.apellidos}`}
                                  </td>
                                  <td >
                                    {usuario.estado ? <Pildora contenido="Activo" color="bg-succes" /> : <Pildora contenido="Inhabilitado" />}
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>

                        </table>
                      </div>
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

export default Cargo