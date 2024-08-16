import Swal from 'sweetalert2';
import { toast } from "sonner";
import { formatDateWithTime12Hour, formatoId } from "../utils/process.jsx"
import { cargos } from "../utils/API.jsx"

export const alertConfim = async (title, text) => {
    return Swal.fire({
        title: `${title}`,
        text: `${text}`,
        color: "black",
        iconColor: "rgb(var(--info))",
        customClass: {
            title: "h1 fw-bold text-black",
            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
            cancelButton: "px-5 py-3 mx-3 fs-6 fw-bold"
        },
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "rgb(var(--secundario))",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "rgb(var(--principal))",
        width: "60%",
        allowOutsideClick: false,
    })
}

export const alertAceptar = async (title, text) => {
    return Swal.fire({
        title: `${title}`,
        text: `${text}`,
        color: "black",
        iconColor: "rgb(var(--exito))",
        customClass: {
            title: "h1 fw-bold text-black",
            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
        },
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "rgb(var(--principal))",
        width: "70%",
        allowOutsideClick: false,
    })
}

export const alerError = async (title, text) => {
    return Swal.fire({
        title: `${title}`,
        text: `${text}`,
        color: "black",
        iconColor: "rgb(var(--error))",
        customClass: {
            title: "h1 fw-bold text-black",
            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
        },
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "rgb(var(--principal))",
        width: "50%",
    })
}




export const alertInfo = async (title, data) => {
    let datos=""
    Object.keys(data).forEach(key => {
        datos = datos + `<p class="m-0 mb-2 text-start"><b>${key.replace(/\_/g, ' ').replace(/\b\w/g, match => match.toUpperCase())}: </b>${data[key]}</p>`
    });

    return Swal.fire({
        title: `${title}`,
        showCloseButton: true,
        color: "black",
        html: `
        <div class='p-2 d-flex flex-column justify-content-start align-items-start'>
            ${datos}
        </div>
        `,
        customClass: {
            title: "h1 fw-bold text-black",
            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
        },
        confirmButtonText: "Aceptar",
        confirmButtonColor: "rgb(var(--principal))",
        showCancelButton: false,
        width: "50%",
        allowOutsideClick: true,
    })
}

export const alertLoading = async (message) => {
    return Swal.fire({
        title: `${message}`,
        width: "70%",
        padding: "40px",
        allowOutsideClick: false,
        confirmButtonText: "Aceptar",
        customClass: {
            title: "title-loader",
            popup: "container-loader",
            loader: "loader"
        },
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

export const toastError = (mensage) => {
    return toast(`${mensage}`, {
        duration: 6000,
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>,
        cancel: {
            label: 'X'
        },
        unstyled: true,
        classNames: {
            toast: 'toast-alert toast-error',
            title: 'title-toast text-white',
            cancelButton: 'button-toast',
        },
    })
}

export const alertInactividad = async (title, text, titleButton, callback)=>{
    return Swal.fire({
        title: `${title}`,
        text: `${text}`,
        color: "black",
        timer: 5 * 60 * 1000,
        timerProgressBar: true,
        customClass: {
            title: "h2 fw-bold text-black",

            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
        },
        icon:"warning",
        confirmButtonText: `${titleButton}`,
        confirmButtonColor: "rgb(var(--principal))",
        width: "70%",
        allowOutsideClick: false,
        
    }).then((result) => {
          if (result.isDismissed) {
            callback()
          }
    });
}
