import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { recreadores } from "../../utils/API.jsx"
import { calcularEdad } from "../../utils/process.jsx"
import { searchCode, getListItems, deleteItem} from "../../utils/actions.jsx"
import {formatoNumero} from "../../utils/process.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Recreadores() {
    const [listRecreadores, setRecreadores] = useState([])
    const [dataRecreadores, setDataRecreadores] = useState({ pages: 0, total: 0 })
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
        getListItems({
            object: recreadores,
            setList: setRecreadores,
            setData: setDataRecreadores,
            setLoading: setTableLoaing
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoNumero(Number(row.id)); return codigo}
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
                const edad = calcularEdad(row.fecha_nacimiento)
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
            placeholder: texts.registerMessage.searchNameDocument,
            function: (value) => {
                searchCode({
                    value: value,
                    object: recreadores,
                    setList: setRecreadores
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterRecreador,
            function: () => {
                navigate("/register/recreador")
            }
        },
        delete: (row) => {
            deleteItem({
              row: row,
              objet: recreadores,
              functionGet: getRecreadores
            })
          },
    }

    return (
        <Navbar name={`${texts.pages.getRecreadores.name}`} descripcion={`${texts.pages.getRecreadores.description}`}>
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