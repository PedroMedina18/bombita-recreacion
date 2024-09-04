import { useEffect, useState, useRef } from "react"
import { preguntas } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate } from 'react-router-dom';
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDesabilit } from "../../components/Icon.jsx";
import { formatoId } from "../../utils/process.jsx";
import { alertInfo, alertAceptar, toastError } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";
import Swal from 'sweetalert2';
import Pildora from "../../components/Pildora.jsx";

function Preguntas() {
    const [listPreguntas, setPreguntas] = useState([])
    const [dataPreguntas, setDataPreguntas] = useState({ pages: 0, total: 0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const renderizado = useRef(0)
    const navigate = useNavigate()

    const alertRegisterPregunta = async ({ title, dataEdit = { value: "", id: 0 } }) => {
        return Swal.fire({
            title: `${title}`,
            color: "black",
            customClass: {
                title: "h1 fw-bold text-black",
                confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
                cancelButton: "px-5 py-3 mx-3 fs-6 fw-bold",
                inputLabel: "fw-bold cursor-pointer label-alert",
                input: "input-alert"
            },
            input: "text",
            inputLabel: "Pregunta",
            inputValue: dataEdit.value,
            inputPlaceholder: "Ingrese la pregunta",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "rgb(var(--principal))",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "rgb(var(--secundario))",
            showLoaderOnConfirm: true,
            width: "60%",
            preConfirm: async (value) => {
                try {
                    const body = {
                        pregunta: value
                    }
                    if (!value) {
                        return Swal.showValidationMessage(texts.inputsMessage.requirePregunta);
                    }
                    if (value.length > 100) {
                        return Swal.showValidationMessage(texts.inputsMessage.max100);
                    }
                    if (value.length < 8) {
                        return Swal.showValidationMessage(texts.inputsMessage.min8);
                    }
                    const respuesta = Number(dataEdit.id) > 0 ? await preguntas.put(body, { subDominio: [Number(dataEdit.id)] }) : await preguntas.post(body)
                    if (respuesta.status !== 200) {
                        return Swal.showValidationMessage(`${`Error.${respuesta.status} ${respuesta.statusText}`}`);
                    }
                    if (respuesta.data.status === false) {
                        return Swal.showValidationMessage(`${respuesta.data.message}`);
                    }
                    return respuesta.data;
                } catch (error) {
                    Swal.showValidationMessage(`
                    Petición Fallada: ${error}
                  `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(async (result) => {
            if (result.value?.status) {
                const aceptar = await alertAceptar("Exito!", dataEdit.id > 0 ? texts.successMessage.editionPregunta : texts.successMessage.registerPregunta)
                if (aceptar.isConfirmed) {
                    getPreguntas()
                }
            }
        })
    }

    useEffect(() => {
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getPreguntas()
            return
        }
    }, [])

    const getPreguntas = () => {
        getListItems({
            object: preguntas,
            setList: setPreguntas,
            setData: setDataPreguntas,
            setLoading: setTableLoaing,

        })
    }

    const columns = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Pregunta",
            row: (row) => { return row.pregunta }
        },
        {
            name: "Estado",
            row: (row) => {
                return row.estado ? <Pildora contenido="Activo" color="bg-succes" /> : <Pildora contenido="Inhabilitado" color="bg-danger" />
            }
        },
        {
            name: "Opciones",
            row: (row) => {
                return <div className='d-flex justify-content-around options-table'>
                    <IconDesabilit
                        onClick={async () => {
                            const body = {
                                estado: !row.estado
                            }
                            const respuesta = await preguntas.put(body, { subDominio: [row.id] })
                            if (respuesta.status !== 200) {
                                toastError(`${`Error.${respuesta.status} ${respuesta.statusText}`}`);
                                return
                            }
                            if (respuesta.data.status === false) {
                                toastError(`${respuesta.data.message}`);
                                return
                            }
                            getPreguntas()
                        }}
                        className="cursor-pointer"
                    />
                    <IconTrash
                        onClick={() => {
                            deleteItem({
                                row: row,
                                objet: preguntas,
                                functionGet: getPreguntas,
                            });
                        }}
                        className="cursor-pointer"
                    />
                    <IconEdit
                        onClick={() => {
                            alertRegisterPregunta({
                                title: texts.pages.editPregunta.name,
                                dataEdit: {
                                    id: row.id,
                                    value: row.pregunta
                                }
                            })
                        }}
                        className="cursor-pointer" />
                </div>
            }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value, filtros = null) => {
                searchCode({
                    value: value,
                    object: materiales,
                    setList: setMateriales,
                    setData: setDataMateriales,
                    setLoading: setTableLoaing,
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterPregunta,
            function: () => {
                alertRegisterPregunta({
                    title: texts.pages.registerPregunta.name
                })
            }
        }
    }

    return (
        <Navbar name={texts.pages.getPreguntas.name} descripcion={texts.pages.getPreguntas.description}>
            <Table
                columns={columns}
                rows={listPreguntas}
                totalElements={dataPreguntas.total}
                totalPages={dataPreguntas.pages}
                options={options}
                loading={tableLoading}
            />
            <Toaster />
        </Navbar>
    )
}



export default Preguntas