import { IconConfig } from "../../components/Icon.jsx";
import { respaldo } from '../../utils/API.jsx'
import { controlErrors } from '../../utils/actions.jsx'
import { alertLoading, alertAceptar, toastError } from "../../components/alerts.jsx";
import { Toaster } from "sonner";
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar.jsx';
import Swal from 'sweetalert2';

function Configuracion() {
    const ejecutarRespaldo=async()=>{
        try{
            alertLoading("Cargado...")
            const respuesta=await respaldo.get()
            if(controlErrors({respuesta:respuesta, constrolError:toastError})) {Swal.close(); return}
            Swal.close()
            alertAceptar("Exito","Respaldo Completado")
        }catch (erorr){
            Swal.close()
            toastError(erorr)
        }
    }
    return (
        <Navbar name="Configuración y Administración" dollar={false}>
            <div className='div-main px-3 px-md-4 px-lg-5 py-3'>
                <h2 className='mb-4 fw-bold'>Lista de Opciones</h2>
                <ul className="list-group w-100 list-group-flush">
                    <li className='list-group-item p-0 d-flex border-top'>
                        <Link to="/dolar/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Dolar</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex'>
                        <Link to="/cargos/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Cargos</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex'>
                        <Link to="/tipo_documentos/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Tipo Documento</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex'>
                        <Link to="/generos/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Generos</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex border-bottom'>
                        <Link to="/metodos_pago/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Metodos de Pago</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex'>
                        <Link to="/preguntas/" className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary"><span><IconConfig/></span>Preguntas</Link>
                    </li>
                    <li className='list-group-item p-0 d-flex border-bottom'>
                        <button  onClick={()=>{ejecutarRespaldo()}} className="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary border border-0 text-start "><span><IconConfig/></span>Respaldo</button>
                    </li>
                </ul>
            </div>
            <Toaster/>
        </Navbar>
    )
}

export default Configuracion