import { useEffect, useState, useRef } from "react"
import { clientes } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Clientes() {
    const [listClientes, setClientes] = useState([])
    const [dataClientes, setDataClientes] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getClientes()
            return
        }
    }, [])

    const getClientes = () => {
        getListItems({
            object: clientes,
            setList: setClientes,
            setData: setDataClientes,
            setLoading: setTableLoaing,
            
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
        },
        {
            name: "Documento",
            row: (row) => { return `${row.tipo_documento}-${row.numero_documento}` }
        },
        {
            name: "Nombre",
            row: (row) => { return `${row.nombres} ${row.apellidos}` }
        },
        {
            name: "Correo",
            row: (row) => { return row.correo }
        },
        {
            name: "Teléfono Principal",
            row: (row) => { return row.telefono_principal }
        },
        {
            name: "Teléfono Secundario",
            row: (row) => { return row.telefono_secundario }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: clientes,
                    setList: setClientes,
                    setData: setDataClientes,
                    setLoading: setTableLoaing,
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/cliente/${row.numero_documento}/`)
        }
    }
    
    return (
        <Navbar name={texts.pages.getClientes.name} descripcion={texts.pages.getClientes.description}>

            <Table
                columns={columns}
                rows={listClientes}
                totalElements={dataClientes.total}
                totalPages={dataClientes.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Clientes