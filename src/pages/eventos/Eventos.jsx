import { useEffect, useState, useRef } from "react";
import { eventos } from "../../utils/API.jsx";
import { alertConfim, toastError, alertMotivo } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { searchCode, getListItems, deleteItem } from "../../utils/actions.jsx";
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import {
  IconTrash,
  IconDesabilit,
  IconRecreadores,
  IconDetail,
  IconMoney,
  IconCalendar
} from "../../components/Icon.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { ButtonSimple } from "../../components/button/Button.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import Pildora from "../../components/Pildora.jsx";
import texts from "../../context/text_es.js";
import dayjsEs from "../../utils/dayjs.js";

function Eventos() {


  return (
    <Navbar
      name={texts.pages.getEventos.name}
      descripcion={texts.pages.getEventos.description}
    >
      <TableEventos />

      <Toaster />
    </Navbar>
  );
}

export function TableEventos({ filtrosTable = {}, calendar = true, recreadoresIcon = true, desabilititIcon = true, moneyIcon = true, optionsRegister = true, optionsSerch = true }) {
  const [listEventos, setEventos] = useState([]);
  const [dataEventos, setDataEventos] = useState({ pages: 0, total: 0 });
  const [tableLoading, setTableLoaing] = useState(true);
  const renderizado = useRef(0);
  const navigate = useNavigate();
  const dayjs = dayjsEs();

  useEffect(() => {
    document.title = "Eventos - Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1;
      getEventos();
      return;
    }
  }, []);

  const getEventos = (filtros = {}) => {
    getListItems({
      object: eventos,
      filtros: { ...filtros, ...filtrosTable },
      setList: setEventos,
      setData: setDataEventos,
      setLoading: setTableLoaing,
    });
  };

  const columns = [
    {
      name: "Código",
      row: (row) => {
        const codigo = formatoId(Number(row.id));
        return codigo;
      },
    },
    {
      name: "Fecha",
      row: (row) => {
        const fecha = formatDateWithTime12Hour(row.fecha_evento_inicio);
        return fecha;
      },
    },
    {
      name: "Documento",
      row: (row) => {
        return `${row.tipo_documento}-${row.numero_documento}`;
      },
    },
    {
      name: "Cliente",
      row: (row) => {
        return `${row.nombres} ${row.apellidos}`;
      },
    },
    {
      name: "Estado de Pago",
      row: (row) => {
        let value;
        if (row.estado_pago === 3) {
          value = <Pildora contenido={`${row.estado_pago_descripcion}`} color="bg-info"></Pildora>
        }
        if (row.estado_pago === 2) {
          value = <Pildora contenido={`${row.estado_pago_descripcion}`} color="bg-succes"></Pildora>
        }
        if (row.estado_pago === 1) {
          value = <Pildora contenido={`${row.estado_pago_descripcion}`} color="bg-warning"></Pildora>
        }
        if (row.estado_pago === 0) {
          value = <Pildora contenido={`${row.estado_pago_descripcion}`} color="bg-danger"></Pildora>
        }
        return value;
      },
    },
    {
      name: "Estado",
      row: (row) => {
        let value;
        if (row.estado === null) {
          value = "En espera";
          value = <Pildora contenido={"En espera"} color="bg-info"></Pildora>
        }
        if (Boolean(row.estado) === false && row.estado !== null) {
          value = <Pildora contenido={"Cancelado"} color="bg-danger"></Pildora>
        }
        if (Boolean(row.estado) === true) {
          value = <Pildora contenido={"Completado"} color="bg-succes"></Pildora>
        }
        return value;
      },
    },
    {
      name: "Opciones",
      row: (row, filtros) => {
        return (
          <div className="d-flex justify-content-around options-table">
            <IconDetail
              onClick={() => {
                navigate(`/eventos/${row.id}/`);
              }} className="cursor-pointer"
            />
            {
              recreadoresIcon &&
              <IconRecreadores
                onClick={() => {
                  navigate(`/eventos/recreadores/${row.id}/`);
                }} className="cursor-pointer"
              />
            }
            {
              moneyIcon &&
              <IconMoney
                onClick={() => {
                  navigate(`/eventos/pagos/${row.id}/`);
                }}
                className="cursor-pointer"
              />
            }
            {
              desabilititIcon &&
              <IconDesabilit
                onClick={() => {
                  const day = dayjs()
                  const end = dayjs(row.fecha_evento_final)
                  if (day.isAfter(end)) {
                    return
                  }
                  if (row.estado == 1 || row.estado === 0) {
                    return
                  }
                  cancelarEvento(row.id, filtros)
                }}
                className="cursor-pointer"
              />
            }



          </div>
        );
      },
    },
  ];


  const options = {
  };
  if (optionsRegister) {
    options.register = {
      name: texts.registerMessage.buttonRegisterEvento,
      function: () => {
        navigate("/register/eventos/");
      },
    }
  }
  if (optionsSerch) {
    options.search = {
      placeholder: texts.registerMessage.searchClientEvent,
      function: (value, filtros = {}) => {
        searchCode({
          value: value,
          filtros: { ...filtros, ...filtrosTable },
          object: eventos,
          setList: setEventos,
          setData: setDataEventos,
          setLoading: setTableLoaing,
        })
      }
    }
  }

  const ButtonCalendar = () => {
    return (
      <div className="w-100 mb-2 d-flex">
        <ButtonSimple className={"ms-auto"} onClick={() => { navigate("/eventos/calendar/") }}>Calendario de Eventos <IconCalendar /></ButtonSimple>
      </div>
    )
  }

  const cancelarEvento = async (id, filtros) => {
    try {
      const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmCancelarEvento)
      if (confirmacion.isConfirmed) {
        alertMotivo("Motivo por el que se Cancela el evento", id, () => { getEventos(filtros) })
      }
    } catch (error) {
      toastError(texts.errorMessage.errorSystem)
    }
  }

  const filtros = [
    {
      nombre: "Estado",
      columnName: "estado",
      opciones: [{ label: "En espera", value: "null" }, { label: "Completado", value: 1 }, { label: "Cancelado", value: 0 }]
    },
    {
      nombre: "Estado Pago",
      columnName: "estado_pago",
      opciones: [{ label: "Completo", value: 2 }, { label: "Anticipo", value: 1 }, { label: "Ningun Pago", value: 0 }]
    },
  ]
  return (
    <Table
      childrenTop={calendar ? ButtonCalendar : () => { return (<></>) }}
      filtradores={filtros}
      columns={columns}
      rows={listEventos}
      totalElements={dataEventos.total}
      totalPages={dataEventos.pages}
      options={options}
      loading={tableLoading}
      fechaOrganizer={true}
      order={true}
      organizar={[
        { label: "Codigo", value: "orig" },
        { label: "Cliente", value: "alf" },
      ]}

    />
  )
}


export default Eventos;
