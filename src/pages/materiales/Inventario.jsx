import { useEffect, useState, useRef } from "react"
import { inventario } from "../../utils/API.jsx"
import { Toaster } from "sonner";
import { useNavigate, useParams } from 'react-router-dom';
import { searchCode, getListItems } from "../../utils/actions.jsx";
import { formatDateWithTime12Hour, hasLeadingOrTrailingSpace } from "../../utils/process.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { formatoId,  } from "../../utils/process.jsx";
import { toastError, alertAceptar } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar";
import Table from "../../components/table/Table";
import texts from "../../context/text_es.js";
import Pildora from "../../components/Pildora.jsx";
import Swal from 'sweetalert2';
import "../../components/input/input.css"

function Inventario() {
    const [listInventario, setInventario] = useState([])
    const [dataInventario, setDataInventario] = useState({ pages: 0, total: 0, total_inventario:0 })
    const [tableLoading, setTableLoaing] = useState(true)
    const params = useParams();
    const renderizado = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Inventario de Material - Bombita Recreación"
        if (renderizado.current === 0) {
            renderizado.current = renderizado.current + 1
            getInventario()
            return
        }
    }, [])

    const getInventario = async (filtros={}) => {
        const respuesta = getListItems({
            subDominio: [Number(params.id)],
            object: inventario,
            data:dataInventario,
            filtros:filtros,
            setList: setInventario,
            setData: setDataInventario,
            setLoading: setTableLoaing,

        })
        setDataInventario({
            ...dataInventario,
            total_inventario:respuesta.total_material
        })
    }

    const alertRegisterInventario = async ({ title, id, total }) => {
        return Swal.fire({
            title: `${title}`,
            color: "black",
            customClass: {
                title: "h1 fw-bold text-black",
                confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
                cancelButton: "px-5 py-3 mx-3 fs-6 fw-bold",
                inputLabel: "fw-bold cursor-pointer label-alert ",
                input: "input-alert"
            },
            html: `
                <div class="px-4 py-2">
                    <div class="w-100 d-flex flex-column px-1 mt-2 align-items-start">
                        <label class="fw-bold fs-6 mb-2" for="cantidad">Cantidad</label>
                        <input type="number" name="cantidad" id="input-cantidad" min="0" class="formulario-input input-45">
                    </div>
                    <div class="w-100 d-flex flex-column px-1 mt-2 align-items-start">
                        <label class="fw-bold fs-6 mb-2" for="tipo_registro">Tipo de Registro</label>
                        <select name="tipo_registro" id="select-tipo_registro" class="formulario-input select">
                            <option value="null">...</option>
                            <option value="1">Sumar</option>
                            <option value="0">Restar</option>
                        </select>
                    </div>
                    <div class="w-100 d-flex flex-column px-1 mt-2 align-items-start">
                        <label class="fw-bold fs-6 mb-2" for="descripcion">Descripción</label>
                        <textarea name="descripcion" id="text-area-descripcion" rows="3" class="formulario-textarea"></textarea>
                    </div>
                </div>
            `,
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
                        cantidad: document.getElementById("input-cantidad").value,
                        descripcion: document.getElementById("text-area-descripcion").value,
                        tipo: document.getElementById("select-tipo_registro").value,
                        material:Number(id)
                    }
                    if(!body.cantidad){
                        return Swal.showValidationMessage(texts.inputsMessage.requiredCantidadMaterial);
                    }
                    if(!body.descripcion){
                        return Swal.showValidationMessage(texts.inputsMessage.requiredDescripcion);
                    }
                    if(!body.tipo){
                        return Swal.showValidationMessage(texts.inputsMessage.selectRegistro);
                    }
                    body.cantidad=Number(body.cantidad)
                    body.tipo=Number(body.tipo)
                    if(body.cantidad < 0 || body.cantidad === 0 ){
                        return Swal.showValidationMessage(texts.inputsMessage.invalidCantidad);
                    }
                    if(hasLeadingOrTrailingSpace(body.descripcion)){
                        return Swal.showValidationMessage(texts.inputsMessage.noneSpace);
                    }
                    if(body.descripcion.length > 300){
                        return Swal.showValidationMessage(texts.inputsMessage.max300);
                    }
                    const respuesta = await inventario.post(body)
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
                const aceptar = await alertAceptar("Exito!", texts.successMessage.registerRegistroMaterial)
                if (aceptar.isConfirmed) {
                    getInventario()
                }
            }
            if(result.value?.status === false){
                toastError(result.value? result.value.message : "Error durante el registro")
            }
        })
    }

    const columns = [
        {
            name: "Código",
            row: (row) => { const codigo = formatoId(Number(row.id)); return codigo }
        },
        {
            name: "Descripción",
            row: (row) => { return row.descripcion }
        },
        {
            name: "Fecha",
            row: (row) => { return formatDateWithTime12Hour(row.fecha_registro) }
        },
        {
            name: "Tipo",
            row: (row) => {
                let value;
                if (row.tipo === 0) {
                    value = <Pildora contenido={`RESTAR`} color="bg-danger"></Pildora>
                }
                if (row.tipo === 1) {
                    value = <Pildora contenido={`SUMAR`} color="bg-succes"></Pildora>
                }
                if (row.tipo === 2) {
                    value = <Pildora contenido={`INICIAL`} color="bg-info"></Pildora>
                }
                return value;

            }
        },
        {
            name: "Cantidad",
            row: (row) => { return row.cantidad }
        },
        {
            name: "Total",
            row: (row) => { return <p className="m-0 fw-bold">{row.total}</p> }
        },
    ]

    const options = {
        search: {
            placeholder: texts.registerMessage.searchItem,
            function: (value, filtros = null) => {
                searchCode({
                    value: value,
                    subDominio: [Number(params.id)],
                    object: inventario,
                    filtros:filtros,
                    setList: setInventario,
                    setData: setDataInventario,
                    setLoading: setTableLoaing,
                })
            }
        },
        register: {
            name: texts.registerMessage.buttonRegisterInventario,
            function: () => {
                alertRegisterInventario({ title: "Registro de Inventario", id: params.id, total:dataInventario.total_inventario  })
            }
        }
    }
    const filtros = [
    {
        nombre: "Tipo",
        columnName: "tipo",
        opciones: [{ label: "Sumar", value: 1}, { label: "Restar", value: 0 }, { label: "Inicial", value: 2 }]
    },
]

    return (
        <Navbar name={texts.pages.getInventario.name} descripcion={texts.pages.getInventario.description} dollar={false}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/materiales/") }}> <IconRowLeft /> Regresar</ButtonSimple>
            <Table
                columns={columns}
                rows={listInventario}
                totalElements={dataInventario.total}
                totalPages={dataInventario.pages}
                options={options}
                loading={tableLoading}
                filtradores={filtros}
                fechaOrganizer={true}
                order={true}
            />
            <Toaster />
        </Navbar>
    )
}

export default Inventario