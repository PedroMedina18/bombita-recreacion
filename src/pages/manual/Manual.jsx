import { useEffect } from 'react'
import texts from "../../context/text_es.js";
import { Toaster } from "sonner";
import Navbar from "../../components/navbar/Navbar.jsx";
import interfaz_1 from "../../assets/manual/interfaz-1.jpg"
import interfaz_2 from "../../assets/manual/interfaz-2.jpg"
import interfaz_3 from "../../assets/manual/interfaz-3.jpg"
import interfaz_4 from "../../assets/manual/interfaz-4.jpg"
import interfaz_5 from "../../assets/manual/interfaz-5.jpg"
import interfaz_6 from "../../assets/manual/interfaz-6.jpg"
import interfaz_7 from "../../assets/manual/interfaz-7.jpg"
import interfaz_8 from "../../assets/manual/interfaz-8.jpg"
import interfaz_9 from "../../assets/manual/interfaz-9.jpg"
import interfaz_10 from "../../assets/manual/interfaz-10.jpg"
import interfaz_11 from "../../assets/manual/interfaz-11.jpg"
import interfaz_12 from "../../assets/manual/interfaz-12.jpg"
import interfaz_13 from "../../assets/manual/interfaz-13.jpg"
import interfaz_14 from "../../assets/manual/interfaz-14.jpg"
import interfaz_15 from "../../assets/manual/interfaz-15.jpg"
import interfaz_16 from "../../assets/manual/interfaz-16.jpg"
import interfaz_17 from "../../assets/manual/interfaz-17.jpg"
import interfaz_18 from "../../assets/manual/interfaz-18.jpg"
import interfaz_19 from "../../assets/manual/interfaz-19.jpg"
import interfaz_20 from "../../assets/manual/interfaz-20.jpg"
import interfaz_21 from "../../assets/manual/interfaz-21.jpg"
import interfaz_22 from "../../assets/manual/interfaz-22.jpg"
import interfaz_23 from "../../assets/manual/interfaz-23.jpg"
import interfaz_24 from "../../assets/manual/interfaz-24.jpg"
import interfaz_25 from "../../assets/manual/interfaz-25.jpg"
import interfaz_26 from "../../assets/manual/interfaz-26.jpg"
import interfaz_27 from "../../assets/manual/interfaz-27.jpg"
import interfaz_28 from "../../assets/manual/interfaz-28.jpg"
import interfaz_29 from "../../assets/manual/interfaz-29.jpg"
import interfaz_30 from "../../assets/manual/interfaz-30.jpg"
import interfaz_31 from "../../assets/manual/interfaz-31.jpg"
import interfaz_32 from "../../assets/manual/interfaz-32.jpg"
import interfaz_33 from "../../assets/manual/interfaz-33.jpg"
import interfaz_34 from "../../assets/manual/interfaz-34.jpg"


