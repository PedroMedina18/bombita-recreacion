import { useEffect, useState, useRef } from "react";
import { Toaster } from "sonner";
import { tipo_documentos } from "../../utils/API.jsx";
import { useNavigate } from "react-router-dom";
import { deleteItem, searchCode, getListItems } from "../../utils/actions.jsx";
import { IconTrash, IconEdit, IconDetail } from "../../components/Icon.jsx";
import { formatoId, formatDateWithTime12Hour } from "../../utils/process.jsx";
import { alertInfo } from "../../components/alerts.jsx";
import Navbar from "../../components/navbar/Navbar.jsx";
import Table from "../../components/table/Table.jsx";
import texts from "../../context/text_es.js";

function TipoDocumento() {
  const [listTipo_Documentos, setTipo_Documentos] = useState([]);
  const [dataTipo_Documentos, setDataTipo_Documentos] = useState({
    pages: 0,
    total: 0,
  });
  const [tableLoading, setTableLoaing] = useState(true);
  const renderizado = useRef(0);

  const navigate = useNavigate();
  useEffect(() => {
    document.title="Tipos de Documentos - Bombita Recreación"
    if (renderizado.current === 0) {
      renderizado.current = renderizado.current + 1;
      getTipo_Documentos();
      return;
    }
  }, []);

  const getTipo_Documentos = () => {
    getListItems({
      object: tipo_documentos,
      setList: setTipo_Documentos,
      setData: setDataTipo_Documentos,
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
      name: "Nombre",
      row: (row) => {
        return row.nombre;
      },
    },
    {
      name: "Descripción",
      row: (row) => {
        return row.descripcion;
      },
    },
    {
      name: "Opciones",
      row: (row) => {
        return (
          <div className="d-flex justify-content-around options-table">
            <IconDetail
              onClick={() => {
                alertInfo(row.nombre, {
                  codigo: formatoId(row.id),
                  descripción: row.descripcion,
                  fecha_de_registro: formatDateWithTime12Hour(
                    row.fecha_registro
                  ),
                  ultima_modificación: formatDateWithTime12Hour(
                    row.fecha_actualizacion
                  ),
                });
              }}
              className="cursor-pointer"
            />
            <IconTrash
              onClick={() => {
                deleteItem({
                  row: row,
                  objet: tipo_documentos,
                  functionGet: getTipo_Documentos,
                });
              }}
              className="cursor-pointer"
            />
            <IconEdit
              onClick={() => {
                navigate(`/edit/tipo_documento/${row.id}/`);
              }}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  const options = {
    search: {
      placeholder: texts.registerMessage.searchItem,
      function: (value, fitros = {}) => {
        searchCode({
          value: value,
          filtros: fitros,
          object: tipo_documentos,
          setList: setTipo_Documentos,
          setData: setDataTipo_Documentos,
          setLoading: setTableLoaing,
        });
      },
    },
    register: {
      name: texts.registerMessage.buttonRegisterTipoDocumento,
      function: () => {
        navigate("/register/tipo_documento/");
      },
    },
  };

  return (
    <Navbar
      name={`${texts.pages.getTipoDocumentos.name}`}
      descripcion={`${texts.pages.getTipoDocumentos.description}`}
      dollar={false}
    >
      <Table
        columns={columns}
        rows={listTipo_Documentos}
        totalElements={dataTipo_Documentos.total}
        totalPages={dataTipo_Documentos.pages}
        options={options}
        loading={tableLoading}
        order={true}
        organizar={[
          { label: "Origen", value: "orig" },
          { label: "Nombre", value: "alf" },
        ]}
      />
      <Toaster />
    </Navbar>
  );
}

export default TipoDocumento;
