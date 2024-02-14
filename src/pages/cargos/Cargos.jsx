import { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import { cargos } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Cargos() {
    const [listCargos, setCargos] = useState([])
    const [dataCargos, setDataCargos] = useState({ pages: 0, total: 0 })
    const { deleteItem, searchCode, getData } = useContext(AuthContext)
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
        getData({
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
                functionGet: getCargos()
            })
        },
        search: {
            placeholder: "Buscar por su Item",
            function: (value) => {
                searchCode({
                    value: value,
                    object: cargos,
                    setList: setCargos
                })
            }
        },
        register: {
            name: "Agregar un nuevo cargo",
            function: () => {
                navigate("/register/cargo")
            }
        }
    }
    return (
        <Navbar name="Lista de Cargos" descripcion="Verifique los cargos agregados">

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