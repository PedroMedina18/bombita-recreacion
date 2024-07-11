import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { generos } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
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
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getGenero()
            return
        }
    }, [])

    const getGenero = () => {
        getListItems({
            object: generos,
            setList: setGeneros,
            setData: setDataGeneros,
            setLoading: setTableLoaing
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
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
                objet: generos,
                functionGet: getGenero
            })
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: generos,
                    setList: setGeneros,
                    setLoading: setTableLoaing,
                    setData: setDataGeneros,
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/genero/${row.id}`)
        },
        get:(row)=>{
            alertInfo(
              row.nombre, 
              row
            )
        },
        register: {
            name: texts.registerMessage.buttonRegisterGenero,
            function: () => {
                navigate("/register/genero")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getGeneros.name}`} descripcion={`${texts.pages.getGeneros.description}`}>

            <Table
                columns={columns}
                rows={listGeneros}
                totalElements={dataGeneros.total}
                totalPages={dataGeneros.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Generos