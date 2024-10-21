import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import ProtectedPrivate from "./components/protected/ProtectedPrivate";
import { Tooltip } from 'bootstrap';
import { FormEventContextProvider } from "./context/FormEventContext.jsx";
import {
  Login, Error404,
  Inicio, Cargos, Cliente,
  Clientes, FormClientes,
  FormCargos, TipoDocumento,
  FormTipoDocumento, Generos,
  FormGeneros, Pagos, Password,
  Usuarios, Actividades, Usuario,
  FormActividades, Recreadores,
  FormRecreadores, Recreador,
  MetodosPago, FormMetodosPago,
  Niveles, FormNiveles,
  Materiales, FormMateriales,
  Servicios, Sobrecostos,
  FormSobrecostos, FormServicios,
  Eventos, Dolar, Inventario,
  FormDataEvent, FormAccount,
  EventosRecreadores, FormUsuarios,
  Configuracion, Cargo, Evento,
  CalendarRecreadores, CalendarEvent,
  Preguntas, Evaluacion, Servicio, Estadistica,
  Manual
} from "./pages/Pages.jsx"


function App() {
  const location = useLocation();

  useEffect(() => {
    const tooltipElements = document.querySelectorAll('div.tooltip.custom-tooltip.bs-tooltip-auto.fade.show');
    tooltipElements.forEach((element) => {
      element.remove()
    });
  }, [location]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRouter />}>

          <Route element={<ProtectedPrivate permisos={[1]} />}>
            <Route path="/cargos/" element={<Cargos />} />
            <Route path="/cargo/:id/" element={<Cargo />} />
            <Route path="/register/cargo/" element={<FormCargos />} />
            <Route path="/edit/cargo/:id/" element={<FormCargos />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[1, 4]} />}>
            <Route path="/password/usuario/:id" element={<Password />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[2]} />}>
            <Route path="/register/usuario/" element={<FormUsuarios />} />
            <Route path="/edit/usuario/:id/" element={<FormUsuarios />} />
            <Route path="/usuarios/" element={<Usuarios />} />
            <Route path="/usuario/:id" element={<Usuario />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[2]} />}>
            <Route path="/register/usuario/" element={<FormUsuarios />} />
            <Route path="/edit/usuario/:id/" element={<FormUsuarios />} />
            <Route path="/usuarios/" element={<Usuarios />} />
            <Route path="/usuario/:id" element={<Usuario />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[12]} />}>
            <Route path="/eventos/" element={<Eventos />} />
            <Route path="/eventos/calendar/" element={<CalendarEvent />} />
            <Route path="/eventos/:id/" element={<Evento />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[12]} />}>
            <Route path="/eventos/" element={<Eventos />} />
            <Route path="/eventos/calendar/" element={<CalendarEvent />} />
            <Route path="/eventos/:id/" element={<Evento />} />
            <Route path="/register/eventos/" element={<FormEventContextProvider />} >
              <Route path="" element={<FormDataEvent />} />
              <Route path="account/" element={<FormAccount />} />
            </Route>
            <Route path="/eventos/pagos/:id_evento/" element={<Pagos />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[12]} />}>
            <Route path="/eventos/" element={<Eventos />} />
            <Route path="/eventos/calendar/" element={<CalendarEvent />} />
            <Route path="/eventos/:id/" element={<Evento />} />
            <Route path="/register/eventos/" element={<FormEventContextProvider />} >
              <Route path="" element={<FormDataEvent />} />
              <Route path="account/" element={<FormAccount />} />
            </Route>
          </Route>

          <Route element={<ProtectedPrivate permisos={[12]} />}>
            <Route path="/eventos/recreadores/:id_evento/" element={<EventosRecreadores />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[12, 6]} />}>
            <Route path="/eventos/pagos/:id_evento/" element={<Pagos />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[11]} />}>
            <Route path="/evaluacion/:id" element={<Evaluacion />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[5]} />}>
            <Route path="/actividades/" element={<Actividades />} />
            <Route path="/register/actividad/" element={<FormActividades />} />
            <Route path="/edit/actividad/:id/" element={<FormActividades />} />
            <Route path="/servicios/" element={<Servicios />} />
            <Route path="/servicios/:id/" element={<Servicio />} />
            <Route path="/register/servicio/" element={<FormServicios />} />
            <Route path="/edit/servicio/:id/" element={<FormServicios />} />
            <Route path="/sobrecostos/" element={<Sobrecostos />} />
            <Route path="/register/sobrecosto/" element={<FormSobrecostos />} />
            <Route path="/edit/sobrecosto/:id/" element={<FormSobrecostos />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[7]} />}>
            <Route path="/niveles/" element={<Niveles />} />
            <Route path="/register/nivel/" element={<FormNiveles />} />
            <Route path="/edit/nivel/:id/" element={<FormNiveles />} />
            <Route path="/recreador/calendar/:id/" element={<CalendarRecreadores />} />
            <Route path="/recreador/:id/" element={<Recreador />} />
            <Route path="/recreadores/" element={<Recreadores />} />
            <Route path="/register/recreador/" element={<FormRecreadores />} />
            <Route path="/edit/recreador/:id/" element={<FormRecreadores />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[9]} />}>
            <Route path="/materiales/" element={<Materiales />} />
            <Route path="/register/material/" element={<FormMateriales />} />
            <Route path="/edit/material/:id/" element={<FormMateriales />} />
            <Route path="/inventario/:id/" element={<Inventario />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[8]} />}>
            <Route path="/clientes/" element={<Clientes />} />
            <Route path="/clientes/:id/" element={<Cliente />} />
            <Route path="/edit/cliente/:id/" element={<FormClientes />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[14]} />}>
            <Route path="/tipo_documentos/" element={<TipoDocumento />} />
            <Route path="/register/tipo_documento/" element={<FormTipoDocumento />} />
            <Route path="/edit/tipo_documento/:id/" element={<FormTipoDocumento />} />
            <Route path="/generos/" element={<Generos />} />
            <Route path="/register/genero/" element={<FormGeneros />} />
            <Route path="/edit/genero/:id/" element={<FormGeneros />} />
            <Route path="/metodos_pago/" element={<MetodosPago />} />
            <Route path="/register/metodos_pago/" element={<FormMetodosPago />} />
            <Route path="/edit/metodos_pago/:id/" element={<FormMetodosPago />} />
            <Route path="/dolar/" element={<Dolar />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[14, 11]} />}>
            <Route path="/preguntas/" element={<Preguntas />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[14, 3, 1, 11, 5, 12]} />}>
            <Route path="/configuracion/" element={<Configuracion />} />
          </Route>

          <Route element={<ProtectedPrivate permisos={[13]} />}>
            <Route path="/estadisticas/" element={<Estadistica />} />
          </Route>

          <Route path="/inicio/" element={<Inicio />} />
          <Route path="/manual/" element={<Manual />} />

        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  )
}

export default App
