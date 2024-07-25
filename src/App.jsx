import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import { FormEventContextProvider } from "./context/FormEventContext.jsx";
import {
  Login, Error404,
  Inicio, Cargos,
  Clientes, Form_Clientes,
  Form_Cargos, Tipo_Documento,
  Form_Tipo_Documento, Generos,
  Form_Generos, Pagos,
  Usuarios, Actividades,
  Form_Actividades, Recreadores,
  Form_Recreadores, Recreador,
  Metodos_Pago, Form_Metodos_Pago,
  Niveles, Form_Niveles,
  Materiales, Form_Materiales,
  Servicios, Sobrecargos,
  Form_Sobrecargos, Form_Servicios,
  Eventos, Dolar,
  FormDataEvent, FormAccount,
} from "./pages/Pages.jsx"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/cargos" element={<Cargos />} />
            <Route path="/register/cargo" element={<Form_Cargos />} />
            <Route path="/edit/cargo/:id" element={<Form_Cargos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/register/eventos/" element={<FormEventContextProvider />} >
              <Route path="" element={<FormDataEvent />} />
              <Route path="account" element={<FormAccount />} />
            </Route>
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/register/actividad" element={<Form_Actividades />} />
            <Route path="/edit/actividad/:id" element={<Form_Actividades />} />
            <Route path="/niveles" element={<Niveles />} />
            <Route path="/register/nivel" element={<Form_Niveles />} />
            <Route path="/edit/nivel/:id" element={<Form_Niveles />} />
            <Route path="/sobrecargos" element={<Sobrecargos />} />
            <Route path="/register/sobrecargo" element={<Form_Sobrecargos />} />
            <Route path="/edit/sobrecargo/:id" element={<Form_Sobrecargos />} />
            <Route path="/materiales" element={<Materiales />} />
            <Route path="/register/material" element={<Form_Materiales />} />
            <Route path="/edit/material/:id" element={<Form_Materiales />} />
            <Route path="/tipo_documentos" element={<Tipo_Documento />} />
            <Route path="/register/tipo_documento" element={<Form_Tipo_Documento />} />
            <Route path="/edit/tipo_documento/:id" element={<Form_Tipo_Documento />} />
            <Route path="/generos" element={<Generos />} />
            <Route path="/register/genero" element={<Form_Generos />} />
            <Route path="/edit/genero/:id" element={<Form_Generos />} />
            <Route path="/recreador/:numero_documento" element={<Recreador />} />
            <Route path="/recreadores" element={<Recreadores />} />
            <Route path="/register/recreador" element={<Form_Recreadores />} />
            <Route path="/edit/recreador/:numero_documento" element={<Form_Recreadores />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/register/servicio" element={<Form_Servicios />} />
            <Route path="/edit/servicio/:id" element={<Form_Servicios />} />
            <Route path="/metodos_pago" element={<Metodos_Pago />} />
            <Route path="/register/metodos_pago" element={<Form_Metodos_Pago />} />
            <Route path="/edit/metodos_pago/:id" element={<Form_Metodos_Pago />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/edit/cliente/:numero_documento" element={<Form_Clientes />} />
            <Route path="/dolar" element={<Dolar />} />
            <Route path="/pago_evento/:id_evento" element={<Pagos />} />
            <Route path="/inicio" element={<Inicio />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
