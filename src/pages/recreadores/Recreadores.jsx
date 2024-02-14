import { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import { recreadores } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { calcular_edad } from "../../js/functions.js"
function Recreadores() {
    const [listRecreadores, setRecreadores] = useState([])
    const [dataRecreadores, setDataRecreadores] = useState({ pages: 0, total: 0 })
    const { searchCode, getData } = useContext(AuthContext)
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getRecreadores()
            return
        }
    }, [])

    const getRecreadores = () => {
        getData({
            object: recreadores,
            setList: setRecreadores,
            setData: setDataRecreadores,
            setLoading: setTableLoaing
        })
    }
    const columns = [
        {
            name: "Item",
            row: (row) => { return row.id }
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
            name: "Edad",
            row: (row) => {
                const edad = calcular_edad(row.fecha_nacimiento)
                return `${edad} Años`
            }
        },
        {
            name: "Teléfono Principal",
            row: (row) => { return row.telefono_principal }
        },
        {
            name: "Nivel",
            row: (row) => { return row.nivel }
        },
        {
            name: "Inhabilitado",
            row: (row) => {
                const value = row.Inhabilitado ? true : false
                return value
            }
        },
    ]
    const options = {
        search: {
            placeholder: "Buscar por número de Documento o Nombre",
            function: (value) => {
                searchCode({
                    value: value,
                    object: recreadores,
                    setList: setRecreadores
                })
            }
        },
        register: {
            name: "Agregar un nuevo recreador",
            function: () => {
                navigate("/register/recreadores")
            }
        }
    }
    return (
        <Navbar name="Lista de Recreadores" descripcion="Verifique los Recreadores agregados">
            <Table
                columns={columns}
                rows={listRecreadores}
                totalElements={dataRecreadores.total}
                totalPages={dataRecreadores.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Recreadores