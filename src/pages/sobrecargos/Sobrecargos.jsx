import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form";
import { sobrecargos } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx"
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId, normalizeDecimalNumber, formatDateWithTime12Hour } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Niveles() {
  const [listSobrecargo, setSobrecargo] = useState([])
  const [dataSobrecargos, setDataSobrecargos] = useState({ pages: 0, total: 0 })
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getSobrecargos()
      return
    }
  }, [])

  const getSobrecargos = () => {
    getListItems({
      object: sobrecargos,
      setList: setSobrecargo,
      setData: setDataSobrecargos,
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
      name: "Monto Ref",
      row: (row) => { return `${normalizeDecimalNumber(row.monto)} $` }
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
                  código: formatoId(row.id),
                  descripción: row.descripcion,
                  monto: `${normalizeDecimalNumber(row.monto)} $`,
                  fecha_de_registro: formatDateWithTime12Hour(row.fecha_registro),
                  ultima_modificación: formatDateWithTime12Hour(row.fecha_actualizacion),
                }
              )
            }} className="cursor-pointer"
          />
          <IconTrash
            onClick={() => {
              deleteItem({
                row: row,
                objet: sobrecargos,
                functionGet: getSobrecargos
              })
            }}
            className="cursor-pointer"
          />
          <IconEdit onClick={() => { navigate(`/edit/sobrecargo/${row.id}/`) }} className="cursor-pointer" />
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
          object: sobrecargos,
          setList: setSobrecargo,
          setData: setDataSobrecargos,
          setLoading: setTableLoaing
        })
      }
    },
    register: {
      name: texts.registerMessage.buttonRegisterSobrecargo,
      function: () => {
        navigate("/register/sobrecargo/")
      }
    }
  }
  return (
    <Navbar name={`${texts.pages.getSobrecargos.name}`} descripcion={`${texts.pages.getSobrecargos.description}`}>

      <Table
        columns={columns}
        rows={listSobrecargo}
        totalElements={dataSobrecargos.total}
        totalPages={dataSobrecargos.pages}
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