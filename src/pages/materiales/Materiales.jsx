import { useEffect, useState, useContext, useRef } from "react"
import Navbar from "../../components/navbar/Navbar"
import { AuthContext } from '../../context/AuthContext';
import Table from "../../components/table/Table"
import { materiales } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Materiales() {
    const [listMateriales, setMateriales] = useState([])
    const [dataMateriales, setDataMateriales] = useState({ pages: 0, total: 0 })
    const { deleteItem, searchCode, getData } = useContext(AuthContext)
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getMateriales()
            return
        }
    }, [])

    const getMateriales = () => {
        getData({
            object: materiales,
            setList: setMateriales,
            setData: setDataMateriales,
            setLoading: setTableLoaing,
            
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
                objet: materiales,
                functionGet: getMateriales
            })
        },
        search: {
            placeholder: "Buscar por su Item",
            function: (value) => {
                searchCode({
                    value: value,
                    object: materiales,
                    setList: setMateriales
                })
            }
        },
        register: {
            name: "Agregar un Nuevo Materiales",
            function: () => {
                navigate("/register/material")
            }
        }
    }
    return (
        <Navbar name="Lista de Materiales" descripcion="Verifique los Materiales agregados">

            <Table
                columns={columns}
                rows={listMateriales}
                totalElements={dataMateriales.total}
                totalPages={dataMateriales.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Materiales