import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { metodoPago } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";

function MetodosPago() {
    const [listMetodos_Pagos, setMetodos_Pagos] = useState([])
    const [dataMetodos_Pagos, setDataMetodos_Pagos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    const navigate = useNavigate()
    useEffect(() => {
        document.title = "Metodos de Pagos - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getMetodos_Pagos()
            return
        }
    }, [])

    const getMetodos_Pagos = () => {
        getListItems({
            object: metodoPago,
            setList: setMetodos_Pagos,
            setData: setDataMetodos_Pagos,
            setLoading: setTableLoaing
        })
    }

    const columns = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
        },
        {
            name: "Descripción",
            row: (row) => { return row.descripcion }
        },
        {
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconDetail
                        onClick={() => {
                            alertInfo(
                                row.nombre, 
                                {
                                  codigo:formatoId(row.id),
                                  descripción:row.descripcion,
                                  referencia:row.referencia? '<span class="badge p-2 bg-success">Obligatorio</span>' : '<span class="badge p-2 bg-danger">Inecesario</span>',
                                  capture:row.capture? '<span class="badge p-2 bg-success">Obligatorio</span>' : '<span class="badge p-2 bg-danger">Inecesario</span>',
                                  divisa:row.divisa? '<span class="badge p-2 bg-success">Monto en Divisa</span>' : '<span class="badge p-2 bg-danger">Monto en Bs.S</span>',
                                }
                            )
                        }} 
                        className="cursor-pointer"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.metodo_pago}
                        data-bs-trigger="hover"
                    />
                    <IconTrash
                        onClick={() => {
                            deleteItem({
                                row: row,
                                objet: metodoPago,
                                functionGet: getMetodos_Pagos
                            })
                        }}
                        className="cursor-pointer"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.eliminar}
                        data-bs-trigger="hover"
                    />
                    <IconEdit 
                    onClick={() => { navigate(`/edit/metodos_pago/${row.id}/`) }} 
                    className="cursor-pointer" 
                    data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.editar}
                        data-bs-trigger="hover"
                    />
                </div>
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value, filtros={}) => {
                searchCode({
                    value: value,
                    filtros:filtros,
                    object: metodoPago,
                    setList: setMetodos_Pagos,
                    setData: setDataMetodos_Pagos,
                    setLoading: setTableLoaing
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterMetodoPago,
            function: () => {
                navigate("/register/metodos_pago/")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getMetodosPago.name}`} descripcion={`${texts.pages.getMetodosPago.description}`} dollar={false}>
            <Table
                columns={columns}
                rows={listMetodos_Pagos}
                totalElements={dataMetodos_Pagos.total}
                totalPages={dataMetodos_Pagos.pages}
                options={options}
                loading={tableLoading}
                order={true}
                organizar={[
                    { label: "Codigo", value: "orig" },
                    { label: "Nombre", value: "alf" },
                ]}
            />
            <Toaster />
        </Navbar>
    )
}

export default MetodosPago