function Manual() {
  useEffect(()=>{
    document.title="Manual de interfaces"
  }, [])
  return (
    <Navbar name={texts.pages.manual.name} descripcion={texts.pages.manual.description} dollar={false}>

        <div className='div-main  py-3 w-100 d-flex flex-column justify-content-center align-items-center gap-4'>
            <CardImg
            title={"Login"}
            img={interfaz_1}
            text={"En esta interfaz se ingresa el usuario con su respectiva contraseña para poder entrar al sistema automatizado, de no saber la contraseña o el usuario del mismo, no permitirá el acceso y deberá contactar con el administrador. Para ingresar al sistema si el usuario es olvidado, se contará con un super usuario el cual estará adjuntado en el manual del sistema."}
            key="interfaz-1"
            />
            <CardImg
            title={"Inicio"}
            img={interfaz_2}
            text={"Es la interfaz inmediata que el usuario visualizara al iniciar sesión, en la que se muestra la interfaz principal y los distintos módulos del sistema al lado izquierdo, un calendario con los eventos a ejecutar los cuales ya cuente como mínimo con el anticipo cancelado."}
            key="interfaz-2"
            />
            <CardImg
            title={"Lista de Usuarios"}
            img={interfaz_3}
            text={"Lista de todos los usuarios del sistema junto a su estado y las opciones para cambiar contraseña, mostrar su información y editar sus datos."}
            key="interfaz-3"
            />
            <CardImg
            title={"Formualrio de Usuarios"}
            img={interfaz_4}
            text={"Formulario para registrar y editar los datos de un usuario en el sistema, presenta los campos necesarios como nombre de usuario, teléfono principal y secundario, contraseña, cargo, entre otros con sus validaciones al dar en el botón de registrar pide confirmación y si no se presenta ningún problema se efectúa el registro en el sistema."}
            key="interfaz-4"
            />
            <CardImg
            title={"Cambio de Contraseña"}
            img={interfaz_5}
            text={"Formulario para actualizar la contraseña de un usuario, se debe completar las condiciones solicitadas para mayor seguridad."}
            key="interfaz-5"
            />
            <CardImg
            title={"Lista de Eventos"}
            img={interfaz_6}
            text={"Presenta una lista de los últimos eventos registrados, junto a las opciones para agregar nuevos eventos, para asignar los recreadores y registrar los pagos, también se muestra la opción para el calendario de eventos y para filtrarlos."}
            key="interfaz-6"
            />
            <CardImg
            title={"Modal para cancelar evento"}
            img={interfaz_7}
            text={"Modal donde se describe el motivo por el que un evento se cancela, la misma se presenta después de confirmar la solicitud para cancelar evento."}
            key="interfaz-7"
            />
            <CardImg
            title={"Formulario de Eventos Primera Sesión"}
            img={interfaz_8}
            text={"Formulario para registrar eventos se selecciona el cliente se agrega la fecha del evento, la dirección y el número de asistentes. "}
            key="interfaz-8"
            />
            <CardImg
            title={"Formulario de Eventos - Clientes"}
            img={interfaz_9}
            text={"Al dar click en el check de nuevo cliente se desplegar el formulario para registrar un nuevo cliente si este no está en el sistema, se deben completar los datos solicitados como nombres, apellidos número de documento, teléfono y correo."}
            key="interfaz-9"
            />
            <CardImg
            title={"Formulario de Eventos – Servicios y sobrecostos"}
            img={interfaz_10}
            text={"Al completar el primer formulario, está la sesión para agregar los servicios y sobrecostos que se suman al evento al mismo tiempo muestra su cotización en precio referencial y en bolívares a tasa BCV."}
            key="interfaz-10"
            />
            <CardImg
            title={"Modal de Servicios"}
            img={interfaz_11}
            text={"Al dar click en el botón de servicios, se despliega el modal con los servicios registrados en el sistema, se seleccionan los que se van agregar y se dan click en el botón para que se sumen al evento."}
            key="interfaz-11"
            />
            <CardImg
            title={"Modal de Sobrecostos"}
            img={interfaz_12}
            text={"Al dar click en el botón de sobrecostos, se despliega el modal con los sobrecostos registrados en el sistema, se seleccionan los que se van agregar y se dan click en el botón para que se sumen al evento, a diferencia de los servicios estos no son obligatorios."}
            key="interfaz-12"
            />
            <CardImg
            title={"Asignar Recreadores"}
            img={interfaz_13}
            text={"Interfaz para asignar los recreadores que asistirán al evento, se muestra la información básica del mismo, el número de recreadores varía dependiendo del servicio asignado, de igual forma se debe completar el total de recreadores que asistirán, estos no pueden estar repetidos, inhabilitados, ni estar en otro evento a la misma hora."}
            key="interfaz-13"
            />
            <CardImg
            title={"Evento"}
            img={interfaz_14}
            text={"Interfaz gráfica de Evento, se muestra toda la información registrada del evento como sus pagos, las recreadores asignados, que servicios y sobrecostos tiene, además de la opción para evaluar, cancelar y completar."}
            key="interfaz-14"
            />
            <CardImg
            title={"Evaluación de Evento"}
            img={interfaz_15}
            text={"Formulario para evaluar un evento, en el mismo se clasifica una serie de preguntas que deben ser evaluadas en una puntuación sobre cinco además de agregar una opinión descriptiva del evento."}
            key="interfaz-15"
            />
            <CardImg
            title={"Lista de Clientes"}
            img={interfaz_16}
            text={"Lista de todos los clientes registrados en el sistema junto con las opciones para editar y visualizar su información."}
            key="interfaz-16"
            />
            <CardImg
            title={"Formulario de clientes"}
            img={interfaz_17}
            text={"Formulario para editar la información de un cliente en caso de que esta se incorrecta o se quiera actualizar."}
            key="interfaz-17"
            />
            <CardImg
            title={"Cliente"}
            img={interfaz_18}
            text={"Interfaz que muestra la información del cliente solicitada, junto con los eventos asociados al mismo."}
            key="interfaz-18"
            />
            <CardImg
            title={"Lista de Recreadores"}
            img={interfaz_19}
            text={"Presenta una lista de los recreadores registrados en el sistema junto a los datos básicos del mismo, presenta las opciones para agregar nuevos recreadores, eliminarlos o editar la información registrada."}
            key="interfaz-19"
            />
            <CardImg
            title={"Formulario Recreador"}
            img={interfaz_20}
            text={"Formulario para registrar o editar un recreador, presenta los campos de nombre, apellido número de documento, el nivel, genero, entre otros; cada campo presenta sus validaciones para asegurar la confiabilidad de la información."}
            key="interfaz-20"
            />
            <CardImg
            title={"Recreadores"}
            img={interfaz_21}
            text={"Presenta toda la información registrar del recreador al igual que un calendario con los eventos en los que se encuentra asignado."}
            key="interfaz-21"
            />
            <CardImg
            title={"Lista de Servicios"}
            img={interfaz_22}
            text={"Presenta una lista de los servicios registrados en el sistema junto a los datos básicos del mismo, presenta las opciones para agregar nuevos servicios, eliminarlos o editar la información registrada."}
            key="interfaz-22"
            />
            <CardImg
            title={"Formulario de Servicios"}
            img={interfaz_23}
            text={"Formulario para registrar o editar un servicio, presenta los campos de nombre, duración número de recreadores, el precio entre otros cada campo presenta sus validaciones para asegurar la confiabilidad de la información."}
            key="interfaz-23"
            />
            <CardImg
            title={"Modal para Eliminar un Elemento"}
            img={interfaz_24}
            text={"Modal de confirmación para eliminar algún elemento del sistema, esta petición puede ser denegada si no cuenta con los permisos o por que no se puede eliminar el registro al estar asociado con otro registro en el sistema."}
            key="interfaz-24"
            />
            <CardImg
            title={"Lista de Cargos"}
            img={interfaz_25}
            text={"Presenta una lista de los cargos registrados en el sistema junto a su información, presenta las opciones para agregar nuevos cargos, eliminarlos o editar la información registrada."}
            key="interfaz-25"
            />
            <CardImg
            title={"Formulario de Cargos"}
            img={interfaz_26}
            text={"Formulario para registrar o editar un cargo, presenta los campos de nombre, descripción que permisos posee o si es administrador."}
            key="interfaz-26"
            />
            <CardImg
            title={"Lista de Materiales"}
            img={interfaz_27}
            text={"Presenta la lista de los materiales registrados en el sistema junto a su información, la opción para acceder a sus registros de inventario y la cantidad actual que se encuentra en el almacén."}
            key="interfaz-27"
            />
            <CardImg
            title={"Formulario de Materiales"}
            img={interfaz_28}
            text={"Formulario de registro para agregar nuevos materiales al sistema, al completar su nombre la cantidad actual guardad y una descripción del material."}
            key="interfaz-28"
            />
            <CardImg
            title={"Registro de Inventario"}
            img={interfaz_29}
            text={"Presenta los registros de inventario de un material determinado en donde estos se clasifican en la cantidad inicial, cuando se agregan nuevas cantidades y cuando se restan al dañarse o utilizarse."}
            key="interfaz-29"
            />
            <CardImg
            title={"Modal para nuevo Registro de Inventario"}
            img={interfaz_30}
            text={"Modal para agregar un nuevo registro de inventario de un material determinado este puede ser sumar nuevas cantidades o restar una cantidad determinada, se debe agregar una descripción detallada."}
            key="interfaz-30"
            />
            <CardImg
            title={"Configuración"}
            img={interfaz_31}
            text={"Interfaz para configurar algunas opciones del sistema como los tipos de documentos, los géneros, la lista de precios de dólar las preguntas del formulario o para efectuar respaldo."}
            key="interfaz-31"
            />
            <CardImg
            title={"Lista de precio dólar"}
            img={interfaz_32}
            text={"Lista con los precios del dólar registrados en el sistema."}
            key="interfaz-32"
            />
            <CardImg
            title={"Lista de preguntas"}
            img={interfaz_33}
            text={"Lista de las preguntar que se presentan en el formulario para evaluar un evento."}
            key="interfaz-33"
            />
            <CardImg
            title={"Estadísticas"}
            img={interfaz_34}
            text={"Interfaz que muestra las diferentes estadísticas del sistema."}
            key="interfaz-34"
            />
        </div>  
      <Toaster />
    </Navbar>
  )
}


function CardImg({title, img, text}) {
  return(
    <div className="card w-100 w-md-60">
      <h5 className="card-title h3 fw-bold">{title}</h5>
    <img src={img} className="card-img-top" alt="..." />
    <div className="card-body">
      <p className="card-text">{text}</p>
    </div>
  </div>
  )
}
export default Manual