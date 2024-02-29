import { useEffect, useState, useRef } from "react"
import { servicios } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx"
import Table from "../../components/table/Table"
import Navbar from "../../components/navbar/Navbar"
import texts from "../../context/text_es.js";


function Servicios() {
  const [listServicios, setServicios] = useState([])
  const [dataServicios, setDataServicios] = useState({ pages: 0, total: 0 })
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getServicios()
      return
    }
  }, [])

  const getServicios = () => {
    getListItems({
      object: servicios,
      setList: setServicios,
      setData: setDataServicios,
      setLoading: setTableLoaing
    })
  }

  const columns = [
    {
      name: "Item",
      row: (row) => { return row.id }
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
        objet: servicios,
        functionGet: getServicios
      })
    },
    search: {
      placeholder: texts.registerMessage.searchItem,
      function: (value) => {
        searchCode({
          value: value,
          object: servicios,
          setList: setServicios
        })
      }
    },
    register: {
      name: texts.registerMessage.buttonRegisterServicio,
      function: () => {
        navigate("/register/servicio")
      }
    }
  }

  return (
    <Navbar name={`${texts.pages.getServicios.name}`} descripcion={`${texts.pages.getServicios.description}`}>
      <Table
        columns={columns}
        rows={listServicios}
        totalElements={dataServicios.total}
        totalPages={dataServicios.pages}
        options={options}
        loading={tableLoading}
      />
      <Toaster />
    </Navbar>
  )
}

export default Servicios