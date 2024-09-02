import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { usuarios } from "../../utils/API.jsx";
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
import { IconDetail, IconEdit, IconKey } from "../../components/Icon.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";
import Pildora from "../../components/Pildora.jsx";

function Usuarios() {
    const [listUsuarios, setUsuarios] = useState([])
    const [dataUsuarios, setDataUsuarios] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getUsuarios()
            return
        }
    }, [])

    const getUsuarios = () => {
        getListItems({
            object: usuarios,
            setList: setUsuarios,
            setData: setDataUsuarios,
            setLoading: setTableLoaing
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Usuario",
            row: (row) => { return `${row.usuario}` }
        },
        {
            name: "Nombre",
            row: (row) => { return `${row.nombres} ${row.apellidos}` }
        },
        {
            name: "Estado",
            row: (row) => {
                return row.estado ? <Pildora contenido="Activo" color="bg-succes" /> : <Pildora contenido="Inhabilitado" />
            }
        },
        {
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconDetail
                        onClick={() => {
                            navigate(`/usuario/${row.id}`)
                        }} 
                        className="cursor-pointer"
                    />
                    <IconEdit onClick={() => { navigate(`/edit/usuario/${row.id}/`) }} className="cursor-pointer" />
                    <IconKey onClick={() => { navigate(`/password/usuario/${row.id}/`) }} className="cursor-pointer" />
                </div>
            }
        }
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchUser,
            function: (value) => {
                searchCode({
                    value: value,
                    object: usuarios,
                    setList: setUsuarios,
                    setData: setDataUsuarios,
                    setLoading: setTableLoaing
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterUser,
            function: () => {
                navigate("/register/usuario/")
            }
        },

    }

    return (
        <Navbar name={`${texts.pages.getUsuarios.name}`} descripcion={`${texts.pages.getUsuarios.description}`}>
            <Table
                columns={columns}
                rows={listUsuarios}
                totalElements={dataUsuarios.total}
                totalPages={dataUsuarios.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Usuarios