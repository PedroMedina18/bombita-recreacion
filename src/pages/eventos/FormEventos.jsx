import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LoaderCircle } from "../../components/loader/Loader.jsx";
import { Toaster } from "sonner";
import { ButtonSimple } from "../../components/button/Button.jsx";
import { useFormEventContext } from "../../context/FormEventContext.jsx";
import { IconRowLeft } from "../../components/Icon.jsx";
import Navbar from "../../components/navbar/Navbar.jsx"
import ErrorSystem from "../../components/errores/ErrorSystem.jsx";
import texts from "../../context/text_es.js";

function FormEventos() {
    const navigate = useNavigate();
    const { loading } = useFormEventContext()
    useEffect(()=>{
        document.title="Registro de Eventos - Bombita Recreación "
    },[])
    return (
        <Navbar name={`${texts.pages.registerEventos.name}`} descripcion={`${texts.pages.registerEventos.description}`}>
            <ButtonSimple type="button" className="mb-2" onClick={() => { navigate("/eventos/") }}> <IconRowLeft /> Regresar</ButtonSimple>

            {
                false ?
                    (
                        <div className="div-main justify-content-center p-4" >
                            <LoaderCircle />
                        </div>
                    )
                    :
                    (
                        //* Sección Principal

                        <div className="div-main justify-content-between px-3 px-md-4 px-lg-5 py-3">
                            <Outlet />
                        </div>
                    )
            }
            <Toaster />
        </Navbar >
    )
}

export default FormEventos