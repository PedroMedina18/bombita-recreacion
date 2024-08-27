import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { dolar } from "../../utils/API.jsx";
import { getListItems, searchCode } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";

function Dolar() {
    const [listDolar, setDolar] = useState([])
    const [dataDolar, setDataDolar] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getDolar()
            return
        }
    }, [])

    const getDolar = () => {
        getListItems({
            object: dolar,
            setList: setDolar,
            setData: setDataDolar,
            setLoading: setTableLoaing,
        })
    }

    const columns = [
        {
            name: "Codigo",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo}
        },
        {
            name: "Precio",
            row: (row) => { return `${row.precio} Bs.S` }
        },
        {
            name: "Fecha",
            row: (row) => { const fecha = formatDateWithTime12Hour(row.fecha_registro); return fecha }
        },
    ]

    const options = {
        consult: (value, filtros={}) => {
            searchCode({
                value: value,
                filtros:filtros,
                object: dolar,
                setList: setDolar,
                setData: setDataDolar,
                setLoading: setTableLoaing
            })
        }
    }
    return (
        <Navbar name={`${texts.pages.getDolar.name}`} descripcion={`${texts.pages.getDolar.description}`}>

            <Table
                columns={columns}
                rows={listDolar}
                totalElements={dataDolar.total}
                totalPages={dataDolar.pages}
                options={options}
                loading={tableLoading}
                order={true}
                organizar={[
                    { label: "Fecha", value: "fech" },
                    { label: "Precio", value: "price" },
                ]}
            />
            <Toaster />
        </Navbar>
    )
}

export default Dolar