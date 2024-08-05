import "./table.css"
import { useState, useEffect, useRef } from 'react'
import { ButtonSimple } from "../button/Button.jsx"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { IconCheck, IconX, IconTrash, IconEdit, IconDetail, IconMoney } from "../Icon"

function Table({ columns, rows, totalPages, totalElements = 0, options = null, loading = true }) {
    const [pages, setPages] = useState(1)
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const renderizado = useRef(0)
    const option = Boolean(options.delete || options.put || options.get || options.money)
    
    useEffect(() => {
        // Para evitar el sobre renderizado al cargar el componente
        if (renderizado.current === 0 || renderizado.current === 1) {
            renderizado.current = renderizado.current + 1
            return
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            options.search.function(searchTerm)
        }, 900);

        setDebounceTimeout(timeout);
    }, [searchTerm])

    return (
        <div className='div-main justify-content-between p-2 p-md-3 p-lg-4'>

            {/* info:Primera Seccion con el buscardor y el Boton de direccionamiento */}
            <div className='w-100 d-flex flex-column flex-md-row justify-content-between'>
                {
                    options.register ?
                        (
                            <div className='w-100 w-md-50 pe-2 pe-md-4'>
                                <ButtonSimple type="button" className={"w-100"} onClick={() => { options.register.function() }}>{options.register.name}</ButtonSimple>
                            </div>
                        )
                        :
                        ""
                }

                {
                    options.search ?
                        (<div className=' d-flex align-items-center w-100 w-md-50 mt-3 mt-md-0'>
                            <ButtonSimple
                                type="button"
                                onClick={(e) => {
                                    options.search.function(document.getElementById("table-search").value)
                                }}
                            >
                                Buscar
                            </ ButtonSimple>
                            <input id="table-search"
                                className='ms-2 input-table'
                                onKeyUp={(e) => {
                                    setSearchTerm(e.target.value)
                                }}
                                placeholder={`${options.search.placeholder}`} type="text" />
                        </div>)
                        :
                        ""
                }
            </div>

            {/* Segunda Seccion de la Tabla */}
            {
                loading ?
                    (
                        skeletonTable()
                    )
                    :
                    (
                        <div className='container-table  mt-4'>
                            <table className='table-data border-table border-none'>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        {
                                            columns.map((column, index) => (
                                                <th key={`${index}-${column.name}`} scope="col">{column.name}</th>
                                            ))
                                        }
                                        {
                                            option &&
                                            <th scope="col">Opciones</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rows.length === 0 ?
                                            <>
                                                <tr>
                                                    <td className="py-3"></td>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-1`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        option &&
                                                        <td className="py-3"></td>
                                                    }
                                                </tr>
                                                <tr>
                                                    <td className="py-3"></td>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-2`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        option &&
                                                        <td className="py-3"></td>
                                                    }
                                                </tr>
                                                <tr>
                                                    <td className="py-3"></td>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-3`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        option &&
                                                        <td className="py-3"></td>
                                                    }
                                                </tr>
                                            </>
                                            :
                                            rows.map((row, index) => (
                                                <tr key={`row-${index}`}>
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
                                                    {
                                                        option &&
                                                            <td >
                                                                <div className='d-flex justify-content-around'>
                                                                    {
                                                                        options.get ?
                                                                            (<IconDetail onClick={() => { options.get(row) }} className='cursor-pointer get' />)
                                                                            :
                                                                            ("")
                                                                    }
                                                                    {
                                                                        options.delete ?
                                                                            (<IconTrash onClick={() => { options.delete(row) }} className='cursor-pointer eliminate' />)
                                                                            :
                                                                            ("")
                                                                    }
                                                                    {
                                                                        options.put ?
                                                                            (<IconEdit onClick={() => { options.put(row) }} className='cursor-pointer edit' />)
                                                                            :
                                                                            ("")
                                                                    }
                                                                    {
                                                                        options.money ?
                                                                            (<IconMoney onClick={() => { options.money(row) }} className='cursor-pointer money' />)
                                                                            :
                                                                            ("")
                                                                    }
                                                                </div>
                                                            </td>
                                                    }
                                                </tr>
                                            ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    )
            }

            {/* Tercera Seccion para la paginacion y el total de pagina */}
            <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center w-100 mt-3'>
                <p className='m-0 mb-3 mb-sm-0 fw-bold fs-6'>{`Mostrando ${totalItems(pages, rows.length)} de ${totalElements}`}</p>

                <div className='d-flex justify-content-between align-items-center '>
                    <ButtonSimple
                        type="button"
                        disabled={pages === 1 ? true : false}
                        onClick={(e) => {
                            search.function(document.getElementById("table-search").value)
                        }}
                    >
                        Anterior
                    </ ButtonSimple>
                    <input className='mx-2 input-table page' max={totalPages} min={1} type="number" defaultValue={pages} />
                    <ButtonSimple
                        type="button"
                        disabled={totalPages === pages || totalPages === 0 ? true : false}
                        onClick={(e) => {
                            search.function(document.getElementById("table-search").value)
                        }}
                    >
                        Siguiente
                    </ ButtonSimple>
                </div>
            </div>
        </div>
    )
}


export function totalItems(pages, items) {
    if (pages === 1) {
        return items
    }
    const totalPages = (pages - 1) * 25 + items
    return totalPages
}


function skeletonTable() {
    return (
        <SkeletonTheme baseColor="#dda6ad" highlightColor="#b81414">
            <div className='container-table  mt-4'>
                <table className='table-loading border-table'>
                    <thead>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                        <tr>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                            <th><Skeleton duration={1.5} /></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </SkeletonTheme>
    )
}

export default Table