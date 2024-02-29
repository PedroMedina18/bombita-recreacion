import { useEffect, useState, useRef } from "react"
import { niveles } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import {deleteItem, searchCode, getListItems} from "../../utils/actions.jsx"
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
        objet: niveles,
        functionGet: getNiveles
      })
    },
    search: {
      placeholder: texts.registerMessage.searchItem,
      function: (value) => {
        searchCode({
          value: value,
          object: niveles,
          setList: setNiveles
        })
      }
    },
    register: {
      name: texts.registerMessage.buttonRegisterNivel,
      function: () => {
        navigate("/register/nivel")
      }
    }
  }
  return (
    <Navbar name={`${texts.pages.getNiveles.name}`} descripcion={`${texts.pages.getNiveles.description}`}>

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