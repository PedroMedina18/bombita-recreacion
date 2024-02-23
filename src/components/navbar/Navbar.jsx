import "./navbar.css"
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from "react-router-dom"
import bombita from "../../assets/bomb.png"

function Navbar({ children, name, descripcion }) {
    const { getUser, closeSession } = useContext(AuthContext)
    const [dataUser] = useState(getUser())
    const startDate = new Date(dataUser.fecha);
    const navigate = useNavigate();

    return (
        <div className='d-flex'>
            <aside className="sidebar" id="sidebar">
                <div className="d-flex">
                    <button className="toggle-btn" type="button"
                        onClick={() => {
                            document.querySelector("#sidebar").classList.toggle("expand");
                            document.querySelector("#main-top").classList.toggle("expand-main");
                            document.querySelector("#barra-superior").classList.toggle("expand-barra");
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm5 2h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm1-6h4v4h-4V5zM3 20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6zm2-5h4v4H5v-4zm8 5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6zm2-5h4v4h-4v-4z"></path></svg>
                    </button>
                </div>
                <ul className="sidebar-nav">
                    <li className="sidebar-item">
                        <Link to="/inicio" className="sidebar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path></svg>
                            <span>Inicio</span>
                        </Link>
                    </li>

                    <li className="sidebar-item">
                        <Link to="/usuarios" className="sidebar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z"></path><path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z"></path></svg>
                            <span>Usuarios</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 4H5V5h14zM5 11h8v8H5v-8zm10 8v-8h4.001l.001 8H15z"></path></svg>
                            <span>Eventos</span>
                        </a>
                    </li>

                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#servicios" aria-expanded="false" aria-controls="servicios">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7a8.44 8.44 0 0 0-5 1.31c-.36-.41-.73-.82-1.12-1.21l-.29-.27.14-.12a3.15 3.15 0 0 0 .9-3.49A3.9 3.9 0 0 0 14 1v2a2 2 0 0 1 1.76 1c.17.4 0 .84-.47 1.31l-.23.21a16.71 16.71 0 0 0-3.41-2.2c-2.53-1.14-3.83-.61-4.47 0a2.18 2.18 0 0 0-.46.68l-.18.53L5.1 8.87C6.24 11.71 9 16.76 15 18.94l5-1.66a1 1 0 0 0 .43-.31l.21-.18c1.43-1.44.51-4.21-1.41-6.9A6.63 6.63 0 0 1 23 9zm-3.79 8.37h-.06c-.69.37-3.55-.57-6.79-3.81-.34-.34-.66-.67-.95-1-.1-.11-.19-.23-.29-.35l-.53-.64-.28-.39c-.14-.19-.28-.38-.4-.56s-.16-.26-.24-.39-.22-.34-.31-.51-.13-.24-.19-.37-.17-.28-.23-.42-.09-.23-.14-.34-.11-.27-.15-.4S8.6 6 8.58 5.9s-.06-.24-.08-.34a2 2 0 0 1 0-.24 1.15 1.15 0 0 1 0-.26l.11-.31c.17-.18.91-.23 2.23.37a13.83 13.83 0 0 1 2.49 1.54A4.17 4.17 0 0 1 12 7v2a6.43 6.43 0 0 0 3-.94l.49.46c.44.43.83.86 1.19 1.27A5.31 5.31 0 0 0 16 13.2l2-.39a3.23 3.23 0 0 1 0-1.14c1.29 1.97 1.53 3.39 1.21 3.7zM4.4 11l-2.23 6.7A3.28 3.28 0 0 0 5.28 22a3.21 3.21 0 0 0 1-.17l6.52-2.17A18.7 18.7 0 0 1 4.4 11z"></path></svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="m21.706 5.291-2.999-2.998A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.291A.994.994 0 0 0 2 5.999V19c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5.999a.994.994 0 0 0-.294-.708zM6.414 4h11.172l.999.999H5.415L6.414 4zM4 19V6.999h16L20.002 19H4z"></path><path d="M15 12H9v-2H7v4h10v-4h-2z"></path></svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.715 12c1.151 0 2-.849 2-2s-.849-2-2-2-2 .849-2 2 .848 2 2 2z"></path><path d="M20 4H4c-1.103 0-2 .841-2 1.875v12.25C2 19.159 2.897 20 4 20h16c1.103 0 2-.841 2-1.875V5.875C22 4.841 21.103 4 20 4zm0 14-16-.011V6l16 .011V18z"></path><path d="M14 9h4v2h-4zm1 4h3v2h-3zm-1.57 2.536c0-1.374-1.676-2.786-3.715-2.786S6 14.162 6 15.536V16h7.43v-.464z"></path></svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H6a2 2 0 0 0-2 2v3H2v2h2v2H2v2h2v2H2v2h2v3a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-8 2.999c1.648 0 3 1.351 3 3A3.012 3.012 0 0 1 13 11c-1.647 0-3-1.353-3-3.001 0-1.649 1.353-3 3-3zM19 18H7v-.75c0-2.219 2.705-4.5 6-4.5s6 2.281 6 4.5V18z"></path></svg>
                            <span>Clientes</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v17a1 1 0 0 0 1 1h17v-2H5V3H3z"></path><path d="M15.293 14.707a.999.999 0 0 0 1.414 0l5-5-1.414-1.414L16 12.586l-2.293-2.293a.999.999 0 0 0-1.414 0l-5 5 1.414 1.414L13 12.414l2.293 2.293z"></path></svg>
                            <span>Estadisticas</span>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href="#" className="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#configuracion" aria-expanded="false" aria-controls="configuracion">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.084 0 2 .916 2 2s-.916 2-2 2-2-.916-2-2 .916-2 2-2z"></path><path d="m2.845 16.136 1 1.73c.531.917 1.809 1.261 2.73.73l.529-.306A8.1 8.1 0 0 0 9 19.402V20c0 1.103.897 2 2 2h2c1.103 0 2-.897 2-2v-.598a8.132 8.132 0 0 0 1.896-1.111l.529.306c.923.53 2.198.188 2.731-.731l.999-1.729a2.001 2.001 0 0 0-.731-2.732l-.505-.292a7.718 7.718 0 0 0 0-2.224l.505-.292a2.002 2.002 0 0 0 .731-2.732l-.999-1.729c-.531-.92-1.808-1.265-2.731-.732l-.529.306A8.1 8.1 0 0 0 15 4.598V4c0-1.103-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.598a8.132 8.132 0 0 0-1.896 1.111l-.529-.306c-.924-.531-2.2-.187-2.731.732l-.999 1.729a2.001 2.001 0 0 0 .731 2.732l.505.292a7.683 7.683 0 0 0 0 2.223l-.505.292a2.003 2.003 0 0 0-.731 2.733zm3.326-2.758A5.703 5.703 0 0 1 6 12c0-.462.058-.926.17-1.378a.999.999 0 0 0-.47-1.108l-1.123-.65.998-1.729 1.145.662a.997.997 0 0 0 1.188-.142 6.071 6.071 0 0 1 2.384-1.399A1 1 0 0 0 11 5.3V4h2v1.3a1 1 0 0 0 .708.956 6.083 6.083 0 0 1 2.384 1.399.999.999 0 0 0 1.188.142l1.144-.661 1 1.729-1.124.649a1 1 0 0 0-.47 1.108c.112.452.17.916.17 1.378 0 .461-.058.925-.171 1.378a1 1 0 0 0 .471 1.108l1.123.649-.998 1.729-1.145-.661a.996.996 0 0 0-1.188.142 6.071 6.071 0 0 1-2.384 1.399A1 1 0 0 0 13 18.7l.002 1.3H11v-1.3a1 1 0 0 0-.708-.956 6.083 6.083 0 0 1-2.384-1.399.992.992 0 0 0-1.188-.141l-1.144.662-1-1.729 1.124-.651a1 1 0 0 0 .471-1.108z"></path></svg>
                            <span>Configuración</span>
                        </a>
                        <ul id="configuracion" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                            <li className="sidebar-item">
                                <Link to="/cargos" className="sidebar-link">Cargos</Link>
                            </li>
                            <li className="sidebar-item">
                                <Link to="/tipo_documentos" className="sidebar-link">Tipo Documento</Link>
                            </li>
                        </ul>
                    </li>
                    <li className="sidebar-item"
                        onClick={() => {
                            closeSession()
                            navigate("/")
                        }}>
                        <p className="sidebar-link" >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>
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
            </aside>
            <main className="d-flex flex-column w-100" id="main">

                <div className="barra-superior" id="barra-superior">
                    <Link to="/inicio" className="sidebar-logo">
                        <img src={bombita} alt="bombita" />
                        <div>
                            <span>Bombitas <br />Recreación</span>
                        </div>
                    </Link>
                    <div className="user ms-2">
                        <p className="m-0 me-1 text-center inline-block">{dataUser.nombre}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10.13 10.13 0 0 0 2 12a10 10 0 0 0 4 7.92V20h.1a9.7 9.7 0 0 0 11.8 0h.1v-.08A10 10 0 0 0 22 12 10.13 10.13 0 0 0 12 2zM8.07 18.93A3 3 0 0 1 11 16.57h2a3 3 0 0 1 2.93 2.36 7.75 7.75 0 0 1-7.86 0zm9.54-1.29A5 5 0 0 0 13 14.57h-2a5 5 0 0 0-4.61 3.07A8 8 0 0 1 4 12a8.1 8.1 0 0 1 8-8 8.1 8.1 0 0 1 8 8 8 8 0 0 1-2.39 5.64z"></path><path d="M12 6a3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4zm0 6a1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2 1.91 1.91 0 0 1-2 2z"></path></svg>
                    </div>
                </div>
                
                <div className="main" id="main-top">
                    <div className="d-flex flex-column-reverse flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="d-flex flex-column">
                            <h1 className="name-page m-0">{name}</h1>
                            <p className="descripcion-page">{descripcion}</p>
                        </div>
                        <span className="span-fecha mb-2 mb-md-0">Inicio de sesión {startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()}-{(startDate.getMonth() + 1) < 10 ? `0${startDate.getMonth() + 1}` : startDate.getMonth() + 1}-{startDate.getFullYear()} a las {startDate.getHours() < 10 ? `0${startDate.getHours()}` : startDate.getHours()}:{startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}:{startDate.getSeconds() < 10 ? `0${startDate.getSeconds()}` : startDate.getSeconds()}</span>
                    </div>

                    <hr />

                    {children}
                </div>
            </main>
        </div>
    )
}

export default Navbar