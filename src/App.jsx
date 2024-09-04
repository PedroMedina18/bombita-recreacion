import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import { FormEventContextProvider } from "./context/FormEventContext.jsx";
import {
  Login, Error404,
  Inicio, Cargos,
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
  Servicios, Sobrecargos,
  FormSobrecargos, FormServicios,
  Eventos, Dolar,
  FormDataEvent, FormAccount,
  EventosRecreadores, FormUsuarios,
  Configuracion, Cargo, Evento,
  CalendarRecreadores, CalendarEvent,
  Preguntas, Evaluacion
} from "./pages/Pages.jsx"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/cargos/" element={<Cargos />} />
            <Route path="/cargo/:id/" element={<Cargo />} />
            <Route path="/register/cargo/" element={<FormCargos />} />
            <Route path="/edit/cargo/:id/" element={<FormCargos />} />
            <Route path="/register/usuario/" element={<FormUsuarios />} />
            <Route path="/edit/usuario/:id/" element={<FormUsuarios />} />
            <Route path="/usuarios/" element={<Usuarios />} />
            <Route path="/usuario/:id" element={<Usuario />} />
            <Route path="/password/usuario/:id" element={<Password />} />
            <Route path="/eventos/" element={<Eventos />} />
            <Route path="/eventos/calendar/" element={<CalendarEvent />} />
            <Route path="/eventos/recreadores/:id_evento/" element={<EventosRecreadores />} />
            <Route path="/eventos/pagos/:id_evento/" element={<Pagos />} />
            <Route path="/eventos/:id/" element={<Evento />} />
            <Route path="/register/eventos/" element={<FormEventContextProvider />} >
              <Route path="" element={<FormDataEvent />} />
              <Route path="account/" element={<FormAccount />} />
            </Route>
            <Route path="/actividades/" element={<Actividades />} />
            <Route path="/register/actividad/" element={<FormActividades />} />
            <Route path="/edit/actividad/:id/" element={<FormActividades />} />
            <Route path="/niveles/" element={<Niveles />} />
            <Route path="/register/nivel/" element={<FormNiveles />} />
            <Route path="/edit/nivel/:id/" element={<FormNiveles />} />
            <Route path="/sobrecargos/" element={<Sobrecargos />} />
            <Route path="/register/sobrecargo/" element={<FormSobrecargos />} />
            <Route path="/edit/sobrecargo/:id/" element={<FormSobrecargos />} />
            <Route path="/materiales/" element={<Materiales />} />
            <Route path="/register/material/" element={<FormMateriales />} />
            <Route path="/edit/material/:id/" element={<FormMateriales />} />
            <Route path="/tipo_documentos/" element={<TipoDocumento />} />
            <Route path="/register/tipo_documento/" element={<FormTipoDocumento />} />
            <Route path="/edit/tipo_documento/:id/" element={<FormTipoDocumento />} />
            <Route path="/generos/" element={<Generos />} />
            <Route path="/register/genero/" element={<FormGeneros />} />
            <Route path="/edit/genero/:id/" element={<FormGeneros />} />
            <Route path="/recreador/calendar/:id/" element={<CalendarRecreadores />} />
            <Route path="/recreador/:id/" element={<Recreador />} />
            <Route path="/recreadores/" element={<Recreadores />} />
            <Route path="/register/recreador/" element={<FormRecreadores />} />
            <Route path="/edit/recreador/:id/" element={<FormRecreadores />} />
            <Route path="/servicios/" element={<Servicios />} />
            <Route path="/register/servicio/" element={<FormServicios />} />
            <Route path="/edit/servicio/:id/" element={<FormServicios />} />
            <Route path="/metodos_pago/" element={<MetodosPago />} />
            <Route path="/register/metodos_pago/" element={<FormMetodosPago />} />
            <Route path="/edit/metodos_pago/:id/" element={<FormMetodosPago />} />
            <Route path="/clientes/" element={<Clientes />} />
            <Route path="/edit/cliente/:id/" element={<FormClientes />} />
            <Route path="/dolar/" element={<Dolar />} />
            <Route path="/preguntas/" element={<Preguntas />} />
            <Route path="/evaluacion/:id" element={<Evaluacion />} />
            <Route path="/inicio/" element={<Inicio />} />
            <Route path="/configuracion/" element={<Configuracion />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
