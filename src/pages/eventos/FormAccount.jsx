import { useState } from "react";
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { toastError, alertConfim, alertLoading } from "../../components/alerts.jsx"
import { useNavigate } from 'react-router-dom'
import { formatoId, truncateString } from "../../utils/process.jsx"
import { useFormEventContext } from "../../context/FormEventContext.jsx"
import ModalSelect from "../../components/modal/ModalSelect.jsx"
import { sobrecargos, servicios, eventos } from "../../utils/API.jsx"
import { controlResultPost } from "../../utils/actions.jsx"
import { useAuthContext } from "../../context/AuthContext.jsx"
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import TableDescriptionFacture from "../../components/table/TableDescriptionFacture.jsx"

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
                const message = texts.confirmMessage.confirRegister
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
                    body.fecha_evento = dataEvent.fecha_evento
                    body.numero_personas = dataEvent.numero_personas
                    body.direccion = dataEvent.direccion
                    body.servicios = saveDataServicios
                    body.sobrecargos = saveDataSobrecargos
                    console.log(body)
                    alertLoading("Cargando")
                    const res = await eventos.post(body)
                    controlResultPost({
                        respuesta: res,
                        messageExito: texts.successMessage.registerEvento,
                        useNavigate: { navigate: navigate, direction: "/inicio/" }
                    })

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
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Nombre",
            row: (row) => { const nombre = truncateString(row.nombre, 50); return nombre }
        },
        {
            name: "Precio",
            row: (row) => { return `${row.precio} $` }
        },
        {
            name: "Duracion",
            row: (row) => {
                const horas = row.duracion.horas
                const minutos = row.duracion.minutos
                return `${horas < 10 ? `0${horas}` : horas}:${minutos < 10 ? `0${minutos}` : minutos}`

            }
        },
        {
            name: "Número de Recreadores",
            row: (row) => { return `${row.numero_recreadores}` }
        }
    ]

    const columnsSobrecargo = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
        },
        {
            name: "Monto",
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
                <div className="w-100 d-flex justify-content-between align-item-center">
                    <ButtonSimple type="button" onClick={() => { setEstadoServicios(true) }} className="w-100 mx-5 mt-3">
                        Servicios
                    </ButtonSimple>
                    <ButtonSimple type="button" onClick={() => { setEstadoSobrecargos(true) }} className="w-100 mx-5 mt-3">
                        Sobrecargos
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
                    <div >
                        <div className="d-flex justify-content-between mt-2">
                            <p className="m-0 mb-1 fw-bold h5 w-100">Servicios</p>
                            <p className="m-0 mb-1 fw-bold h5 w-100 text-center">{`${sumarPrecios(dataServicios, saveDataServicios)} $`}</p>
                            <p className="m-0 mb-1 fw-bold h5 w-100 text-center">{`${(sumarPrecios(dataServicios, saveDataServicios) * dolar).toFixed(2)} BS.s`}</p>
                        </div>
                        {
                            saveDataSobrecargos.length ?
                                (
                                    <>
                                        <div className="d-flex justify-content-between">
                                            <p className="m-0 mb-1 fw-bold h5 w-100">Sobrecargos</p>
                                            <p className="m-0 mb-1 fw-bold h5 w-100 text-center">{`${sumarPrecios(dataSobrecargos, saveDataSobrecargos)} $`}</p>
                                            <p className="m-0 mb-1 fw-bold h5 w-100 text-center">{`${(sumarPrecios(dataSobrecargos, saveDataSobrecargos) * dolar).toFixed(2)} BS.s`}</p>
                                        </div>
                                    </>
                                )
                                :
                                ("")
                        }

                        <div className="d-flex justify-content-between">
                            <p className="m-0 fw-bold h3 w-100">Total</p>
                            <p className="m-0 fw-bold h3 w-100 text-center">{`${sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecargos, saveDataSobrecargos)} $`}</p>
                            <p className="m-0 fw-bold h3 w-100 text-center">{`${((sumarPrecios(dataServicios, saveDataServicios) + sumarPrecios(dataSobrecargos, saveDataSobrecargos)) * dolar).toFixed(2)} BS.s`}</p>
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