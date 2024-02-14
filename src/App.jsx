import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Error404 from './pages/Error404';
import Inicio from './pages/Inicio';
import Cargos from "./pages/cargos/Cargos";
import Form_Cargos from "./pages/cargos/Form_Cargos"
import Tipo_Documento from "./pages/tipoDocumento/Tipo_Documento";
import Form_Tipo_Documento from "./pages/tipoDocumento/Form_Tipo_Documento";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import Usuarios from "./pages/usuarios/Usuarios";
import Actividades from "./pages/actividades/Actividades";
import Form_Actividades from "./pages/actividades/Form_Actividades";
import Recreadores from "./pages/recreadores/Recreadores"
import Niveles from "./pages/niveles/Niveles";
import Form_Niveles from "./pages/niveles/Form_Niveles";
import Form_Recreadores from "./pages/recreadores/Form_Recreadores";

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
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/register/actividad" element={<Form_Actividades />} />
            <Route path="/niveles" element={<Niveles />} />
            <Route path="/register/nivel" element={<Form_Niveles />} />
            <Route path="/tipo_documentos" element={<Tipo_Documento />} />
            <Route path="/register/tipo_documento" element={<Form_Tipo_Documento />} />
            <Route path="/recreadores" element={<Recreadores />} />
            <Route path="/register/recreadores" element={<Form_Recreadores />} />
            <Route path="/inicio" element={<Inicio />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
