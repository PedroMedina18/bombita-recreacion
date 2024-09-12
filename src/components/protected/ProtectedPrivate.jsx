import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useContext, useEffect } from "react";
import { getCookie } from "../../utils/cookie.jsx"
import { useAuthContext } from "../../context/AuthContext.jsx";
import { toastError } from "../alerts.jsx"

function ProtectedPrivate({ children, permisos=[] }) {
    const { isAuthenticateds, getPermisos } = useAuthContext();
    const token = getCookie("token")

    if (isAuthenticateds && token) {
        if (getPermisos().administrador || permisos.some(id => getPermisos().permisos.includes(id))) {

            return (children ? children : <Outlet />)

        } else {
            toastError("No Tiene los permisos requeridos")
            return <Navigate to="/inicio"/>
        }
    } else {
        return <Navigate to="/"/>
    }
}

export default ProtectedPrivate