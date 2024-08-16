import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { tipo_documentos } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour,  } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";

function TipoDocumento() {
    const [listTipo_Documentos, setTipo_Documentos] = useState([])
    const [dataTipo_Documentos, setDataTipo_Documentos] = useState({ pages: 0, total: 0 })
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
        getListItems({
            object: tipo_documentos,
            setList: setTipo_Documentos,
            setData: setDataTipo_Documentos,
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
            name: "Descripcion",
            row: (row) => { return row.descripcion }
        },
    ]

    const options = {
        delete: (row) => {
            deleteItem({
                row: row,
                objet: tipo_documentos,
                functionGet: getTipo_Documentos
            })
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: tipo_documentos,
                    setList: setTipo_Documentos,
                    setData: setDataTipo_Documentos,
                    setLoading: setTableLoaing
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/tipo_documento/${row.id}/`)
        },
        get:(row)=>{
            alertInfo(
              row.nombre, 
              {
                codigo:formatoId(row.id),
                descripción:row.descripcion,
                fecha_de_registro:formatDateWithTime12Hour(row.fecha_registro),
                fecha_de_actualizacion:formatDateWithTime12Hour(row.fecha_actualizacion),
              }
            )
        },
        register: {
            name: texts.registerMessage.buttonRegisterTipoDocumento,
            function: () => {
                navigate("/register/tipo_documento/")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getTipoDocumentos.name}`} descripcion={`${texts.pages.getTipoDocumentos.description}`}>

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

export default TipoDocumento