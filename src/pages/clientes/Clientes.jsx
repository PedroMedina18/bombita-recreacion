import { useEffect, useState, useRef } from "react";
import { clientes } from "../../utils/API.jsx";
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
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
        document.title = "Clientes - Bombita Recreación"
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
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
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
            name: "Tel. Principal",
            row: (row) => { return row.telefono_principal }
        },
        {
            name: "Tel. Secundario",
            row: (row) => { return row.telefono_secundario }
        },
        {
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconDetail
                        onClick={() => { navigate(`/clientes/${row.id}/`) }}
                        className="cursor-pointer"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.cliente}
                        data-bs-trigger="hover"
                    />
                    <IconEdit
                        onClick={() => { navigate(`/edit/cliente/${row.id}/`) }}
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
            placeholder: texts.registerMessage.searchNameDocument,
            function: (value, filtros = {}) => {
                searchCode({
                    value: value,
                    filtros: filtros,
                    object: clientes,
                    setList: setClientes,
                    setData: setDataClientes,
                    setLoading: setTableLoaing,
                })
            }
        },
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

export default Clientes