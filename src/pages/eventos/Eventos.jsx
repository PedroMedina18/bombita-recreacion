import { useEffect, useState, useRef } from "react";
import { eventos } from "../../utils/API.jsx";
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDetail, IconMoney } from "../../components/Icon.jsx"
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Eventos() {
    const [listEventos, setEventos] = useState([])
    const [dataEventos, setDataEventos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getEventos()
            return
        }
    }, [])

    const getEventos = () => {
        getListItems({
            object: eventos,
            setList: setEventos,
            setData: setDataEventos,
            setLoading: setTableLoaing,
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Fecha",
            row: (row) => { const fecha = formatDateWithTime12Hour(row.fecha_evento_inicio); return fecha }
        },
        {
            name: "Documento",
            row: (row) => { return `${row.tipo_documento}-${row.numero_documento}` }
        },
        {
            name: "Cliente",
            row: (row) => { return `${row.nombres} ${row.apellidos}` }
        },
        {
            name: "Número de Personas",
            row: (row) => { return `${row.numero_personas}` }
        },
        {
            name: "Anticipo",
            row: (row) => {  
                const value = row.anticipo ? true : false
                return value 
            }
        },
        {
            name: "Pago Total",
            row: (row) => {  
                const value = row.total ? true : false
                return value 
            }
        },
        {
            name: "Estado",
            row: (row) => {  
                const value = row.estado ? true : false
                return value 
            }
        },
        {
            name: "Opciones",
            row: (row) => {
              return <div className='d-flex justify-content-around options-table'>
                {/* <IconDetail
                  onClick={() => {
                    alertInfo(
                      row.nombre,
                      {
                        codigo: formatoId(row.id),
                        descripción: row.descripcion,
                        fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
                        fecha_de_actualizacion: formatDateWithTime12Hour(row.fecha_actualizacion),
                      })
                  }} className="cursor-pointer"
                /> */}
                {/* <IconTrash
                  onClick={() => {
                    deleteItem({
                      row: row,
                      objet: actividades,
                      functionGet: getActividades
                    })
                  }}
                  className="cursor-pointer"
                /> */}
                {/* <IconEdit onClick={() => { navigate(`/edit/cliente/${row.numero_documento}/`) }} className="cursor-pointer" /> */}
                <IconMoney onClick={() => { navigate(`/eventos/recreadores/${row.id}/`) }} className="cursor-pointer" />
              </div>
            }
          },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: eventos,
                    setList: setEventos,
                    setData: setDataEventos,
                    setLoading: setTableLoaing,
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterEvento,
            function: () => {
                navigate("/register/eventos/")
            }
        }
    }
    
    return (
        <Navbar name={texts.pages.getEventos.name} descripcion={texts.pages.getEventos.description}>
            <Table
                columns={columns}
                rows={listEventos}
                totalElements={dataEventos.total}
                totalPages={dataEventos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default Eventos