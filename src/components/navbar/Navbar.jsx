import "./navbar.css"
import bombita from "../../assets/bomb.png"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { alertConfim } from '../../utils/alerts.jsx'
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
    IconUser,
    IconUserCircle,
    IconExit

} from "../../components/Icon.jsx"

function Navbar({ children, name, descripcion }) {
    const { getUser, closeSession } = useContext(AuthContext)
    const [dataUser] = useState(getUser())
    const startDate = new Date(dataUser.fecha);
    const navigate = useNavigate();

    return (
        <main className='d-flex'>

            {/* Ventana lateral izquierda del menu */}
            <nav className="sidebar" id="sidebar">

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
                        <Link to="/inicio" className="sidebar-link">
                            <IconHome />
                            <span>Inicio</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/usuarios" className="sidebar-link">
                            <IconUser />
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
                                <Link to="/register/eventos" className="sidebar-link">Agregar un Evento</Link>
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
                                <Link to="/actividades" className="sidebar-link">Actividades</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/servicios" className="sidebar-link">Servicios</Link>
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
                                <Link to="/materiales" className="sidebar-link">Materiales</Link>
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
                                <Link to="/niveles" className="sidebar-link">Niveles</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/recreadores" className="sidebar-link">Recreadores</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <IconClient />
                            <span>Clientes</span>
                        </a>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <IconEstadistica />
                            <span>Estadisticas</span>
                        </a>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#configuracion" aria-expanded="false" aria-controls="configuracion">
                            <IconConfig />
                            <span>Configuración</span>
                        </a>
                        <ul id="configuracion" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/cargos" className="sidebar-link">Cargos</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/tipo_documentos" className="sidebar-link">Tipo Documento</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/generos" className="sidebar-link">Generos</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-item"
                        onClick={async() => {
                            const confirmacion = await alertConfim("Confirmar", texts.confirmMessage.confirCloset)
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

                    {/* <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#auth" aria-expanded="false" aria-controls="auth">
                            <i className="lni lni-protection"></i>
                            <span>Auth</span>
                        </a>
                        <ul id="auth" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Login</a>
                            </li>
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link">Register</a>
                            </li>
                        </ul>
                    </li> */}
                    {/* <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#multi" aria-expanded="false" aria-controls="multi">
                            <i className="lni lni-layout"></i>
                            <span>Multi Level</span>
                        </a>
                        <ul id="multi" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <a href="#" className="sidebar-link collapsed" data-bs-toggle="collapse"
                                    data-bs-target="#multi-two" aria-expanded="false" aria-controls="multi-two">
                                    Two Links
                                </a>
                                <ul id="multi-two" className="sidebar-dropdown list-unstyled collapse">
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">Link 1</a>
                                    </li>
                                    <li className="sidebar-item">
                                        <a href="#" className="sidebar-link">Link 2</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li> */}

                </ul>
                {/* <div className="sidebar-footer">
                    <a href="#" className="sidebar-link">
                        <i className="lni lni-exit"></i>
                        <span>Logout</span>
                    </a>
                </div> */}
            </nav>

            {/* Ventana Derecha */}
            <section className="d-flex flex-column w-100" id="main">

                {/* Barra Superior */}
                <header className="barra-superior" id="barra-superior">
                    <Link to="/inicio" className="sidebar-logo">
                        <img src={bombita} alt="bombita" />
                        <div>
                            <span>Bombitas <br />Recreación</span>
                        </div>
                    </Link>
                    <div className="user ms-2">
                        <p className="m-0 me-1 text-center inline-block">{dataUser.nombre}</p>
                        <IconUserCircle />
                    </div>
                </header>


                <section className="main" id="main-top">
                    <div className="d-flex flex-column-reverse flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="d-flex flex-column">
                            <h1 className="fs-4 fw-bold m-0 pb-1">{name}</h1>
                            <p className="m-0 fw-light fs-6 colo">{descripcion}</p>
                        </div>
                        <span className="fw-normal fs-6 mb-2 mb-md-0 text-dark">Inicio de sesión {startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}-{(startDate.getMonth() + 1) < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-{startDate.getFullYear()} a las {startDate.getHours() < 10 ? `0${startDate.getHours()}` : startDate.getHours()}:{startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}:{startDate.getSeconds() < 10 ? `0${startDate.getSeconds()}` : startDate.getSeconds()}</span>
                    </div>

                    <hr className="invisible my-2"/>

                    {children}
                </section>
            </section>
            
        </main>
    )
}

export default Navbar