import { Outlet, Navigate } from 'react-router-dom'
import { useContext, } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { getCookie } from "../../js/cookie.js"

function ProtectedRouter({children}) {
  const { isAuthenticateds } = useContext(AuthContext)
  const token = getCookie("token")

  if (isAuthenticateds && token) {
    return (children ? children : <Outlet />)

  } else {

    return <Navigate to="/" />
  }
}
export default ProtectedRouter