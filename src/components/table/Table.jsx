import 'react-loading-skeleton/dist/skeleton.css'
import "./table.css"
import { useState, useEffect, useRef } from 'react'
import { ButtonSimple } from "../button/Button.jsx"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { IconCheck, IconX} from "../Icon"
import { UnitSelect, InputsGeneral } from "../input/Inputs.jsx"
import { fechaFormat } from "../../utils/process.jsx"
import { useForm } from "react-hook-form";

function Table({ columns, rows, totalPages, totalElements = 0, options = null, loading = true, filtradores = [], order = false, organizar = [], fechaOrganizer = false }) {
    const [pages, setPages] = useState(1)
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceDate, setDebounceDate] = useState(null);
    const renderizado = useRef(0)
    const [filtros, setFilstros] = useState({})
    
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
            options.search.function(searchTerm, filtros)
        }, 900);

        setDebounceTimeout(timeout);
    }, [searchTerm])

    useEffect(() => {
        if (fechaOrganizer) {
            setValue("hasta", fechaFormat())
        }
    }, [])

    const filtrar = (e) => {
        if (debounceDate) {
            clearTimeout(debounceDate);
        }
        const timeout = setTimeout(() => {
            const filtro = { ...filtros }
            filtradores.forEach((e) => {
                if (Boolean(watch(`${e.columnName}`))) {
                    filtro[`${e.columnName}`] = watch(`${e.columnName}`)
                }
            })
            if (order) {
                filtro[`order`] = watch(`order`)
            }
            if (Boolean(organizar.length)) {
                filtro[`organizar`] = watch(`organizar`)
            }

            const desde = e.target.name === "desde" ? e.target.value : watch(`desde`)
            if (Boolean(desde)) {
                filtro.desde = desde
            } else {
                delete filtro.desde
            }

            if (Boolean(e.target.value)) {
                filtro[`${e.target.name}`] = e.target.value
            } else {
                delete filtro[`${e.target.name}`]
            }
            options.search.function(searchTerm, filtro)
            setFilstros(filtro)

        }, 800);

        setDebounceDate(timeout);
    }


    // *the useform
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm();

    return (
        <div className='div-main justify-content-between p-2 p-md-3 p-lg-4'>

            {/* info:Primera Seccion con el buscardor y el Boton de direccionamiento */}
            <div className='w-100 d-flex flex-column flex-md-row justify-content-between pb-3'>
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
            {

                (filtradores.length !== 0 || order || organizar.length !== 0 || fechaOrganizer) &&
                <div className='w-100 mt-2 mb-3 position-relative rounded border-secundary border border-2 '>
                    <button className='w-100 p-2 text-start fw-bold border border-0 row-collapse button-hover' type="button" data-bs-toggle="collapse" data-bs-target="#filter" aria-expanded="false" aria-controls="filter">Filtros</button>
                    <div className=' collapse' id="filter">
                        <div className='w-100 d-flex flex-column py-2'>

                            {
                                filtradores.length !== 0 &&
                                <div className='w-100 d-flex flex-column '>
                                    <span className='fw-bold text-center'>Categorías</span>
                                    <div className='d-flex w-100 flex-column flex-md-row'>
                                        {
                                            filtradores.map((filtro, index) => (
                                                <div key={`${filtro.columnName}_${index}`} className=' w-100 w-md-25 px-2'>
                                                    <UnitSelect
                                                        id={filtro.columnName}
                                                        isError={false}
                                                        name={filtro.columnName}
                                                        placeholder='Todas'
                                                        options={filtro.opciones}
                                                        needErrors={false}
                                                        label={filtro.nombre.replace(/\_/g, ' ').replace(/\b\w/g, match => match.toUpperCase())}
                                                        form={{ errors, register }}
                                                        onChange={(e) => {
                                                            filtrar(e)
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {

                                (order || organizar.length !== 0 || fechaOrganizer) &&
                                <div className='w-100 d-flex'>
                                    {
                                        (order || organizar.length !== 0) &&
                                        <div className='w-50 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='fw-bold text-center'>Orden</span>
                                            <div className='w-100 d-flex flex-column flex-md-row'>
                                                {
                                                    order &&
                                                    <div className='w-100 w-md-50 px-2'>
                                                        <UnitSelect
                                                            id={"order"}
                                                            isError={false}
                                                            name={"order"}
                                                            placeholder={null}
                                                            options={[{ label: "ASC", value: "ASC" }, { label: "DESC", value: "DESC" }]}
                                                            needErrors={false}
                                                            label={"Orden"}
                                                            form={{ errors, register }}
                                                            onChange={(e) => {
                                                                filtrar(e)
                                                            }}
                                                        />
                                                    </div>
                                                }
                                                {
                                                    organizar.length !== 0 &&
                                                    <div className='w-100 w-md-50 px-2'>
                                                        <UnitSelect
                                                            id={"organizar"}
                                                            isError={false}
                                                            name={"organizar"}
                                                            placeholder={null}
                                                            needErrors={false}
                                                            options={[{ label: organizar[0], value: "orig" }, { label: organizar[1], value: "alf" }]}
                                                            label={"Ordenar"}
                                                            form={{ errors, register }}
                                                            onChange={(e) => {
                                                                filtrar(e)
                                                            }}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                    {
                                        fechaOrganizer &&
                                        <div className='w-50 d-flex flex-column justify-content-center align-items-center'>
                                            <span className='fw-bold text-center'>Fecha</span>
                                            <div className='w-100 d-flex flex-column flex-md-row'>
                                                <div className='w-100 w-md-50 px-2'>
                                                    <InputsGeneral type={"date"} label={`Desde`} isError={false}
                                                        name="desde" id="desde" form={{ errors, register }}
                                                        needErrors={false}
                                                        max={fechaFormat()}
                                                        onChange={(e) => {
                                                            filtrar(e)
                                                        }}
                                                    />
                                                </div>
                                                <div className='w-100 w-md-50 px-2'>
                                                    <InputsGeneral type={"date"} label={`Hasta`} isError={false}
                                                        name="hasta" id="hasta" form={{ errors, register }}
                                                        needErrors={false}
                                                        max={fechaFormat()}
                                                        onChange={(e) => {
                                                            filtrar(e)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>

                </div>
            }

            {/* Segunda Seccion de la Tabla */}
            {
                loading ?
                    (
                        skeletonTable()
                    )
                    :
                    (
                        <div className='container-table'>
                            <table className='table-data border-table border-none'>
                                <thead>
                                    <tr>
                                        <th scope="col">N°</th>
                                        {
                                            columns.map((column, index) => (
                                                <th key={`${index}-${column.name}`} scope="col">{column.name}</th>
                                            ))
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
                                                    {/* {
                                                        option &&
                                                        <td >
                                                            <div className='d-flex justify-content-around options-table'>
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
                                                    } */}
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