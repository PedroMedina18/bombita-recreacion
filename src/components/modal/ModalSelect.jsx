import { useState, useRef, useEffect } from 'react'
import React from 'react'
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { IconX, IconHamburgue } from "../Icon"
import { ButtonSimple } from "../button/Button.jsx"
import { totalItems } from "../table/Table.jsx"
import { LoaderCircle } from "../loader/Loader.jsx"
import texts from "../../context/text_es.js";
import "./modal.css"
import "../table/table.css"
import ErrorSystem from "../errores/ErrorSystem.jsx"
function ModalSelect({ titulo, columns, object, saveSelect, estado, setEstado, select }) {
    const [listOptions, setListOptions] = useState([])
    const [dataTable, setDataTable] = useState({ pages: 0, total: 0 });
    const [dataList, setDataList] = useState([])
    const [pages, setPages] = useState(1);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const renderizadoTable = useRef(0);
    const renderizado = useRef(0);
    const [errorServer, setErrorServer] = useState("");
    const [loading, setLoading] = useState(true);
    const [animateState, setAnimateState] = useState("")
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
            searFuntion(searchTerm)
        }, 900);

        setDebounceTimeout(timeout);
    }, [searchTerm])
    useEffect(() => {
        // Para evitar el sobre renderizado al cargar el componente
        if (renderizado.current === 1 || renderizado.current === 2 || renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            return
        }
        if(estado){
            setAnimateState("in:wipe:right")
        }else{
            setAnimateState("out:wipe:left")
        }
    }, [estado])

    const searFuntion = (search) => {
        searchCode({
            object: object,
            setLoading: setLoading,
            setData: setDataTable,
            value: search,
            setList: setDataList,
        })
    }

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

        saveSelect(select.concat(listOptions) )
        setListOptions([])
        setEstado(false)
    }
    
    return (
        <>
            <div className={`overlay`} transition-style={animateState}
                onClick={(e) => {
                    if (e.target.className === "overlay") {
                        setEstado(false)
                        setListOptions([])
                    }
                }}>
                <div className='content-modal'>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                        <div className='icon-menu'>
                            <IconHamburgue />
                        </div>
                        <h3 className='h3 m-0 fw-bold'>{titulo}</h3>
                        <button className='button-close' onClick={() => { setEstado(false); setListOptions([]) }}>
                            <IconX />
                        </button>
                    </div>
                    <div className='body-modal'>
                        <div className='me-auto d-flex align-items-center w-100 w-md-50 mt-3 mt-md-0 mb-3'>
                            <ButtonSimple
                                type="button"
                                onClick={(e) => {
                                    searFuntion(searchTerm)
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
                                            <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100 mt-3'>
                                                <p className='m-0 mb-3 mb-sm-0 fw-bold fs-6'>{`Mostrando ${totalItems(pages, dataList.length)} de ${dataTable.total}`}</p>
                                                <div className='d-flex justify-content-between align-items-center '>
                                                    <ButtonSimple
                                                        type="button"
                                                        className="none-border-radius"
                                                        disabled={pages === 1 ? true : false}
                                                    // onClick={(e) => {
                                                    //     search.function(document.getElementById("table-search").value)
                                                    // }}
                                                    >
                                                        Anterior
                                                    </ ButtonSimple>
                                                    <input className='mx-2 input-table page' max={dataTable.pages} min={1} type="number" defaultValue={pages} />
                                                    <ButtonSimple
                                                        type="button"
                                                        className="none-border-radius"
                                                        disabled={dataTable.pages === pages || dataTable.pages === 0 ? true : false}
                                                    // onClick={(e) => {
                                                    //     search.function(document.getElementById("table-search").value)
                                                    // }}
                                                    >
                                                        Siguiente
                                                    </ ButtonSimple>
                                                </div>
                                            </div>
                                        </>
                                    )
                        }
                    </div>
                    <div className='d-flex justify-content-end align-items-center mt-2'>
                        <ButtonSimple className="none-border-radius mx-2" onClick={() => { setEstado(false); setListOptions([]) }}>
                            Cerrar
                        </ButtonSimple>
                        <ButtonSimple className="none-border-radius mx-2" onClick={() => { AgregarOptions() }}>
                            Agregar
                        </ButtonSimple>

                    </div>
                </div>
            </div>

        </>
    )
}

export default ModalSelect