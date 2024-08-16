import Navbar from '../../components/navbar/Navbar.jsx';
import { useState, useEffect } from 'react';

import { useAuthContext } from '../../context/AuthContext.jsx';
import useInactivity from '../../context/useInactivity.jsx';
import { ButtonSimple } from "../../components/button/Button.jsx"
import { respaldo } from "../../utils/API.jsx"
import { Link } from 'react-router-dom';

function Configuracion() {
    return (
        <Navbar name="Configuración y Administración">
            <div className='div-main px-3 px-md-4 px-lg-5 py-3'>
                <h2 className='mb-3'>Lista de Opciones</h2>
                <ul class="list-group w-100 list-group-flush">
                    <li className='list-group-item p-0 d-flex border-top'><Link to="/dolar/" class="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary">Dolar</Link></li>
                    <li className='list-group-item p-0 d-flex'><Link to="/cargos/" class="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary">Cargos</Link></li>
                    <li className='list-group-item p-0 d-flex'><Link to="/tipo_documentos/" class="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary">Tipo Documento</Link></li>
                    <li className='list-group-item p-0 d-flex'><Link to="/generos/" class="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary">Generos</Link></li>
                    <li className='list-group-item p-0 d-flex border-bottom'><Link to="/metodos_pago/" class="text-decoration-none text-dark w-100 py-2 px-4  link-action-secundary">Metodos de Pago</Link></li>
                </ul>
            </div>
        </Navbar>
    )
}

export default Configuracion