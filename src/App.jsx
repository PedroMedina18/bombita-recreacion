import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Error404 from './pages/Error404';
import Inicio from './pages/Inicio';
import Cargos from "./pages/cargos/Cargos";
import Clientes from "./pages/clientes/Clientes";
import Form_Clientes from "./pages/clientes/Form_Clientes";
import Form_Cargos from "./pages/cargos/Form_Cargos"
import Tipo_Documento from "./pages/tipoDocumento/Tipo_Documento";
import Form_Tipo_Documento from "./pages/tipoDocumento/Form_Tipo_Documento";
import Generos from "./pages/generos/Generos";
import Form_Generos from "./pages/generos/Form_Generos";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import Usuarios from "./pages/usuarios/Usuarios";
import Actividades from "./pages/actividades/Actividades";
import Form_Actividades from "./pages/actividades/Form_Actividades";
import Recreadores from "./pages/recreadores/Recreadores"
import Form_Recreadores from "./pages/recreadores/Form_Recreadores";
import Recreador from "./pages/recreadores/Recreador";
import Metodos_Pago from "./pages/metodos_pago/Metodos_Pago";
import Form_Metodos_Pago from "./pages/metodos_pago/Form_Metodos_Pago";
import Niveles from "./pages/niveles/Niveles";
import Form_Niveles from "./pages/niveles/Form_Niveles";
import Materiales from "./pages/materiales/Materiales";
import Form_Materiales from "./pages/materiales/Form_Materiales";
import Servicios from "./pages/servicios/Servicios";
import Sobrecargos from "./pages/sobrecargos/Sobrecargos";
import Form_Sobrecargos from "./pages/sobrecargos/Form_Sobrecargos";
import Form_Servicios from "./pages/servicios/Form_Servicios";
import Eventos from "./pages/eventos/Eventos";
import Dolar from "./pages/dolar/Dolar.jsx";
import FormDataEvent from "./pages/eventos/FormDataEvent";
import FormAccount from "./pages/eventos/FormAccount";
import {FormEventContextProvider} from "./context/FormEventContext.jsx";

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
            <Route path="/inicio" element={<Inicio />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
