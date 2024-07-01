import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext.jsx";
import { getCookie } from "../../utils/cookie.jsx"



function ProtectedRouter({children}) {
  const { isAuthenticateds } = useAuthContext();
  const token = getCookie("token")

  if (isAuthenticateds && token) {
    return (children ? children : <Outlet />)

  } else {

    return <Navigate to="/" />
  }
}
export default ProtectedRouter