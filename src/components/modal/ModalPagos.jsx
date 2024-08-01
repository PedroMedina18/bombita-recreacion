import { useState, useRef, useEffect } from 'react'
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { ButtonSimple } from "../button/Button.jsx"
import { InputsGeneral, MoneyInput, InputFile } from "../input/Inputs.jsx"
import { useForm } from "react-hook-form";
import { totalItems } from "../table/Table.jsx"
import { LoaderCircle } from "../loader/Loader.jsx"
import { formatoId } from "../../utils/process.jsx"
import { metodoPago } from "../../utils/API.jsx"
import texts from "../../context/text_es.js"
import ErrorSystem from "../errores/ErrorSystem.jsx"
import { useAuthContext } from "../../context/AuthContext.jsx"
import "./modal.css"
import "../table/table.css"
import ModalBase from "./ModalBase.jsx"
import { toastError } from "../alerts.jsx"
import { useHotkeys } from 'react-hotkeys-hook'

function ModalPagos({ titulo, state, saveDataState, dataEvento }) {
    const [option, setOption] = useState(null)
    const [dataList, setDataList] = useState([])
    const { getUser } = useAuthContext();
    const [dolar] = useState(getUser().dollar.price);
    const renderizado = useRef(0);
    const [estado, setEstado] = state
    const [pagoData, setPagoData] = saveDataState
    const [errorServer, setErrorServer] = useState("");
    const [loading, setLoading] = useState(true);
    const formulario = useRef(null)
    const [dataForm, setDataForm] = useState({ monto: null, referencia: null, img: null })
    const [count, setCount] = useState(0)
    useHotkeys('t', () => {})

    useEffect(() => {
        console.log(count)
    }, [count])
    
    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            buscarMetodoPago()
        }
    }, [])

    const buscarMetodoPago = async () => {
        try {
            const metodosPagos = await metodoPago.get()
            if (metodosPagos.status !== 200) {
                setErrorServer(`Error. ${respuesta.status} ${respuesta.statusText}`)
                return
            }
            if (metodosPagos.data.status === false) {
                setErrorServer(`${respuesta.data.message}`)
                return
            }
            setDataList(metodosPagos.data.data)
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
        reset,
        setValue,
        setError
    } = useForm({ mode: "onChange" });


    const selectOptions = (e) => {
        reset()
        const ID = e.target.dataset.option ? Number(e.target.dataset.option) : Number(e.target.parentNode.dataset.option)
        const metodo_pago = dataList.filter((e) => { return e.id === ID })
        setOption(metodo_pago[0])
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
        }

    ]

    const ativateSubmit = () => {
        formulario.current.requestSubmit()
    }

    const butonDisabled = () => {
        if (!option) {
            return true
        }
        let referencia = true
        let capture = true
        let monto = false
        if (option.referencia) {
            referencia = Boolean(dataForm.referencia) ? true : false
        }
        if (option.capture) {
            capture = Boolean(dataForm.capture) ? true : false
        }
        if (dataForm.monto && dataForm.monto !== '0.0') {
            monto = true
        }
        if (monto && referencia && capture) {
            return false
        } else {
            return true
        }
    }

    const onSubmit = handleSubmit(
        async (data) => {
            if(Number(data.monto) <=0){
                return
            }
            const totalACancelar = dataEvento.TipoPago? dataEvento.totalEvento : dataEvento.anticipoEvento
            const totalCancelado = totalACancelar - dataEvento.totalPagado
            let monto
            if (!Boolean(option.divisa)) {
                monto = (Number(data.monto) / dolar).toFixed(2)
            } else {
                monto = Number(data.monto)
            }
            const objetData = { monto: Number(monto), metodo_pago: option.nombre }
            if (data.referencia) {
                objetData.referencia = data.referencia
            }
            if (option.capture) {
                objetData.capture = dataForm.img
            }
            if (monto > totalCancelado) {
                toastError("El monto presentado supera al total del pago")
            } else {
                const metodoPagoRepeat = pagoData.filter((e) => {
                    return (e.metodo_pago === objetData.metodo_pago && !objetData.referencia && !option.capture)
                })
                if (metodoPagoRepeat.length) {
                    const metodosPago = pagoData.map((e) => {
                        if (e.metodo_pago === objetData.metodo_pago) {
                            e.monto = e.monto + objetData.monto
                            return e
                        }else{
                            return e
                        }
                    })
                    setPagoData(metodosPago)
                } else {
                    setPagoData([...pagoData, objetData])
                }
            }
            setOption(null)
            setEstado(false)
        }
    )

    return (
        <ModalBase titulo={titulo} state={[estado, setEstado]} optionsSucces={["Agregar", () => { ativateSubmit() }]} opcionsDelete={["Cerrar", () => { reset(); setOption(null) }]} disabledTrue={butonDisabled()}>
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
                            <div className='d-flex w-100 mt-2'>
                                <div className='container-table table-overflow-y w-75 pe-4'>
                                    <table className='table-data border-table border-none'>
                                        <thead className='table-modal'>
                                            <tr>
                                                <th scope="col">N°</th>
                                                {
                                                    columns.map((column, index) => (
                                                        <th key={`${index}-${column.name}`} scope="col">{column.name}</th>
                                                    ))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody className='table-modal'>
                                            {
                                                dataList.length === 0 ?
                                                    <>
                                                        <tr>
                                                            <td className="py-3"></td>
                                                            {

                                                                columns.map((column, index) => {
                                                                    return (<td key={`${column.name}-${index}-1`} className="py-3"></td>)
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td className="py-3"></td>
                                                            {

                                                                columns.map((column, index) => {
                                                                    return (<td key={`${column.name}-${index}-2`} className="py-3"></td>)
                                                                })
                                                            }
                                                        </tr>
                                                        <tr>
                                                            <td className="py-3"></td>
                                                            {

                                                                columns.map((column, index) => {
                                                                    return (<td key={`${column.name}-${index}-3`} className="py-3"></td>)
                                                                })
                                                            }
                                                        </tr>
                                                    </>
                                                    :
                                                    dataList.map((row, index) => (
                                                        <tr key={`row-${index}`} className={`${Option === row.id ? "tr-select" : ""}`} data-option={row.id} onClick={(e) => { selectOptions(e) }}>
                                                            <td key={`N°-${index}`}>{index + 1}</td>
                                                            {
                                                                columns.map((column, index) => {
                                                                    if (column.row(row) === true) {
                                                                        return (<td key={`${column.row(row)}-${index}`} className='svg-check'><IconCheck /></td>)
                                                                    }
                                                                    if (column.row(row) === false) {
                                                                        return (<td key={`${column.row(row)}-${index}`} className='svg-x'><IconX /></td>)
                                                                    }
                                                                    return (<td key={`${column.row(row)}-${index}`} >{column.row(row)}</td>)

                                                                })
                                                            }
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className='w-50 px-5'>
                                    {
                                        option &&
                                        <form encType="multiport/form-data" className='d-flex flex-column' id="formPago" ref={formulario} onSubmit={onSubmit}>
                                            <MoneyInput id="monto" label={`Monto en ${option.divisa ? "Divisa" : "Bs"}`} name="monto" form={{ errors, register }}
                                                params={{
                                                    required: {
                                                        value: true,
                                                        message: "Se requiere un monto",
                                                    },
                                                    validate: (e) => {
                                                        if (e <= "0.00") {
                                                            return "Se requiere un monto";
                                                        } else {
                                                            return true;
                                                        }
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    setDataForm({
                                                        ...dataForm,
                                                        monto: e.target.value
                                                    })
                                                }}
                                            />
                                            {
                                                Boolean(option.referencia) &&
                                                <InputsGeneral id="referencia" label="Número de Referencia" type="number" placeholder='Número de Referencia' name="referencia" form={{ errors, register }}
                                                    params={{
                                                        min: {
                                                            value: 0,
                                                            message: texts.inputsMessage.min0
                                                        },
                                                        minLength: {
                                                            value: 4,
                                                            message: "Se espera minimo 4 Digitos"
                                                        },
                                                    }}
                                                    onChange={(e) => {
                                                        setDataForm({
                                                            ...dataForm,
                                                            referencia: e.target.value
                                                        })
                                                    }}
                                                />

                                            }
                                            {
                                                Boolean(option.capture) &&
                                                <InputFile id="capture" label="Agregar Imagen" name="capture" form={{ errors, register }}
                                                    onChange={(e) => {
                                                        setDataForm({
                                                            ...dataForm,
                                                            capture: e.target.files[0] ? e.target.files[0] : null
                                                        })
                                                    }}
                                                />
                                            }
                                        </form>
                                    }
                                </div>
                            </div>
                        )
            }
        </ModalBase>
    )
}

export default ModalPagos