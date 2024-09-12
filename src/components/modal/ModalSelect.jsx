import { useState, useRef, useEffect } from 'react'
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { ButtonSimple } from "../button/Button.jsx"
import { totalItems } from "../table/Table.jsx"
import { LoaderCircle } from "../loader/Loader.jsx"
import { useForm } from "react-hook-form"
import "./modal.css"
import "../table/table.css"
import ErrorSystem from "../errores/ErrorSystem.jsx"
import ModalBase from "./ModalBase.jsx"

function ModalSelect({ titulo, columns, object, saveSelect, state, select }) {
    const [listOptions, setListOptions] = useState([])
    const [estado, setEstado] = state
    const [dataTable, setDataTable] = useState({ pages: 0, total: 0 });
    const [dataList, setDataList] = useState([])
    const [page, setPages] = useState(1);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [debounceTimeoutPage, setDebounceTimeoutPage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const renderizadoTable = useRef(0);
    const renderizado = useRef(0);
    const [errorServer, setErrorServer] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getListItems({
                object: object,
                setList: setDataList,
                setData: setDataTable,
                setLoading: setLoading
            })
        }
    }, [])

    useEffect(() => {
        // Para evitar el sobre renderizado al cargar el componente
        if (renderizadoTable.current === 0 || renderizadoTable.current === 1) {
            renderizadoTable.current = renderizadoTable.current + 1
            return
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            searchFuntion(searchTerm)
        }, 900);

        setDebounceTimeout(timeout);
    }, [searchTerm])

    const searchFuntion = (search, filtros = {}) => {
        searchCode({
            object: object,
            setLoading: setLoading,
            setData: setDataTable,
            value: search,
            setList: setDataList,
            filtros: filtros
        })
    }

    const paginar = (pagina) => {
        const filtro = { page: pagina, }
        searchFuntion(searchTerm, filtro)
    };

    const selectOptions = (e) => {
        const ID = e.target.dataset.option ? Number(e.target.dataset.option) : Number(e.target.parentNode.dataset.option)
        const newOptions = [...listOptions]
        if (newOptions.includes(ID)) {
            const index = newOptions.indexOf(ID);
            newOptions.splice(index, 1)
        } else {
            newOptions.push(ID);
        }
        setListOptions(newOptions)
    }

    const AgregarOptions = () => {
        saveSelect(select.concat(listOptions))
        setListOptions([])
        setEstado(false)
    }

    // *the useform
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            "page": 1
        }
    });

    return (
        <ModalBase titulo={titulo} state={[estado, setEstado]} optionsSucces={["Agregar", AgregarOptions]} opcionsDelete={["Cerrar", () => { setListOptions([]) }]} disabledTrue={Boolean(listOptions.length) ? false : true}>
            <>
                <div className='me-auto d-flex align-items-center w-100 w-md-50 mt-3 mt-md-0 mb-3'>
                    <ButtonSimple
                        type="button"
                        onClick={(e) => {
                            searchFuntion(searchTerm)
                        }}
                    >
                        Buscar
                    </ ButtonSimple>
                    <input id="table-search"
                        className='ms-2 input-table'
                        onKeyUp={(e) => {
                            setSearchTerm(e.target.value)
                        }}
                        placeholder={`Buscar`} type="text" />
                </div>
                {
                    loading ?
                        (
                            <div className="div-main justify-content-center p-4">
                                <LoaderCircle />
                            </div>
                        )
                        :
                        errorServer ?
                            (
                                <div className="div-main justify-content-center p-4">
                                    <ErrorSystem error={errorServer} />
                                </div>
                            )
                            :
                            (

                                <>
                                    <div className='container-table'>
                                        <table className='table-data border-table border-none'>
                                            <thead className='table-modal'>
                                                <tr>
                                                    <th scope="col">N°</th>
                                                    {
                                                        columns.map((column, index) => (
                                                            <th key={`${index}-${column.name}`} scope="col">{column.name}</th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody className='table-modal'>
                                                {
                                                    dataList.length === 0 ?
                                                        <>
                                                            <tr>
                                                                <td className="py-3"></td>
                                                                {

                                                                    columns.map((column, index) => {
                                                                        return (<td key={`${column.name}-${index}-1`} className="py-3"></td>)
                                                                    })
                                                                }
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3"></td>
                                                                {

                                                                    columns.map((column, index) => {
                                                                        return (<td key={`${column.name}-${index}-2`} className="py-3"></td>)
                                                                    })
                                                                }
                                                            </tr>
                                                            <tr>
                                                                <td className="py-3"></td>
                                                                {

                                                                    columns.map((column, index) => {
                                                                        return (<td key={`${column.name}-${index}-3`} className="py-3"></td>)
                                                                    })
                                                                }
                                                            </tr>
                                                        </>
                                                        :
                                                        dataList.map((row, index) => (
                                                            <tr key={`row-${index}`} className={`${listOptions.includes(row.id) ? "tr-select" : ""}`} data-option={row.id} onClick={(e) => { selectOptions(e) }}>
                                                                <td key={`N°-${index}`}>{index + 1}</td>
                                                                {

                                                                    columns.map((column, index) => {
                                                                        if (column.row(row) === true) {
                                                                            return (<td key={`${column.row(row)}-${index}`} className='svg-check'><IconCheck /></td>)
                                                                        }
                                                                        if (column.row(row) === false) {
                                                                            return (<td key={`${column.row(row)}-${index}`} className='svg-x'><IconX /></td>)
                                                                        }
                                                                        return (<td key={`${column.row(row)}-${index}`} >{column.row(row)}</td>)

                                                                    })
                                                                }
                                                            </tr>
                                                        ))
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                    <div className='d-flex flex-column flex-sm-row justify-content-between align-items-center w-100 mt-3'>
                                        <p className='m-0 mb-3 mb-sm-0 fw-bold fs-6'>{`Mostrando ${totalItems(page, dataList.length)} de ${dataTable.total}`}</p>
                                        <div className='d-flex justify-content-between align-items-center '>
                                            <ButtonSimple
                                                type="button"
                                                className="none-border-radius"
                                                disabled={page === 1 ? true : false}
                                                onClick={(e) => {
                                                    const pagina = page - 1;
                                                    setValue("page", pagina)
                                                    setPages(pagina);
                                                    paginar(pagina)
                                                }}
                                            >
                                                Anterior
                                            </ ButtonSimple>
                                            {/* <input className='mx-2 input-table page' max={dataTable.pages} min={1} type="number" defaultValue={page} /> */}
                                            <input
                                                className="mx-2 input-table page"
                                                type="number"
                                                {...register("page", {
                                                    onChange: (e) => {
                                                        if (debounceTimeoutPage) {
                                                            clearTimeout(debounceTimeoutPage);
                                                        }
                                                        const timeout = setTimeout(() => {
                                                            const value = Number(e.target.value)
                                                            if (value < 0) {
                                                                setValue("page", 1)
                                                                setPages(1);
                                                                paginar(1)
                                                            } else if (value >= totalPages) {
                                                                setValue("page", totalPages)
                                                                setPages(totalPages);
                                                                paginar(totalPages)
                                                            } else {
                                                                setValue("page", value)
                                                                setPages(value);
                                                                paginar(value)
                                                            }
                                                            setTimeout(() => {
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }, 100);
                                                        }, 800);
                                                        setDebounceTimeoutPage(timeout);
                                                    },
                                                    min: { value: 1 },
                                                    max: { value: dataTable.pages }
                                                })}
                                            />

                                            <ButtonSimple
                                                type="button"
                                                className="none-border-radius"
                                                disabled={dataTable.pages === page || dataTable.pages === 0 ? true : false}
                                                onClick={(e) => {
                                                    const pagina = page + 1;
                                                    setValue("page", pagina)
                                                    setPages(pagina);
                                                    paginar(pagina)
                                                    search.function(document.getElementById("table-search").value)
                                                }}
                                            >
                                                Siguiente
                                            </ ButtonSimple>
                                        </div>
                                    </div>
                                </>
                            )
                }
            </>
        </ModalBase>
    )

}

export default ModalSelect