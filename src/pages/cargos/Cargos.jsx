import { useEffect, useState, useRef } from "react";
import { cargos } from "../../utils/API.jsx";
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId } from "../../utils/process.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";

function Cargos() {
    const [listCargos, setCargos] = useState([])
    const [dataCargos, setDataCargos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        document.title="Cargos - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getCargos()
            return
        }
    }, [])

    const getCargos = () => {
        getListItems({
            object: cargos,
            setList: setCargos,
            setData: setDataCargos,
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
            name: "Administrador",
            row: (row) => {
                const value = row.administrador ? true : false
                return value
            }
        },
        {
            name: "Opciones",
            row: (row) => {
              return <div className='d-flex justify-content-around options-table'>
                <IconDetail
                  onClick={() => { navigate(`/cargo/${row.id}/`) }} className="cursor-pointer"
                />
                <IconTrash
                  onClick={() => {
                    deleteItem({
                        row: row,
                        objet: cargos,
                        functionGet: getCargos
                    })
                  }}
                  className="cursor-pointer"
                />
                <IconEdit onClick={() => { navigate(`/edit/cargo/${row.id}/`) }} className="cursor-pointer" />
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
                    object: cargos,
                    setList: setCargos,
                    setData: setDataCargos,
                    setLoading: setTableLoaing
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterCargo,
            function: () => {
                navigate("/register/cargo/")
            }
        }
    }
    return (
        <Navbar name={texts.pages.getCargos.name} descripcion={texts.pages.getCargos.description} dollar={false}>
            <Table
                columns={columns}
                rows={listCargos}
                totalElements={dataCargos.total}
                totalPages={dataCargos.pages}
                options={options}
                loading={tableLoading}
                order={true}
                organizar={[
                    { label: "Origen", value: "orig" },
                    { label: "Nombre", value: "alf" },
                ]}
            />
            <Toaster />
        </Navbar>
    ) 
}

export default Cargos