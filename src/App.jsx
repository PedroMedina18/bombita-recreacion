import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login/Login';
import Error404 from './pages/Error404';
import Inicio from './pages/Inicio';
import Cargos from "./pages/cargos/Cargos";
import Tipo_Documento from "./pages/tipoDocumento/Tipo_Documento";
import ProtectedRouter from "./components/protected/ProtectedRouter";
import Usuarios from "./pages/usuarios/Usuarios";
import Actividades from "./pages/actividades/Actividades";
import Niveles from "./pages/niveles/Niveles";
import Recreadores from "./pages/recreadores/Recreadores"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRouter />}>
            <Route path="/cargos" element={<Cargos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/niveles" element={<Niveles />} />
            <Route path="/tipo_documento" element={<Tipo_Documento />} />
            <Route path="/recreadores" element={<Recreadores />} />
            <Route path="/inicio" element={<Inicio />} />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
