import "./navbar.css"
import bombita from "../../assets/logo-bombita.png"
// import LogoBombita from "../../assets/"
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { alertConfim } from '../alerts.jsx'
import { formatDateWithTime12Hour } from '../../utils/process.jsx'
import texts from "../../context/text_es"
import {
    IconHamburgue,
    IconHome,
    IconClient,
    IconConfig,
    IconEstadistica,
    IconEvent,
    IconInventario,
    IconRecreadores,
    IconService,
    IconUsers,
    IconUserCircle,
    IconExit

} from "../../components/Icon.jsx"

function Navbar({ children, name = null, descripcion = null, dollar = true }) {
    const { getUser, closeSession, getPermisos } = useAuthContext();
    const [dataUser] = useState(getUser());
    const [permisos] = useState(getPermisos())
    const navigate = useNavigate();

    return (
        <main className='d-flex'>

            {/* Ventana lateral izquierda del menu */}
            <nav className="sidebar" id="sidebar" 
            onClick={(e)=>{
                if(e.target === document.querySelector(".sidebar.expand")){
                    e.target.classList.remove('expand') 
                }
            }}>

                {/* Logo */}
                <div className="d-flex">
                    <button className="toggle-btn" type="button"
                        onClick={() => {
                            document.querySelector("#sidebar").classList.toggle("expand");
                            document.querySelector("#main-top").classList.toggle("expand-main");
                            document.querySelector("#barra-superior").classList.toggle("expand-barra");
                        }}>
                        <IconHamburgue />
                    </button>
                </div>

                {/* Lista de Links */}
                <ul className="sidebar-nav">

                    <li className="sidebar-item">
                        <Link to="/inicio/" className="sidebar-link">
                            <IconHome />
                            <span>Inicio</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/usuarios/" className="sidebar-link">
                            <IconUsers />
                            <span>Usuarios</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#eventos" aria-expanded="false" aria-controls="eventos">
                            <IconEvent />
                            <span>Eventos</span>
                        </a>
                        <ul id="eventos" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/eventos/" className="sidebar-link">Lista de Eventos</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/register/eventos/" className="sidebar-link">Agregar un Evento</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#servicios" aria-expanded="false" aria-controls="servicios">
                            <IconService />
                            <span>Servicios</span>
                        </a>
                        <ul id="servicios" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/actividades/" className="sidebar-link">Actividades</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/servicios/" className="sidebar-link">Servicios</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/sobrecargos/" className="sidebar-link">Sobrecargos</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#inventario" aria-expanded="false" aria-controls="inventario">
                            <IconInventario />
                            <span>Inventario</span>
                        </a>
                        <ul id="inventario" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/materiales/" className="sidebar-link">Materiales</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#recreadores" aria-expanded="false" aria-controls="recreadores">
                            <IconRecreadores />
                            <span>Recreadores</span>
                        </a>
                        <ul id="recreadores" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/niveles/" className="sidebar-link">Niveles</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/recreadores/" className="sidebar-link">Recreadores</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/clientes/" className="sidebar-link">
                            <IconClient />
                            <span>Clientes</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <IconEstadistica />
                            <span>Estadisticas</span>
                        </a>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/configuracion/" className="sidebar-link">
                            <IconConfig />
                            <span>Configuración</span>
                        </Link>
                    </li>

                    <li className="sidebar-item"
                        onClick={async () => {
                            const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirmCloset)
                            if (confirmacion.isConfirmed) {
                                closeSession()
                                navigate("/")
                            }
                        }}>
                        <p className="sidebar-link" >
                            <IconExit />
                            <span>Salir</span>
                        </p>
                    </li>
                </ul>
            </nav>

            {/* Ventana Derecha */}
            <section className="d-flex flex-column w-100 " id="main">

                {/* Barra Superior */}
                <header className="barra-superior" id="barra-superior">
                    <Link to="/inicio" className="sidebar-logo">
                        <img src={bombita} alt="bombita" />
                    </Link>
                    <div className="user ms-2">
                        <p className="m-0 me-1 text-center inline-block">{dataUser.nombre}</p>
                        {
                            permisos.img && permisos.img !=="" ?
                            <img className="icono-nav" src={permisos.img} alt="logo" />
                            :
                            <IconUserCircle />
                        }
                    </div>
                </header>


                <section className="main" id="main-top">
                    <div className="d-flex flex-column-reverse flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="d-flex flex-column">
                            {
                                name &&
                                <h1 className="fs-4 fw-bold m-0 pb-1">{name}</h1>
                            }
                            {
                                descripcion &&
                                <p className="m-0  fs-6 colo">{descripcion}</p>
                            }
                        </div>
                        {
                            dollar &&
                            <div className="d-flex flex-column">
                                <h1 className="fs-5 fw-bold m-0 pb-1">Precio del Dolar $</h1>
                                <p className="m-0 fs-6 ">{`${dataUser.dollar.price} Bs.S`}</p>
                            </div>
                        }
                        <span className="fw-bold fs-7 mb-2 mb-md-0 text-dark">Inicio de sesión {formatDateWithTime12Hour(dataUser.fecha)}</span>
                    </div>

                    <hr className="invisible my-2" />

                    {children}
                </section>
            </section>

        </main>
    )
}

export default Navbar