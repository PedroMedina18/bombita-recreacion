import { useEffect, useState, useRef } from "react"
import { materiales } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import {deleteItem, searchCode, getListItems} from "../../utils/actions.jsx";
import { formatoNumero } from "../../utils/process.jsx";
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
            name: "Codigo",
            row: (row) => { const codigo = formatoNumero(Number(row.id)); return codigo}
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
            name: "Total",
            row: (row) => { return row.total }
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
        get:(row)=>{
            alertInfo(
              row.nombre, 
              row
            )
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: materiales,
                    setList: setMateriales
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/material/${row.id}`)
        },
        register: {
            name: texts.registerMessage.buttonRegisterMaterial,
            function: () => {
                navigate("/register/material")
            }
        }
    }
    
    return (
        <Navbar name={texts.pages.getMateriales.name} descripcion={texts.pages.getMateriales.description}>

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