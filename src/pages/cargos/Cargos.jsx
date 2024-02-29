import { useEffect, useState, useRef } from "react"
import { cargos } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import {deleteItem, searchCode, getListItems} from "../../utils/actions.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Cargos() {
    const [listCargos, setCargos] = useState([])
    const [dataCargos, setDataCargos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
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
        {
            name: "Administrador",
            row: (row) => {
                const value = row.administrador ? true : false
                return value
            }
        },
    ]
    const options = {
        delete: (row) => {
            deleteItem({
                row: row,
                objet: cargos,
                functionGet: getCargos
            })
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: cargos,
                    setList: setCargos
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterCargo,
            function: () => {
                navigate("/register/cargo")
            }
        }
    }
    return (
        <Navbar name={texts.pages.getCargos.name} descripcion={texts.pages.getCargos.description}>
            <Table
                columns={columns}
                rows={listCargos}
                totalElements={dataCargos.total}
                totalPages={dataCargos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Cargos