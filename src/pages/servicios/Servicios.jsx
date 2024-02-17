import { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import { servicios } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Servicios() {
  const [listServicios, setServicios] = useState([])
  const [dataServicios, setDataServicios] = useState({ pages: 0, total: 0 })
  const { deleteItem, searchCode, getData } = useContext(AuthContext)
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
    getData({
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
      placeholder: "Buscar por su Item",
      function: (value) => {
        searchCode({
          value: value,
          object: servicios,
          setList: setServicios
        })
      }
    },
    register: {
      name: "Agregar un nuevo cargo",
      function: () => {
        navigate("/register/servicio")
      }
    }
  }
  return (
    <Navbar name="Lista de Servicios" descripcion="Verifique los servicios agregados">
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