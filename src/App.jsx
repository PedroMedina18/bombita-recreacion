import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Error404 from './pages/Error404';
import Inicio from './pages/Inicio';
import Cargos from "./pages/cargos/Cargos";
import Form_Cargos from "./pages/cargos/Form_Cargos"
import Tipo_Documento from "./pages/tipoDocumento/Tipo_Documento";
import Form_Tipo_Documento from "./pages/tipoDocumento/Form_Tipo_Documento";
import Genro from "./pages/generos/Generos";
import Form_Genro from "./pages/generos/Form_Generos";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import Usuarios from "./pages/usuarios/Usuarios";
import Actividades from "./pages/actividades/Actividades";
import Form_Actividades from "./pages/actividades/Form_Actividades";
import Recreadores from "./pages/recreadores/Recreadores"
import Niveles from "./pages/niveles/Niveles";
import Form_Niveles from "./pages/niveles/Form_Niveles";
import Form_Recreadores from "./pages/recreadores/Form_Recreadores";
import Materiales from "./pages/materiales/Materiales";
import Form_Materiales from "./pages/materiales/Form_Materiales";
import Servicios from "./pages/servicios/Servicios";
import Form_Servicios from "./pages/servicios/Form_Servicios";
import Form_Eventos from "./pages/eventos/Form_Eventos";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/register/cargo" element={<Form_Cargos />} />
            <Route path="/cargos" element={<Cargos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/register/eventos" element={<Form_Eventos />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/register/actividad" element={<Form_Actividades />} />
            <Route path="/niveles" element={<Niveles />} />
            <Route path="/register/nivel" element={<Form_Niveles />} />
            <Route path="/materiales" element={<Materiales />} />
            <Route path="/register/material" element={<Form_Materiales />} />
            <Route path="/tipo_documentos" element={<Tipo_Documento />} />
            <Route path="/register/tipo_documento" element={<Form_Tipo_Documento />} />
            <Route path="/generos" element={<Tipo_Documento />} />
            <Route path="/register/genero" element={<Form_Tipo_Documento />} />
            <Route path="/recreadores" element={<Recreadores />} />
            <Route path="/register/recreador" element={<Form_Recreadores />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/register/servicio" element={<Form_Servicios />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
