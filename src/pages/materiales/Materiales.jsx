import { useEffect, useState, useRef } from "react"
import { materiales } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatDateWithTime12Hour } from "../../utils/process.jsx";
import { IconTrash, IconEdit, IconDetail, IconList,  } from "../../components/Icon.jsx";
import { formatoId } from "../../utils/process.jsx";
import { alertInfo } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Materiales() {
    const [listMateriales, setMateriales] = useState([])
    const [dataMateriales, setDataMateriales] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Materiales - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getMateriales()
            return
        }
    }, [])

    const getMateriales = () => {
        getListItems({
            object: materiales,
            setList: setMateriales,
            setData: setDataMateriales,
            setLoading: setTableLoaing,

        })
    }

    const columns = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
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
            name: "Total",
            row: (row) => { return row.total }
        },
        {
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconList
                        onClick={() => {
                            navigate(`/inventario/${row.id}/`)
                        }}
                        className="cursor-pointer"
                    />
                    <IconDetail
                        onClick={() => {
                            alertInfo(
                                row.nombre,
                                {
                                    codigo: formatoId(row.id),
                                    descripción: row.descripcion,
                                    total: row.total,
                                    fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
                                    fecha_de_actualizacion: formatDateWithTime12Hour(row.fecha_actualizacion),
                                }
                            )
                        }}
                        className="cursor-pointer"
                    />
                    <IconTrash
                        onClick={() => {
                            deleteItem({
                                row: row,
                                objet: materiales,
                                functionGet: getMateriales
                            })
                        }}
                        className="cursor-pointer"
                    />
                    <IconEdit onClick={() => { navigate(`/edit/material/${row.id}/`) }} className="cursor-pointer" />
                </div>
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value, filtros = null) => {
                searchCode({
                    value: value,
                    object: materiales,
                    setList: setMateriales,
                    setData: setDataMateriales,
                    setLoading: setTableLoaing,
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterMaterial,
            function: () => {
                navigate("/register/material/")
            }
        }
    }

    return (
        <Navbar name={texts.pages.getMateriales.name} descripcion={texts.pages.getMateriales.description} dollar={false}>
            <Table
                columns={columns}
                rows={listMateriales}
                totalElements={dataMateriales.total}
                totalPages={dataMateriales.pages}
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

export default Materiales