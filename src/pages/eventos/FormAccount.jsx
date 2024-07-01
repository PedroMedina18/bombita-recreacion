import { useState, useEffect } from "react";
import { MultiSelect } from "../../components/input/Inputs.jsx"
import { ButtonSimple } from "../../components/button/Button"
import { useForm } from "react-hook-form";
import { toastError } from "../../components/alerts.jsx"
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import texts from "../../context/text_es.js";
import { formatoNumero, truncateString } from "../../utils/process.jsx"
import { useFormEventContext } from "../../context/FormEventContext.jsx"
import ModalSelect from "../../components/modal/ModalSelect.jsx"
import { sobrecargos, servicios } from "../../utils/API.jsx"
function FormAccount() {
    const { dataServicios, SaveDataServicios, dataSobrecargos, setSaveDataSobrecargos, setSaveDataServicios, dataEvent } = useFormEventContext()
    const [submit, setSubmit] = useState(false);
    const [selectServicios, setSelectServicios] = useState([]);
    const [selectSobrecargos, setSelectSobrecargos] = useState([]);
    const [estadoSobrecargos, setEstadoSobrecargos] = useState(false);
    const [estadoServicios, setEstadoServicios] = useState(false);
    const navigate = useNavigate();
    // useEffect(() => {
    //     console.log(dataEvent)
    // }, [])

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
                console.log(data)
            } catch (error) {
                Swal.close()
                toastError(texts.errorMessage.errorConexion)
            }
        }
    )
    const columnsServicio = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoNumero(Number(row.id)); return codigo }
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
            row: (row) => { const codigo = formatoNumero(Number(row.id)); return codigo }
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
    return (
        <>
            <ModalSelect titulo={"Escoja los servicios"} estado={estadoServicios} setEstado={setEstadoServicios} object={servicios} columns={columnsServicio} saveSelect={setSelectServicios} select={selectServicios} />
            <ModalSelect titulo={"Escoja los sobrecargo"} estado={estadoSobrecargos} setEstado={setEstadoSobrecargos} object={sobrecargos} columns={columnsSobrecargo} saveSelect={setSelectSobrecargos} select={selectSobrecargos} />

            <form className="w-100">
                <div className="w-100 d-flex justify-content-between align-item-center">
                    <ButtonSimple type="button" onClick={() => { setEstadoServicios(true) }} className="w-100 mx-5 mt-3">
                        Servicios
                    </ButtonSimple>
                    <ButtonSimple type="button" onClick={() => { setEstadoSobrecargos(true) }} className="w-100 mx-5 mt-3">
                        Sobrecargos
                    </ButtonSimple>
                </div>
                <div className="w-100 d-flex">
                    <ButtonSimple type="button" onClick={(e) => { navigate("/register/eventos") }} className="mx-auto w-50 mt-3">
                        Regresar
                    </ButtonSimple>

                    <ButtonSimple type="submit" className="mx-auto w-50 mt-3">
                        Registrar
                    </ButtonSimple>
                </div>
            </form>
        </>
    )
}

export default FormAccount