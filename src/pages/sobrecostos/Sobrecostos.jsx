import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form";
import { sobrecostos } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx"
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId, normalizeDecimalNumber, formatDateWithTime12Hour } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import texts from "../../context/text_es.js";

function Sobrecostos() {
  const [listSobrecosto, setSobrecosto] = useState([])
  const [dataSobrecostos, setDataSobrecostos] = useState({ pages: 0, total: 0 })
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getSobrecostos()
      return
    }
  }, [])

  const getSobrecostos = () => {
    getListItems({
      object: sobrecostos,
      setList: setSobrecosto,
      setData: setDataSobrecostos,
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
                objet: sobrecostos,
                functionGet: getSobrecostos
              })
            }}
            className="cursor-pointer"
          />
          <IconEdit onClick={() => { navigate(`/edit/sobrecosto/${row.id}/`) }} className="cursor-pointer" />
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
          object: sobrecostos,
          setList: setSobrecosto,
          setData: setDataSobrecostos,
          setLoading: setTableLoaing
        })
      }
    },
    register: {
      name: texts.registerMessage.buttonRegisterSobrecosto,
      function: () => {
        navigate("/register/sobrecosto/")
      }
    }
  }
  return (
    <Navbar name={`${texts.pages.getSobrecostos.name}`} descripcion={`${texts.pages.getSobrecostos.description}`}>

      <Table
        columns={columns}
        rows={listSobrecosto}
        totalElements={dataSobrecostos.total}
        totalPages={dataSobrecostos.pages}
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

export default Sobrecostos