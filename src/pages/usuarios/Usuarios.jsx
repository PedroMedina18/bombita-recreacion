import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { usuarios } from "../../utils/API.jsx"
import { calcularEdad } from "../../utils/process.jsx"
import { searchCode, getListItems, deleteItem } from "../../utils/actions.jsx"
import { formatoId } from "../../utils/process.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";


function Usuarios() {
    const [listUsuarios, setUsuarios] = useState([])
    const [dataUsuarios, setDataUsuarios] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getUsuarios()
            return
        }
    }, [])

    const getUsuarios = () => {
        getListItems({
            object: usuarios,
            setList: setUsuarios,
            setData: setDataUsuarios,
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
            row: (row) => { return `${row.nombres} ${row.apellidos}` }
        },
        {
            name: "Usuario",
            row: (row) => { return `${row.usuario}` }
        },
        {
            name: "Inhabilitado",
            row: (row) => {
                const value = row.Inhabilitado ? true : false
                return value
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchNameDocument,
            function: (value) => {
                searchCode({
                    value: value,
                    object: usuarios,
                    setList: setUsuarios,
                    setData: setDataUsuarios,
                    setLoading: setTableLoaing
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterRecreador,
            function: () => {
                navigate("/register/usuario/")
            }
        },
        
    }
    
    return (
        <Navbar name={`${texts.pages.getUsuarios.name}`} descripcion={`${texts.pages.getUsuarios.description}`}>
            <Table
                columns={columns}
                rows={listUsuarios}
                totalElements={dataUsuarios.total}
                totalPages={dataUsuarios.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Usuarios