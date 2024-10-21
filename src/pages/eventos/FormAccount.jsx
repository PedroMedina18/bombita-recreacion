import { useState, useEffect } from "react";
import { ButtonSimple } from "../../components/button/Button";
import { useForm } from "react-hook-form";
import { toastError, alertConfim, alertLoading } from "../../components/alerts.jsx";
import { useNavigate } from 'react-router-dom';
import { formatoId, truncateString, activeTooltip } from "../../utils/process.jsx";
import { useFormEventContext } from "../../context/FormEventContext.jsx";
import { sobrecostos, servicios, eventos } from "../../utils/API.jsx";
import { IconService, IconBilletera } from "../../components/Icon.jsx";
import { useAuthContext } from "../../context/AuthContext.jsx";
import ModalSelect from "../../components/modal/ModalSelect.jsx";
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import TableDescriptionFacture from "../../components/table/TableDescriptionFacture.jsx";

function FormAccount() {
    const { getUser, dataOptions } = useAuthContext();
    const { dataServicios, saveDataServicios, valueCliente, saveDataSobrecostos, dataSobrecostos, setSaveDataSobrecostos, setSaveDataServicios, dataEvent } = useFormEventContext()
    const [dolar] = useState(getUser().dollar.price);
    const [estadoSobrecostos, setEstadoSobrecostos] = useState(false);
    const [estadoServicios, setEstadoServicios] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        activeTooltip()
    }, [])

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
                    body.numero_documento = Number(dataEvent.numero_documento)
                    body.telefono_principal = Number(dataEvent.telefono_principal)
                    body.telefono_secundario = Number(dataEvent.telefono_secundario) ? Number(dataEvent.telefono_secundario) : null
                    body.correo = dataEvent.correo
                    body.tipo_documento = Number(dataEvent.tipo_documento)
                    body.fecha_evento_inicio = dataEvent.fecha_evento_inicio
                    body.numero_personas = Number(dataEvent.numero_personas)
                    body.direccion = dataEvent.direccion
                    body.servicios = saveDataServicios
                    body.sobrecostos = saveDataSobrecostos
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

    const columnsSobrecosto = [
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
            <ModalSelect titulo={"Escoja los sobrecosto"} state={[estadoSobrecostos, setEstadoSobrecostos]} object={sobrecostos} columns={columnsSobrecosto} saveSelect={setSaveDataSobrecostos} select={saveDataSobrecostos} />

            <form className="w-100 d-flex flex-column justify-content-between" onSubmit={onSubmit}>
                <div className="w-100 d-flex justify-content-end align-item-center">
                    <ButtonSimple type="button" onClick={() => { setEstadoServicios(true) }} className="px-4 mt-3"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.addServicios}
                        data-bs-trigger="hover"
                    >
                        <IconService />
                    </ButtonSimple>
                    <ButtonSimple type="button" onClick={() => { setEstadoSobrecostos(true) }} className="px-4 ms-5 mt-3"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.addSobrecostos}
                        data-bs-trigger="hover"
                    >
                        <IconBilletera />
                    </ButtonSimple>
                </div>
                <div className="w-100 d-flex flex-column justify-content-between align-item-center">
                    <div>

                        <h6 className="m-0 mb-2 fw-bold h4">Servicios</h6>
                        <TableDescriptionFacture listaData={dataServicios} listDescripcion={saveDataServicios} saveListDescription={setSaveDataServicios} />
                        {
                            saveDataSobrecostos.length ?
                                (
                                    <>
                                        <h6 className="m-0 my-2 fw-bold h4">Sobrecostos</h6>
                                        <TableDescriptionFacture listaData={dataSobrecostos} listDescripcion={saveDataSobrecostos} saveListDescription={setSaveDataSobrecostos} />
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
                            saveDataSobrecostos.length ?
                                (
                                    <>
                                        <div className="d-flex justify-content-between mb-2">
                                            <p className="m-0 fw-bold h5 w-100">Sobrecostos</p>
                                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${sumarPrecios(dataSobrecostos, saveDataSobrecostos)} $`}</p>
                                            <p className="m-0 fw-semibold h5 w-100 text-center">{`${(sumarPrecios(dataSobrecostos, saveDataSobrecostos) * dolar).toFixed(2)} BS.s`}</p>
                                        </div>
                                    </>
                                )
                                :
                                ("")
                        }

                        <div className="d-flex justify-content-between mb-2">
                            <p className="mb-0 fw-bold h3 w-100">Total</p>
                            <p className="mb-0 fw-semibold h3 w-100 text-center">{`${sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecostos, saveDataSobrecostos)} $`}</p>
                            <p className="mb-0 fw-semibold h3 w-100 text-center">{`${((sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecostos, saveDataSobrecostos)) * dolar).toFixed(2)} BS.s`}</p>
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