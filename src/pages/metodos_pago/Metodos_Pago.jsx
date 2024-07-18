import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { metodoPago } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Metodos_Pago() {
    const [listMetodos_Pagos, setMetodos_Pagos] = useState([])
    const [dataMetodos_Pagos, setDataMetodos_Pagos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    const navigate = useNavigate()
    useEffect(() => {
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
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
        },
        {
            name: "Referencia",
            row: (row) => { return row.referencia? true : false }
        },
        {
            name: "Capture",
            row: (row) => { return row.capture? true : false }
        },
        {
            name: "Descripcion",
            row: (row) => { return row.descripcion }
        },
    ]

    const options = {
        delete: (row) => {
            deleteItem({
                row: row,
                objet: metodoPago,
                functionGet: getMetodos_Pagos
            })
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: metodoPago,
                    setList: setMetodos_Pagos,
                    setData: setDataMetodos_Pagos,
                    setLoading: setTableLoaing
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/Metodos_Pago/${row.id}`)
        },
        get:(row)=>{
            alertInfo(
              row.nombre, 
              row
            )
        },
        register: {
            name: texts.registerMessage.buttonRegisterMetodoPago,
            function: () => {
                navigate("/register/Metodos_Pago")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getMetodosPago.name}`} descripcion={`${texts.pages.getMetodosPago.description}`}>

            <Table
                columns={columns}
                rows={listMetodos_Pagos}
                totalElements={dataMetodos_Pagos.total}
                totalPages={dataMetodos_Pagos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Metodos_Pago