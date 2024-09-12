import { useState } from "react";
import { ButtonSimple } from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { toastError, alertConfim, alertLoading } from "../../components/alerts.jsx";
import { useNavigate } from 'react-router-dom';
import { formatoId, truncateString } from "../../utils/process.jsx";
import { useFormEventContext } from "../../context/FormEventContext.jsx";
import { sobrecargos, servicios, eventos } from "../../utils/API.jsx";
import { IconService, IconBilletera } from "../../components/Icon.jsx";
import { controlResultPost } from "../../utils/actions.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import ModalSelect from "../../components/modal/ModalSelect.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import TableDescriptionFacture from "../../components/table/TableDescriptionFacture.jsx";

function FormAccount() {
    const { getUser, dataOptions } = useAuthContext();
    const [dolar] = useState(getUser().dollar.price);
    const { dataServicios, saveDataServicios, valueCliente, saveDataSobrecargos, dataSobrecargos, setSaveDataSobrecargos, setSaveDataServicios, dataEvent } = useFormEventContext()
    const [estadoSobrecargos, setEstadoSobrecargos] = useState(false);
    const [estadoServicios, setEstadoServicios] = useState(false);
    const navigate = useNavigate();

    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm();

    // *Funcion para registrar
    const onSubmit = handleSubmit(
        async (data) => {
            try {
                const message = texts.confirmMessage.confirmRegister
                if (!saveDataServicios.length) {
                    toastError("No ha seleccionado ningun servicio. Corrija Por favor")
                    return
                }
                const confirmacion = await alertConfim("Confirmar", message)
                if (confirmacion.isConfirmed) {
                    const body = {}
                    if (valueCliente) {
                        body.id_cliente = valueCliente.id
                    }
                    if (dataEvent.id_persona) {
                        body.id_persona = dataEvent.id_persona
                    }
                    body.nombres = dataEvent.nombres
                    body.apellidos = dataEvent.apellidos
                    body.numero_documento = dataEvent.numero_documento
                    body.telefono_principal = dataEvent.telefono_principal
                    body.telefono_secundario = dataEvent.telefono_secundario
                    body.correo = dataEvent.correo
                    body.tipo_documento = dataEvent.tipo_documento
                    body.fecha_evento_inicio = dataEvent.fecha_evento_inicio
                    body.numero_personas = dataEvent.numero_personas
                    body.direccion = dataEvent.direccion
                    body.servicios = saveDataServicios
                    body.sobrecargos = saveDataSobrecargos
                    alertLoading("Cargando")
                    const respuesta = await eventos.post(body)
                    if (respuesta.status = 200) {
                        if (respuesta.data.status) {
                            Swal.close()
                            navigate(`/eventos/pagos/${respuesta.data.id}/`)
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
                console.log(error)
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )

    const columnsServicio = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Servicio",
            row: (row) => { const nombre = truncateString(row.nombre, 50); return nombre }
        },
        {
            name: "Precio Ref",
            row: (row) => { return `${row.precio} $` }
        },
        {
            name: "Duración",
            row: (row) => {
                const horas = row.duracion.horas
                const minutos = row.duracion.minutos
                return `${horas < 10 ? `0${horas}` : horas}:${minutos < 10 ? `0${minutos}` : minutos}`

            }
        },
        {
            name: "N° Recreadores Necesarios",
            row: (row) => { return `${row.numero_recreadores}` }
        }
    ]

    const columnsSobrecargo = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
        },
        {
            name: "Monto Ref",
            row: (row) => { return `${row.monto} $` }
        },
    ]

    function sumarPrecios(listData, listSelect) {
        let suma = 0;
        listSelect.forEach(id => {
            listData.forEach(objeto => {
                if (objeto.id === id) {
                    const precio = objeto.precio ? objeto.precio : objeto.monto
                    suma += precio;
                }
            });
        });
        return suma;
    }
    
    return (
        <>
            <ModalSelect titulo={"Escoja los servicios"} state={[estadoServicios, setEstadoServicios]} object={servicios} columns={columnsServicio} saveSelect={setSaveDataServicios} select={saveDataServicios} />
            <ModalSelect titulo={"Escoja los sobrecargo"} state={[estadoSobrecargos, setEstadoSobrecargos]} object={sobrecargos} columns={columnsSobrecargo} saveSelect={setSaveDataSobrecargos} select={saveDataSobrecargos} />

            <form className="w-100 d-flex flex-column justify-content-between" onSubmit={onSubmit}>
                <div className="w-100 d-flex justify-content-end align-item-center">
                    <ButtonSimple type="button" onClick={() => { setEstadoServicios(true) }} className="px-4 mt-3">
                        <IconService/>
                    </ButtonSimple>
                    <ButtonSimple type="button" onClick={() => { setEstadoSobrecargos(true) }} className="px-4 ms-5 mt-3">
                        <IconBilletera/>
                    </ButtonSimple>
                </div>
                <div className="w-100 d-flex flex-column justify-content-between align-item-center">
                    <div>

                        <h6 className="m-0 mb-2 fw-bold h4">Servicios</h6>
                        <TableDescriptionFacture listaData={dataServicios} listDescripcion={saveDataServicios} saveListDescription={setSaveDataServicios} />
                        {
                            saveDataSobrecargos.length ?
                                (
                                    <>
                                        <h6 className="m-0 my-2 fw-bold h4">Sobrecargos</h6>
                                        <TableDescriptionFacture listaData={dataSobrecargos} listDescripcion={saveDataSobrecargos} saveListDescription={setSaveDataSobrecargos} />
                                    </>
                                )
                                :
                                ("")
                        }

                    </div>
                    <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <p className="m-0 fw-bold h5 w-100">Servicios</p>
                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${sumarPrecios(dataServicios, saveDataServicios)} $`}</p>
                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${(sumarPrecios(dataServicios, saveDataServicios) * dolar).toFixed(2)} BS.s`}</p>
                        </div>
                        {
                            saveDataSobrecargos.length ?
                                (
                                    <>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="m-0 fw-bold h5 w-100">Sobrecargos</p>
                                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${sumarPrecios(dataSobrecargos, saveDataSobrecargos)} $`}</p>
                                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${(sumarPrecios(dataSobrecargos, saveDataSobrecargos) * dolar).toFixed(2)} BS.s`}</p>
                                        </div>
                                    </>
                                )
                                :
                                ("")
                        }

                        <div className="d-flex justify-content-between mb-2">
                            <p className="mb-0 fw-bold h3 w-100">Total</p>
                            <p className="mb-0 fw-semibold h3 w-100 text-center">{`${sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecargos, saveDataSobrecargos)} $`}</p>
                            <p className="mb-0 fw-semibold h3 w-100 text-center">{`${((sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecargos, saveDataSobrecargos)) * dolar).toFixed(2)} BS.s`}</p>
                        </div>
                    </div>
                </div>

                <div className="w-100 d-flex">
                    <ButtonSimple type="button" onClick={(e) => { navigate("/register/eventos/") }} className="w-100 mx-5 mt-3">
                        Regresar
                    </ButtonSimple>

                    <ButtonSimple type="submit" className="w-100 mx-5 mt-3">
                        Registrar
                    </ButtonSimple>
                </div>
            </form>
        </>
    )
}

export default FormAccount