import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import { FormEventContextProvider } from "./context/FormEventContext.jsx";
import {
  Login, Error404,
  Inicio, Cargos,
  Clientes, FormClientes,
  FormCargos, TipoDocumento,
  FormTipoDocumento, Generos,
  FormGeneros, Pagos,
  Usuarios, Actividades,
  FormActividades, Recreadores,
  FormRecreadores, Recreador,
  MetodosPago, FormMetodosPago,
  Niveles, FormNiveles,
  Materiales, FormMateriales,
  Servicios, Sobrecargos,
  FormSobrecargos, FormServicios,
  Eventos, Dolar,
  FormDataEvent, FormAccount,
  EventosRecreadores
} from "./pages/Pages.jsx"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/cargos/" element={<Cargos />} />
            <Route path="/register/cargo/" element={<FormCargos />} />
            <Route path="/edit/cargo/:id/" element={<FormCargos />} />
            <Route path="/usuarios/" element={<Usuarios />} />
            <Route path="/eventos/" element={<Eventos />} />
            <Route path="/eventos/recreadores/:id_evento/" element={<EventosRecreadores />} />
            <Route path="/eventos/pagos/:id_evento/" element={<Pagos />} />
            {/* <Route path="/eventos/:id_evento/" element={<Inicio />} /> */}
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
            <Route path="/recreador/:numero_documento/" element={<Recreador />} />
            <Route path="/recreadores/" element={<Recreadores />} />
            <Route path="/register/recreador/" element={<FormRecreadores />} />
            <Route path="/edit/recreador/:numero_documento/" element={<FormRecreadores />} />
            <Route path="/servicios/" element={<Servicios />} />
            <Route path="/register/servicio/" element={<FormServicios />} />
            <Route path="/edit/servicio/:id/" element={<FormServicios />} />
            <Route path="/metodos_pago/" element={<MetodosPago />} />
            <Route path="/register/metodos_pago/" element={<FormMetodosPago />} />
            <Route path="/edit/metodos_pago/:id/" element={<FormMetodosPago />} />
            <Route path="/clientes/" element={<Clientes />} />
            <Route path="/edit/cliente/:numero_documento/" element={<FormClientes />} />
            <Route path="/dolar/" element={<Dolar />} />
            <Route path="/inicio/" element={<Inicio />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
