import { useEffect, useState, useRef } from "react"
import { niveles } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx"
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Niveles() {
  const [listNiveles, setNiveles] = useState([])
  const [dataNiveles, setDataNiveles] = useState({ pages: 0, total: 0 })
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "Niveles - Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getNiveles()
      return
    }
  }, [])

  const getNiveles = () => {
    getListItems({
      object: niveles,
      setList: setNiveles,
      setData: setDataNiveles,
      setLoading: setTableLoaing
    })
  }

  const columns = [
    {
      name: "Código",
      row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
    },
    {
      name: "Nombre",
      row: (row) => { return row.nombre }
    },
    {
      name: "Descripción",
      row: (row) => { return row.descripcion }
    },
    {
      name: "Opciones",
      row: (row) => {
        return <div className='d-flex justify-content-around options-table'>
          <IconDetail
            onClick={() => {
              alertInfo(
                row.nombre,
                {
                  codigo: formatoId(row.id),
                  descripción: row.descripcion,
                  fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
                  ultima_modificación: formatDateWithTime12Hour(row.fecha_actualizacion),
                }
              )
            }}
            className="cursor-pointer"
            data-bs-toggle="tooltip" data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
            data-bs-title={texts.tootlip.nivel}
            data-bs-trigger="hover"
          />
          <IconTrash
            onClick={() => {
              deleteItem({
                row: row,
                objet: niveles,
                functionGet: getNiveles
              })
            }}
            className="cursor-pointer"
            data-bs-toggle="tooltip" data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
            data-bs-title={texts.tootlip.eliminar}
            data-bs-trigger="hover"
          />
          <IconEdit
            onClick={() => { navigate(`/edit/nivel/${row.id}/`) }}
            className="cursor-pointer"
            data-bs-toggle="tooltip" data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
            data-bs-title={texts.tootlip.editar}
            data-bs-trigger="hover"
          />
        </div>
      }
    },
  ]
  const options = {
    delete: (row) => {
      deleteItem({
        row: row,
        objet: niveles,
        functionGet: getNiveles
      })
    },
    put: (row) => {
      navigate(`/edit/nivel/${row.id}/`)
    },
    get: (row) => {
      alertInfo(
        row.nombre,
        {
          codigo: formatoId(row.id),
          descripción: row.descripcion,
          fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
          fecha_de_actualización: formatDateWithTime12Hour(row.fecha_actualizacion),
        }
      )
    },
    search: {
      placeholder: texts.registerMessage.searchItem,
      function: (value, filtros = {}) => {
        searchCode({
          value: value,
          filtros: filtros,
          object: niveles,
          setList: setNiveles,
          setData: setDataNiveles,
          setLoading: setTableLoaing
        })
      }
    },
    register: {
      name: texts.registerMessage.buttonRegisterNivel,
      function: () => {
        navigate("/register/nivel/")
      }
    }
  }
  return (
    <Navbar name={`${texts.pages.getNiveles.name}`} descripcion={`${texts.pages.getNiveles.description}`} dollar={false}>

      <Table
        columns={columns}
        rows={listNiveles}
        totalElements={dataNiveles.total}
        totalPages={dataNiveles.pages}
        options={options}
        loading={tableLoading}
        order={true}
        organizar={[
          { label: "Codigo", value: "orig" },
          { label: "Nombre", value: "alf" },
        ]}
      />
      <Toaster />
    </Navbar>
  )
}

export default Niveles