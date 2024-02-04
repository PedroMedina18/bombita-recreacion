import Swal from 'sweetalert2';
import { toast } from "sonner";

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
        width: "90%",
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
        width: "90%",
        allowOutsideClick: false,
    })
}
export const alertLoading = async (message) => {
    return Swal.fire({
        title:`${message}`,
        width: "70%",
        padding:"40px",
        allowOutsideClick: false,
        customClass: {
            title: "title-loader",
            popup:"container-loader",
            loader:"loader"
        },
        didOpen: () => {
            Swal.showLoading();
        }
   });
}

export const toastError = (mensage, icon) => {
    return toast(`${mensage}`, {
        duration: 6000,
        icon: icon,
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

