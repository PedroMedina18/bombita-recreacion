import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { hasLeadingOrTrailingSpace } from "../../js/functions.js"
import { ButtonSimple } from "../button/Button.jsx"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import "./table.css"
function Table({ columns, rows, totalPages, totalElements = 0, options = null, loading = true }) {
    const [pages, setPages] = useState(1)
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const renderizado=useRef(0)

    useEffect(() => {
        if(renderizado.current===0 || renderizado.current===1){
            renderizado.current=renderizado.current + 1 
            return
        }
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        const timeout = setTimeout(() => {
            options.search.function(searchTerm)
        }, 1000);

        setDebounceTimeout(timeout);
    }, [searchTerm])

    const skeleton = () => {
        return (
            <SkeletonTheme baseColor="#dda6ad" highlightColor="#b81414">
                <div className='container-table mt-4'>
                    <table className='table-loading'>
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

    return (
        <div className='w-100 bg-white p-3 round min-height d-flex flex-column justify-content-evenly'>
            <div className='w-100 d-flex flex-column flex-md-row justify-content-between'>
                {
                    options.register ?
                        (
                            <ButtonSimple type="button" onClick={() => { options.register.function() }}>{options.register.name}</ButtonSimple>
                        )
                        :
                        ""
                }

                {
                    options.search ?
                        (<div className='ms-auto d-flex align-items-center w-100 w-sm-50 mt-3 mt-md-0'>
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
            {
                loading ?
                    (
                        skeleton()
                    ) :
                    (
                        <div className='container-table mt-4'>
                            <table className='table-data'>
                                <thead>
                                    <tr>
                                        {
                                            columns.map((column, index) => (
                                                <th key={`${index}-${column.name}`} scope="col">{column.name}</th>
                                            ))
                                        }
                                        {
                                            options.delete || options.put ?
                                                <th scope="col">Opciones</th>
                                                :
                                                ("")
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rows.length === 0 ?
                                            <>
                                                <tr>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-1`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        options.delete || options.put ?
                                                        (<td className="py-3"></td>)
                                                        :
                                                        ("")
                                                    }
                                                </tr>
                                                <tr>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-2`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        options.delete || options.put ?
                                                        (<td className="py-3"></td>)
                                                        :
                                                        ("")
                                                    }
                                                </tr>
                                                <tr>
                                                    {

                                                        columns.map((column, index) => {
                                                            return (<td key={`${column.name}-${index}-3`} className="py-3"></td>)
                                                        })
                                                    }
                                                    {
                                                        options.delete || options.put ?
                                                        (<td className="py-3"></td>)
                                                        :
                                                        ("")
                                                    }
                                                </tr>
                                            </>
                                            :
                                            rows.map((row, index) => (
                                                <tr key={`row-${index}`}>
                                                    {
                                                        columns.map((column, index) => {
                                                            if (column.row(row) === true) {
                                                                return (<td key={`${column.row(row)}-${index}`} className='svg-check'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg></td>)
                                                            }
                                                            if (column.row(row) === false) {
                                                                return (<td key={`${column.row(row)}-${index}`} className='svg-x'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg></td>)
                                                            }
                                                            return (<td key={`${column.row(row)}-${index}`} >{column.row(row)}</td>)

                                                        })
                                                    }
                                                    {
                                                        options.delete || options.put ?
                                                            (<td className='d-flex justify-content-around'>
                                                                {
                                                                    options.delete ?
                                                                        (<svg onClick={() => { options.delete(row) }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='me-1 cursor-pointer eliminate'><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>)
                                                                        :
                                                                        ("")
                                                                }
                                                                {
                                                                    options.put ?
                                                                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='ms-1 cursor-pointer edit'><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>)
                                                                        :
                                                                        ("")
                                                                }

                                                            </td>)
                                                            :
                                                            ("")
                                                    }
                                                </tr>
                                            ))
                                    }

                                </tbody>
                            </table>
                        </div>
                    )
            }
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

function totalItems(pages, items) {
    if (pages === 1) {
        return items
    }
    const total = (pages - 1) * 25 + items
    return total
}
export default Table