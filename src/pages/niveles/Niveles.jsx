import { useEffect, useState, useContext, useRef } from "react"
import Navbar from "../../components/navbar/Navbar"
import { AuthContext } from '../../context/AuthContext';
import Table from "../../components/table/Table"
import { niveles } from "../../js/API"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';

function Niveles() {
  const [listNiveles, setNiveles] = useState([])
  const [dataNiveles, setDataNiveles] = useState({ pages: 0, total: 0 })
  const { deleteItem, searchCode, getData } = useContext(AuthContext)
  const [tableLoading, setTableLoaing] = useState(true)
  const renderizado = useRef(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1
      getNiveles()
      return
    }
  }, [])

  const getNiveles = () => {
    getData({
      object: niveles,
      setList: setNiveles,
      setData: setDataNiveles,
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
        objet: Niveles,
        functionGet: getNiveles()
      })
    },
    search: {
      placeholder: "Buscar por su Item",
      function: (value) => {
        searchCode({
          value: value,
          object: niveles,
          setList: setNiveles
        })
      }
    },
    register: {
      name: "Agregar un Nuevo Nivel",
      function: () => {
        navigate("/register/nivel")
      }
    }
  }
  return (
    <Navbar name="Lista de Niveles" descripcion="Verifique los Niveles de recreador agregados">

      <Table
        columns={columns}
        rows={listNiveles}
        totalElements={dataNiveles.total}
        totalPages={dataNiveles.pages}
        options={options}
        loading={tableLoading}
      />
      <Toaster />
    </Navbar>
  )
}

export default Niveles