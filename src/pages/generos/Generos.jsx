import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";
import { generos } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { alertInfo } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Generos() {
    const [listGeneros, setGeneros] = useState([])
    const [dataGeneros, setDataGeneros] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    const navigate = useNavigate()
    useEffect(() => {
        document.title="Generos - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getGenero()
            return
        }
    }, [])

    const getGenero = (filtros = {}) => {
        getListItems({
            object: generos,
            setList: setGeneros,
            filtros: { ...filtros },
            setData: setDataGeneros,
            setLoading: setTableLoaing
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
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconDetail
                        onClick={() => {
                            alertInfo(
                                row.nombre,
                                {
                                    codigo: formatoId(row.id),
                                    descripción: row.descripcion,
                                    fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
                                    ultima_modificación: formatDateWithTime12Hour(row.fecha_actualizacion),
                                }
                            )
                        }} 
                        className="cursor-pointer"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.genero}
                        data-bs-trigger="hover"
                    />
                    <IconTrash
                        onClick={() => {
                            deleteItem({
                                row: row,
                                objet: generos,
                                functionGet: getGenero
                            })
                        }}
                        className="cursor-pointer"
                        data-bs-toggle="tooltip" data-bs-placement="top"
                        data-bs-custom-class="custom-tooltip"
                        data-bs-title={texts.tootlip.eliminar}
                        data-bs-trigger="hover"
                    />
                    <IconEdit 
                    onClick={() => { navigate(`/edit/genero/${row.id}/`) }} 
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
            function: (value, filtros = {}) => {
                searchCode({
                    value: value,
                    filtros:filtros,
                    object: generos,
                    setList: setGeneros,
                    setLoading: setTableLoaing,
                    setData: setDataGeneros,
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterGenero,
            function: () => {
                navigate("/register/genero/")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getGeneros.name}`} descripcion={`${texts.pages.getGeneros.description}`} dollar={false}>

            <Table
                columns={columns}
                rows={listGeneros}
                totalElements={dataGeneros.total}
                totalPages={dataGeneros.pages}
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

export default Generos