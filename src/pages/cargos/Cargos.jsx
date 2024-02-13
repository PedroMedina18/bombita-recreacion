import { useEffect, useState, useContext } from "react"
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
    const navigate = useNavigate()
    useEffect(() => {
        getCargos()
    }, [])

    const getCargos = () => {
        getData({
            object:cargos,
            setList: setCargos,
            setData: setDataCargos
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
                navigate("/register/cargos")
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
            />
            <Toaster />
        </Navbar>
    )
}

export default Cargos