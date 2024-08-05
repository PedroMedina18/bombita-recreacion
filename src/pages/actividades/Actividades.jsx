import { useEffect, useState, useRef } from "react";
import { actividades } from "../../utils/API.jsx";
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId } from "../../utils/process.jsx";
import { alertInfo } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Actividades() {
  const [listActividades, setActividades] = useState([])
  const [dataActividades, setDataActividades] = useState({ pages: 0, total: 0 })
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
    getListItems({
      object: actividades,
      setList: setActividades,
      setData: setDataActividades,
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
  ]

  const options = {
    delete: (row) => {
      deleteItem({
        row: row,
        objet: actividades,
        functionGet: getActividades
      })
    },
    search: {
      placeholder: texts.registerMessage.searchItem,
      function: (value) => {
        searchCode({
          value: value,
          object: actividades,
          setList: setActividades,
          setData: setDataActividades,
          setLoading: setTableLoaing,
        })
      }
    },
    put: (row)=>{
      navigate(`/edit/actividad/${row.id}/`)
    },
    get:(row)=>{
      alertInfo(
        row.nombre, 
        row
      )
    },
    register: {
      name: texts.registerMessage.buttonRegisterActividad,
      function: () => {
        navigate("/register/actividad/")
      }
    }
  }

  return (
    <Navbar name = {texts.pages.getActividades.name} descripcion = {texts.pages.getActividades.description}>

      <Table
        columns = {columns}
        rows = {listActividades}
        totalElements = {dataActividades.total}
        totalPages = {dataActividades.pages}
        options = {options}
        loading = {tableLoading}
      />
      <Toaster />
    </Navbar>
  )
}

export default Actividades