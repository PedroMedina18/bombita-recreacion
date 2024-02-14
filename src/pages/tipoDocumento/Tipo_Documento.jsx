import { useEffect, useState, useContext, useRef } from "react"
import Navbar from "../../components/navbar/Navbar"
import { AuthContext } from '../../context/AuthContext';
import Table from "../../components/table/Table"
import { tipo_documentos } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Tipo_Documento() {
    const [listTipo_Documentos, setTipo_Documentos] = useState([])
    const [dataTipo_Documentos, setDataTipo_Documentos] = useState({ pages: 0, total: 0 })
    const { deleteItem, searchCode, getData } = useContext(AuthContext)
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    const navigate = useNavigate()
    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getTipo_Documentos()
            return
        }
    }, [])

    const getTipo_Documentos = () => {
        getData({
            object: tipo_documentos,
            setList: setTipo_Documentos,
            setData: setDataTipo_Documentos,
            setLoading: setTableLoaing
        })
    }

    const columns = [
        {
            name: "Item",
            row: (row) => { return row.id }
        },
        {
            name: "Nombre",
            row: (row) => { return row.nombre }
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
                objet: tipo_documentos,
                functionGet: getTipo_Documentos()
            })
        },
        search: {
            placeholder: "Buscar por su Item",
            function: (value) => {
                searchCode({
                    value: value,
                    object: tipo_documentos,
                    setList: setTipo_Documentos
                })
            }
        },
        register: {
            name: "Agregar un Nuevo Tipo de Documento",
            function: () => {
                navigate("/register/tipo_documento")
            }
        }
    }
    return (
        <Navbar name="Lista de Tipos de Documentos" descripcion="Verifique los Tipos de Documentos agregados">

            <Table
                columns={columns}
                rows={listTipo_Documentos}
                totalElements={dataTipo_Documentos.total}
                totalPages={dataTipo_Documentos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Tipo_Documento