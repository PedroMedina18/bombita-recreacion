import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form";
import { sobrecargos } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx"
import { formatoId, normalizeDecimalNumber } from "../../utils/process.jsx"
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
    {
        name: "Monto",
        row: (row) => { return `${normalizeDecimalNumber(row.monto)} $` }
    },
  ]
  const options = {
    delete: (row) => {
      deleteItem({
        row: row,
        objet: sobrecargos,
        functionGet: getSobrecargos
      })
    },
    put: (row)=>{
            navigate(`/edit/sobrecargo/${row.id}/`)
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
      />
      <Toaster />
    </Navbar>
  )
}

export default Niveles