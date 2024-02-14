import { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar"
import Table from "../../components/table/Table"
import { actividades } from "../../js/API.js"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Actividades() {
  const [listActividades, setActividades] = useState([])
  const [dataActividades, setDataActividades] = useState({ pages: 0, total: 0 })
  const { deleteItem, searchCode, getData } = useContext(AuthContext)
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getActividades()
      return
    }
  }, [])
  const getActividades = () => {
    getData({
        object:actividades,
        setList: setActividades,
        setData: setDataActividades,
        setLoading:setTableLoaing
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
        objet: actividades,
        functionGet: "dffd"
      })
    },
    search: {
      placeholder: "Buscar por su Item",
      function: (value) => {
        searchCode({
          value: value,
          object: actividades,
          setList: setActividades
        })
      }
    },
    register: {
      name: "Agregar una nueva actividad",
      function: () => {
        navigate("/register/actividad")
      }
    }
  }
  return (
    <Navbar name="Lista de Actividades" descripcion="Verifique los Actividades agregados">

      <Table
        columns={columns}
        rows={listActividades}
        totalElements={dataActividades.total}
        totalPages={dataActividades.pages}
        options={options}
        loading={tableLoading}
      />
      <Toaster />
    </Navbar>
  )
}

export default Actividades