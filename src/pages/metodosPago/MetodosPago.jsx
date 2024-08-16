import { useEffect, useState, useRef } from "react"
import { Toaster } from "sonner";
import { metodoPago } from "../../utils/API.jsx";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx"
import { alertInfo } from "../../components/alerts.jsx"
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";

function MetodosPago() {
    const [listMetodos_Pagos, setMetodos_Pagos] = useState([])
    const [dataMetodos_Pagos, setDataMetodos_Pagos] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)

    const navigate = useNavigate()
    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getMetodos_Pagos()
            return
        }
    }, [])

    const getMetodos_Pagos = () => {
        getListItems({
            object: metodoPago,
            setList: setMetodos_Pagos,
            setData: setDataMetodos_Pagos,
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
                objet: metodoPago,
                functionGet: getMetodos_Pagos
            })
        },
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value) => {
                searchCode({
                    value: value,
                    object: metodoPago,
                    setList: setMetodos_Pagos,
                    setData: setDataMetodos_Pagos,
                    setLoading: setTableLoaing
                })
            }
        },
        put: (row)=>{
            navigate(`/edit/metodos_pago/${row.id}/`)
        },
        get:(row)=>{
            alertInfo(
              row.nombre, 
              {
                codigo:formatoId(row.id),
                descripcion:row.descripcion,
                referencia:row.referencia? '<span class="badge p-2 bg-success">Obligatorio</span>' : '<span class="badge p-2 bg-danger">Inecesario</span>',
                capture:row.capture? '<span class="badge p-2 bg-success">Obligatorio</span>' : '<span class="badge p-2 bg-danger">Inecesario</span>',
                divisa:row.divisa? '<span class="badge p-2 bg-success">Monto en Divisa</span>' : '<span class="badge p-2 bg-danger">Monto en Bs.S</span>',
                // referencia:`<img class="mx-auto mb-2" src="${row.referencia? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWEfdmNtLFFEcxz/j0I1CI4qiJK0IgiBIgrAyC4LAP0A8aze6gER0sfIhskCD0AohiB4shNAd2YfeegmiexF0oZdAi9UkU+stIchcJ8+sq7vrnJk5sz5IB/bp/H7f32d+v3P5nTWYZcOYZTz8J0BRdpCHALZiswycnxw/gR/AG2w6iPBatwLBM9TGfOZRg8FpoChgoDgGLeTTSgV/gvgEA7I4DDQBS4OIutjIrJ1BEPXz9wfqpAmbOj+hgPP1CK542aqBbAw6aQMOBgwW1OwmglMqYzWQxW2gJmgULTubBiJcdvNxB+qkFpsbWkF0jW32E6E92206UIwCEvQDC3VjaNoPYFJMJSPpftOBLBqAek3xsOYnENxSA8WYyxhD2CwOG2HSz6YLgyVph6ab5FcExWqgDirI40HOMPAFk7Lxs2sBCZ4Aqz00SxB8SM1nlsziLjiHYC6jG5NyKhl0RCw2A+89BBsRXFIBfQQ25UCTzEwKJspyDF4Baz00HyLYqwKSu2tlSKAwMGDziQgbVUC/nbq7jz5sqjCc+yhjIQK9mJRqZiYV5ReCAhXQMLDIheczsAvBd9opxOR5GlQvCcrYxzfHL8YqEjzzKdNUCJthIuSrgLqB9dOA5BaGciIMOXNJKNnrjLrAvNRoT2TJuoiwQQX02MmE28iGirGGEf5mZeYpsE5zDT5CsEcFdA045yEYx2bbZKZShsky6WVmKshVBBfcgaKUTmxTr4+MY7KTSue+S62ZsDAwxhaqeecOlOyB5OL02/rJhSyHyQutNZP5qT2IzDPK7XKVJZOl8xs9wByg0M9QOW9wnCqn75ocbu2HvH/6cuifg/INYlLk335IuShHMWgNqhzSrtqt6Ve3sFGaMTgfMpifm7LZ9351WNwBjvipa863IKhV+fg/gywax0/ki5pB3cxtoA7BdS8tfyDpbXFoYueFfSj2Y3CSKu77fVgwIKmSfEofw+Bs4HMn2cY2s4J77GbUD0bOBwdKqcnD02I7BgcwKEn7s0GWRP7ZMADOxRtF8DYIhPc5pKsww/b6GZphgGy5WQf0D2UywyWtV1X7AAAAAElFTkSuQmCC" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA6BJREFUWEfdmF+IVVUUxr91ZpQGSz17n0GwCQdCCISge3dGJMjQQxD00luEWWlgPVTaOFSkkgk2TiH0UA+aQaSPvYQvPqRPWtxzp3ooMEQwMf/MXqeYCf/EnbvkXOfGnZlzzt5n5iLSgfty7/et9btr77P2Oodwj110j/Hg/wEUh+EGBMELAJ4A0D/zSYs9IcA1AD/2iBytJMmZsivgXaGTg4P3LZ+c3CZEbwNY45VI5LwQHVwZhofWnjt3y8fjBVRT6lUKglGIRD5BMzTXQLTdWHvM5XcC1bUeFWDEFcjz912GeV+RNhdIAKpr/RWAzZ7JfGWfGea38sS5QLHWXwDY5pullI5or7F2T5YnEyhWageIPi2VpKSYgE1V5m/m2uYBxWG4AkFwCcCykjnKyi/3MQ+uA/7tNM4HiqIPIbLbEf1vACu7oHnDMKdb479rFtCvwNIbWl91JLuInp4hajSeS3tM5j4Q2S69vd9hevokgIcKwC8Y5sFcoFp//7PUbB4vCHA1IKpUrP0z1dS0HiFgdJaeaKex9pP0ux+UGugNgp+K+lczCB5bPzHxczvGrArVtD5CwCuOpZhV5ljrdwHsn/G8Z5g/bvtjrV8H8Lkj3j7DvCsTKI6iXyDyqGt3isiWx5PkSFtXV2qPAGKSZG9JmFR+wjA/kw2kdXp3rXYBARAR2doJ1elpHTVEX3rESSW/GeZ1eUDXAfR5BhIi2lS19mgGzGHAe7SZNMwr8oCmANzvC5RVpZnqlAGaMszL84B+B7DWA6ibS3bWMD+SCVTX+pQAG11Aczd1rFSrkS5wU39vmJ/OrpBSYyAavsu3/X7D/H4m0LhSTzaJThcAXQmIqu3GOKcH3bERDRtrWwfzeBStboqMA1iVG5OoaqxNNXfsncKZGegigAcLoC5MNxpDPUuWPA+RVkeee5Hv0SFy3iTJw53+rMN1GCJjjmX7C0DYBU3x4ZomOD0w0Lf05s0/FjE/u+6J9u9X+pjXOMePVB0rtRVEh3wjL0hH9GLW0J87wtaUOkBEOxeUzG3KHfYLnzriKDoMkS3u+P4KIjpYtXZHnsP5GBRr/RGAD/xT5ioFRCPtWWnBQKmxrvXLQjS2iI1+iYA3q8zfuv6Ys0LtAOmj9ANTU68BeMf7URo4KyIH/kmSr4eAhgtmXmP0MbSaZxg+BaKXQFTpeNkg6csGAJeJ6AwBxyrWxj4xCxtj2QDd1nsvWbcTL2pT3y2YNM9t83daNDUK9xcAAAAASUVORK5CYII="}"`,
                // capture:`<img class="mx-auto mb-2" src="${row.capture? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWEfdmNtLFFEcxz/j0I1CI4qiJK0IgiBIgrAyC4LAP0A8aze6gER0sfIhskCD0AohiB4shNAd2YfeegmiexF0oZdAi9UkU+stIchcJ8+sq7vrnJk5sz5IB/bp/H7f32d+v3P5nTWYZcOYZTz8J0BRdpCHALZiswycnxw/gR/AG2w6iPBatwLBM9TGfOZRg8FpoChgoDgGLeTTSgV/gvgEA7I4DDQBS4OIutjIrJ1BEPXz9wfqpAmbOj+hgPP1CK542aqBbAw6aQMOBgwW1OwmglMqYzWQxW2gJmgULTubBiJcdvNxB+qkFpsbWkF0jW32E6E92206UIwCEvQDC3VjaNoPYFJMJSPpftOBLBqAek3xsOYnENxSA8WYyxhD2CwOG2HSz6YLgyVph6ab5FcExWqgDirI40HOMPAFk7Lxs2sBCZ4Aqz00SxB8SM1nlsziLjiHYC6jG5NyKhl0RCw2A+89BBsRXFIBfQQ25UCTzEwKJspyDF4Baz00HyLYqwKSu2tlSKAwMGDziQgbVUC/nbq7jz5sqjCc+yhjIQK9mJRqZiYV5ReCAhXQMLDIheczsAvBd9opxOR5GlQvCcrYxzfHL8YqEjzzKdNUCJthIuSrgLqB9dOA5BaGciIMOXNJKNnrjLrAvNRoT2TJuoiwQQX02MmE28iGirGGEf5mZeYpsE5zDT5CsEcFdA045yEYx2bbZKZShsky6WVmKshVBBfcgaKUTmxTr4+MY7KTSue+S62ZsDAwxhaqeecOlOyB5OL02/rJhSyHyQutNZP5qT2IzDPK7XKVJZOl8xs9wByg0M9QOW9wnCqn75ocbu2HvH/6cuifg/INYlLk335IuShHMWgNqhzSrtqt6Ve3sFGaMTgfMpifm7LZ9351WNwBjvipa863IKhV+fg/gywax0/ki5pB3cxtoA7BdS8tfyDpbXFoYueFfSj2Y3CSKu77fVgwIKmSfEofw+Bs4HMn2cY2s4J77GbUD0bOBwdKqcnD02I7BgcwKEn7s0GWRP7ZMADOxRtF8DYIhPc5pKsww/b6GZphgGy5WQf0D2UywyWtV1X7AAAAAElFTkSuQmCC" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA6BJREFUWEfdmF+IVVUUxr91ZpQGSz17n0GwCQdCCISge3dGJMjQQxD00luEWWlgPVTaOFSkkgk2TiH0UA+aQaSPvYQvPqRPWtxzp3ooMEQwMf/MXqeYCf/EnbvkXOfGnZlzzt5n5iLSgfty7/et9btr77P2Oodwj110j/Hg/wEUh+EGBMELAJ4A0D/zSYs9IcA1AD/2iBytJMmZsivgXaGTg4P3LZ+c3CZEbwNY45VI5LwQHVwZhofWnjt3y8fjBVRT6lUKglGIRD5BMzTXQLTdWHvM5XcC1bUeFWDEFcjz912GeV+RNhdIAKpr/RWAzZ7JfGWfGea38sS5QLHWXwDY5pullI5or7F2T5YnEyhWageIPi2VpKSYgE1V5m/m2uYBxWG4AkFwCcCykjnKyi/3MQ+uA/7tNM4HiqIPIbLbEf1vACu7oHnDMKdb479rFtCvwNIbWl91JLuInp4hajSeS3tM5j4Q2S69vd9hevokgIcKwC8Y5sFcoFp//7PUbB4vCHA1IKpUrP0z1dS0HiFgdJaeaKex9pP0ux+UGugNgp+K+lczCB5bPzHxczvGrArVtD5CwCuOpZhV5ljrdwHsn/G8Z5g/bvtjrV8H8Lkj3j7DvCsTKI6iXyDyqGt3isiWx5PkSFtXV2qPAGKSZG9JmFR+wjA/kw2kdXp3rXYBARAR2doJ1elpHTVEX3rESSW/GeZ1eUDXAfR5BhIi2lS19mgGzGHAe7SZNMwr8oCmANzvC5RVpZnqlAGaMszL84B+B7DWA6ibS3bWMD+SCVTX+pQAG11Aczd1rFSrkS5wU39vmJ/OrpBSYyAavsu3/X7D/H4m0LhSTzaJThcAXQmIqu3GOKcH3bERDRtrWwfzeBStboqMA1iVG5OoaqxNNXfsncKZGegigAcLoC5MNxpDPUuWPA+RVkeee5Hv0SFy3iTJw53+rMN1GCJjjmX7C0DYBU3x4ZomOD0w0Lf05s0/FjE/u+6J9u9X+pjXOMePVB0rtRVEh3wjL0hH9GLW0J87wtaUOkBEOxeUzG3KHfYLnzriKDoMkS3u+P4KIjpYtXZHnsP5GBRr/RGAD/xT5ioFRCPtWWnBQKmxrvXLQjS2iI1+iYA3q8zfuv6Ys0LtAOmj9ANTU68BeMf7URo4KyIH/kmSr4eAhgtmXmP0MbSaZxg+BaKXQFTpeNkg6csGAJeJ6AwBxyrWxj4xCxtj2QDd1nsvWbcTL2pT3y2YNM9t83daNDUK9xcAAAAASUVORK5CYII="}"`,
                // divisa:`<img class="mx-auto mb-2" src="${row.divisa? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWEfdmNtLFFEcxz/j0I1CI4qiJK0IgiBIgrAyC4LAP0A8aze6gER0sfIhskCD0AohiB4shNAd2YfeegmiexF0oZdAi9UkU+stIchcJ8+sq7vrnJk5sz5IB/bp/H7f32d+v3P5nTWYZcOYZTz8J0BRdpCHALZiswycnxw/gR/AG2w6iPBatwLBM9TGfOZRg8FpoChgoDgGLeTTSgV/gvgEA7I4DDQBS4OIutjIrJ1BEPXz9wfqpAmbOj+hgPP1CK542aqBbAw6aQMOBgwW1OwmglMqYzWQxW2gJmgULTubBiJcdvNxB+qkFpsbWkF0jW32E6E92206UIwCEvQDC3VjaNoPYFJMJSPpftOBLBqAek3xsOYnENxSA8WYyxhD2CwOG2HSz6YLgyVph6ab5FcExWqgDirI40HOMPAFk7Lxs2sBCZ4Aqz00SxB8SM1nlsziLjiHYC6jG5NyKhl0RCw2A+89BBsRXFIBfQQ25UCTzEwKJspyDF4Baz00HyLYqwKSu2tlSKAwMGDziQgbVUC/nbq7jz5sqjCc+yhjIQK9mJRqZiYV5ReCAhXQMLDIheczsAvBd9opxOR5GlQvCcrYxzfHL8YqEjzzKdNUCJthIuSrgLqB9dOA5BaGciIMOXNJKNnrjLrAvNRoT2TJuoiwQQX02MmE28iGirGGEf5mZeYpsE5zDT5CsEcFdA045yEYx2bbZKZShsky6WVmKshVBBfcgaKUTmxTr4+MY7KTSue+S62ZsDAwxhaqeecOlOyB5OL02/rJhSyHyQutNZP5qT2IzDPK7XKVJZOl8xs9wByg0M9QOW9wnCqn75ocbu2HvH/6cuifg/INYlLk335IuShHMWgNqhzSrtqt6Ve3sFGaMTgfMpifm7LZ9351WNwBjvipa863IKhV+fg/gywax0/ki5pB3cxtoA7BdS8tfyDpbXFoYueFfSj2Y3CSKu77fVgwIKmSfEofw+Bs4HMn2cY2s4J77GbUD0bOBwdKqcnD02I7BgcwKEn7s0GWRP7ZMADOxRtF8DYIhPc5pKsww/b6GZphgGy5WQf0D2UywyWtV1X7AAAAAElFTkSuQmCC" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA6BJREFUWEfdmF+IVVUUxr91ZpQGSz17n0GwCQdCCISge3dGJMjQQxD00luEWWlgPVTaOFSkkgk2TiH0UA+aQaSPvYQvPqRPWtxzp3ooMEQwMf/MXqeYCf/EnbvkXOfGnZlzzt5n5iLSgfty7/et9btr77P2Oodwj110j/Hg/wEUh+EGBMELAJ4A0D/zSYs9IcA1AD/2iBytJMmZsivgXaGTg4P3LZ+c3CZEbwNY45VI5LwQHVwZhofWnjt3y8fjBVRT6lUKglGIRD5BMzTXQLTdWHvM5XcC1bUeFWDEFcjz912GeV+RNhdIAKpr/RWAzZ7JfGWfGea38sS5QLHWXwDY5pullI5or7F2T5YnEyhWageIPi2VpKSYgE1V5m/m2uYBxWG4AkFwCcCykjnKyi/3MQ+uA/7tNM4HiqIPIbLbEf1vACu7oHnDMKdb479rFtCvwNIbWl91JLuInp4hajSeS3tM5j4Q2S69vd9hevokgIcKwC8Y5sFcoFp//7PUbB4vCHA1IKpUrP0z1dS0HiFgdJaeaKex9pP0ux+UGugNgp+K+lczCB5bPzHxczvGrArVtD5CwCuOpZhV5ljrdwHsn/G8Z5g/bvtjrV8H8Lkj3j7DvCsTKI6iXyDyqGt3isiWx5PkSFtXV2qPAGKSZG9JmFR+wjA/kw2kdXp3rXYBARAR2doJ1elpHTVEX3rESSW/GeZ1eUDXAfR5BhIi2lS19mgGzGHAe7SZNMwr8oCmANzvC5RVpZnqlAGaMszL84B+B7DWA6ibS3bWMD+SCVTX+pQAG11Aczd1rFSrkS5wU39vmJ/OrpBSYyAavsu3/X7D/H4m0LhSTzaJThcAXQmIqu3GOKcH3bERDRtrWwfzeBStboqMA1iVG5OoaqxNNXfsncKZGegigAcLoC5MNxpDPUuWPA+RVkeee5Hv0SFy3iTJw53+rMN1GCJjjmX7C0DYBU3x4ZomOD0w0Lf05s0/FjE/u+6J9u9X+pjXOMePVB0rtRVEh3wjL0hH9GLW0J87wtaUOkBEOxeUzG3KHfYLnzriKDoMkS3u+P4KIjpYtXZHnsP5GBRr/RGAD/xT5ioFRCPtWWnBQKmxrvXLQjS2iI1+iYA3q8zfuv6Ys0LtAOmj9ANTU68BeMf7URo4KyIH/kmSr4eAhgtmXmP0MbSaZxg+BaKXQFTpeNkg6csGAJeJ6AwBxyrWxj4xCxtj2QDd1nsvWbcTL2pT3y2YNM9t83daNDUK9xcAAAAASUVORK5CYII="}"`,
               
                // fecha_de_registro:formatDateWithTime12Hour(row.fecha_registro),
                // fecha_de_actualizacion:formatDateWithTime12Hour(row.fecha_actualizacion),
              }
            )
        },
        register: {
            name: texts.registerMessage.buttonRegisterMetodoPago,
            function: () => {
                navigate("/register/metodos_pago/")
            }
        }
    }

    return (
        <Navbar name={`${texts.pages.getMetodosPago.name}`} descripcion={`${texts.pages.getMetodosPago.description}`}>

            <Table
                columns={columns}
                rows={listMetodos_Pagos}
                totalElements={dataMetodos_Pagos.total}
                totalPages={dataMetodos_Pagos.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}

export default MetodosPago