import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { recreadores  } from "../../utils/API.jsx"
import { calcularEdad } from "../../utils/process.jsx"
import { searchCode, getListItems, deleteItem, verifyOptionsSelect } from "../../utils/actions.jsx"
import { formatoId } from "../../utils/process.jsx"
import { useAuthContext } from '../../context/AuthContext.jsx';
import Navbar from "../../components/navbar/Navbar"
import Pildora from "../../components/Pildora.jsx"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Recreadores() {
    const [listRecreadores, setRecreadores] = useState([])
    const [dataRecreadores, setDataRecreadores] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const {dataOptions} = useAuthContext()
    const [niveles] = useState(dataOptions().niveles)
    const [generos] = useState(dataOptions().generos)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getRecreadores()
            return
        }
    }, [])

    const getRecreadores = async() => {
        try{
            getListItems({
                object: recreadores,
                setList: setRecreadores,
                setData: setDataRecreadores,
                setLoading: setTableLoaing
            })
        }catch(error) {
            console.log(error)
            setErrorServer(texts.errorMessage.errorSystem)
        }
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
        },
        {
            name: "Documento",
            row: (row) => { return `${row.tipo_documento}-${row.numero_documento}` }
        },
        {
            name: "Genero",
            row: (row) => { return `${row.genero}` }
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
            name: "Estado",
            row: (row) => {
                return row.inhabilitado ? <Pildora contenido="Invalido"/> : <Pildora contenido="Activo" color="bg-succes"/>
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchNameDocument,
            function: (value, filtros={}) => {
                searchCode({
                    value: value,
                    filtros:filtros,
                    object: recreadores,
                    setList: setRecreadores,
                    setData: setDataRecreadores,
                    setLoading: setTableLoaing
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterRecreador,
            function: () => {
                navigate("/register/recreador/")
            }
        },
        put: (row)=>{
            navigate(`/edit/recreador/${row.numero_documento}/`)
        },
        get: (row)=>{
            navigate(`/recreador/${row.numero_documento}/`)
        },
        delete: (row) => {
            deleteItem({
              row: row,
              objet: recreadores,
              functionGet: getRecreadores
            })
          },
    }

    const filtros=[
        {
            nombre:"Estado",
            columnName:"estado",
            opciones:[{label:"Activo", value:0}, {label:"Desabilitado", value:1}]
        },
        {
            nombre:"Nivel",
            columnName:"nivel",
            opciones:niveles
        },
        {
            nombre:"Genero",
            columnName:"genero",
            opciones:generos
        }
    ]

    return (
        <Navbar name={`${texts.pages.getRecreadores.name}`} descripcion={`${texts.pages.getRecreadores.description}`}>
            <Table
                columns={columns}
                rows={listRecreadores}
                totalElements={dataRecreadores.total}
                totalPages={dataRecreadores.pages}
                options={options}
                loading={tableLoading}
                filtradores={filtros}
                order={true}
                organizar={["Origen", "Nombre"]}
            />
            <Toaster />
        </Navbar>
    )
}

export default Recreadores