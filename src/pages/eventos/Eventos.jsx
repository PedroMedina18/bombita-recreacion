import { useEffect, useState, useRef } from "react"
import { eventos } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { alertInfo } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Eventos() {
    const [listEventos, setEventos] = useState([])
    const [dataEventos, setDataEventos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getEventos()
            return
        }
    }, [])

    const getEventos = () => {
        getListItems({
            object: eventos,
            setList: setEventos,
            setData: setDataEventos,
            setLoading: setTableLoaing,
            
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Fecha",
            row: (row) => { const fecha = formatDateWithTime12Hour(row.fecha_evento); return fecha }
        },
        {
            name: "Documento",
            row: (row) => { return `${row.tipo_documento}-${row.numero_documento}` }
        },
        {
            name: "Cliente",
            row: (row) => { return `${row.nombres} ${row.apellidos}` }
        },
        {
            name: "Número de Personas",
            row: (row) => { return `${row.numero_personas}` }
        },
        {
            name: "Estado",
            row: (row) => {  
                const value = row.estado ? true : false
                return value 
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: eventos,
                    setList: setEventos,
                    setData: setDataEventos,
                    setLoading: setTableLoaing,
                })
            }
        },
        money: (row)=>{
            navigate(`/pago_evento/${row.id}`)
        },
        register: {
            name: texts.registerMessage.buttonRegisterEvento,
            function: () => {
                navigate("/register/eventos/")
            }
        }
    }
    
    return (
        <Navbar name={texts.pages.getEventos.name} descripcion={texts.pages.getEventos.description}>

            <Table
                columns={columns}
                rows={listEventos}
                totalElements={dataEventos.total}
                totalPages={dataEventos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Eventos