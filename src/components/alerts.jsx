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
    return Swal.fire({
        title: `${title}`,
        showCloseButton: true,
        color: "black",
        html: `
        <div class='p-2 d-flex flex-column justify-content-start align-items-start'>
            <p class="m-0 mb-2 text-start"><b>Codigo: </b>${formatoId(data.id)}</p>
            <p class="m-0 mb-2 text-start"><b>Descripción: </b>${data.descripcion}</p>
            <p class="m-0 mb-2 text-start"><b>Fecha de Registro: </b>${formatDateWithTime12Hour(data.fecha_registro)}</p>
            <p class="m-0 mb-2 text-start"><b>Fecha de Actualización: </b>${formatDateWithTime12Hour(data.fecha_actualizacion)}</p>
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

export const alertCargo = async (title, id) => {
    const iconX = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAA6BJREFUWEfdmF+IVVUUxr91ZpQGSz17n0GwCQdCCISge3dGJMjQQxD00luEWWlgPVTaOFSkkgk2TiH0UA+aQaSPvYQvPqRPWtxzp3ooMEQwMf/MXqeYCf/EnbvkXOfGnZlzzt5n5iLSgfty7/et9btr77P2Oodwj110j/Hg/wEUh+EGBMELAJ4A0D/zSYs9IcA1AD/2iBytJMmZsivgXaGTg4P3LZ+c3CZEbwNY45VI5LwQHVwZhofWnjt3y8fjBVRT6lUKglGIRD5BMzTXQLTdWHvM5XcC1bUeFWDEFcjz912GeV+RNhdIAKpr/RWAzZ7JfGWfGea38sS5QLHWXwDY5pullI5or7F2T5YnEyhWageIPi2VpKSYgE1V5m/m2uYBxWG4AkFwCcCykjnKyi/3MQ+uA/7tNM4HiqIPIbLbEf1vACu7oHnDMKdb479rFtCvwNIbWl91JLuInp4hajSeS3tM5j4Q2S69vd9hevokgIcKwC8Y5sFcoFp//7PUbB4vCHA1IKpUrP0z1dS0HiFgdJaeaKex9pP0ux+UGugNgp+K+lczCB5bPzHxczvGrArVtD5CwCuOpZhV5ljrdwHsn/G8Z5g/bvtjrV8H8Lkj3j7DvCsTKI6iXyDyqGt3isiWx5PkSFtXV2qPAGKSZG9JmFR+wjA/kw2kdXp3rXYBARAR2doJ1elpHTVEX3rESSW/GeZ1eUDXAfR5BhIi2lS19mgGzGHAe7SZNMwr8oCmANzvC5RVpZnqlAGaMszL84B+B7DWA6ibS3bWMD+SCVTX+pQAG11Aczd1rFSrkS5wU39vmJ/OrpBSYyAavsu3/X7D/H4m0LhSTzaJThcAXQmIqu3GOKcH3bERDRtrWwfzeBStboqMA1iVG5OoaqxNNXfsncKZGegigAcLoC5MNxpDPUuWPA+RVkeee5Hv0SFy3iTJw53+rMN1GCJjjmX7C0DYBU3x4ZomOD0w0Lf05s0/FjE/u+6J9u9X+pjXOMePVB0rtRVEh3wjL0hH9GLW0J87wtaUOkBEOxeUzG3KHfYLnzriKDoMkS3u+P4KIjpYtXZHnsP5GBRr/RGAD/xT5ioFRCPtWWnBQKmxrvXLQjS2iI1+iYA3q8zfuv6Ys0LtAOmj9ANTU68BeMf7URo4KyIH/kmSr4eAhgtmXmP0MbSaZxg+BaKXQFTpeNkg6csGAJeJ6AwBxyrWxj4xCxtj2QDd1nsvWbcTL2pT3y2YNM9t83daNDUK9xcAAAAASUVORK5CYII="
    const iconChech = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyBJREFUWEfdmNtLFFEcxz/j0I1CI4qiJK0IgiBIgrAyC4LAP0A8aze6gER0sfIhskCD0AohiB4shNAd2YfeegmiexF0oZdAi9UkU+stIchcJ8+sq7vrnJk5sz5IB/bp/H7f32d+v3P5nTWYZcOYZTz8J0BRdpCHALZiswycnxw/gR/AG2w6iPBatwLBM9TGfOZRg8FpoChgoDgGLeTTSgV/gvgEA7I4DDQBS4OIutjIrJ1BEPXz9wfqpAmbOj+hgPP1CK542aqBbAw6aQMOBgwW1OwmglMqYzWQxW2gJmgULTubBiJcdvNxB+qkFpsbWkF0jW32E6E92206UIwCEvQDC3VjaNoPYFJMJSPpftOBLBqAek3xsOYnENxSA8WYyxhD2CwOG2HSz6YLgyVph6ab5FcExWqgDirI40HOMPAFk7Lxs2sBCZ4Aqz00SxB8SM1nlsziLjiHYC6jG5NyKhl0RCw2A+89BBsRXFIBfQQ25UCTzEwKJspyDF4Baz00HyLYqwKSu2tlSKAwMGDziQgbVUC/nbq7jz5sqjCc+yhjIQK9mJRqZiYV5ReCAhXQMLDIheczsAvBd9opxOR5GlQvCcrYxzfHL8YqEjzzKdNUCJthIuSrgLqB9dOA5BaGciIMOXNJKNnrjLrAvNRoT2TJuoiwQQX02MmE28iGirGGEf5mZeYpsE5zDT5CsEcFdA045yEYx2bbZKZShsky6WVmKshVBBfcgaKUTmxTr4+MY7KTSue+S62ZsDAwxhaqeecOlOyB5OL02/rJhSyHyQutNZP5qT2IzDPK7XKVJZOl8xs9wByg0M9QOW9wnCqn75ocbu2HvH/6cuifg/INYlLk335IuShHMWgNqhzSrtqt6Ve3sFGaMTgfMpifm7LZ9351WNwBjvipa863IKhV+fg/gywax0/ki5pB3cxtoA7BdS8tfyDpbXFoYueFfSj2Y3CSKu77fVgwIKmSfEofw+Bs4HMn2cY2s4J77GbUD0bOBwdKqcnD02I7BgcwKEn7s0GWRP7ZMADOxRtF8DYIhPc5pKsww/b6GZphgGy5WQf0D2UywyWtV1X7AAAAAElFTkSuQmCC"
    const user = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAyZJREFUWEfdmFuoTVEUhr+DkpAIkXINIVEuuUsoj8gtPDi5ExEehDyQohDl+iBFhBQpJRIRHtwVHsgt1yckeXCbv+Y+rb2sueZYbadOxttujfHPf4455j/G3FXUMauqY3z4bwgNBKYBg4G2QGuf6Q/AW+AacBS4WfQEimSoATAHWA50My70CNgOHAB+WGKshCYCO4F2FtAMn1fAAuBsLN5CaCWwBSqut5/AXJ+tIK8YoU3A6tiuCn5fAWwLxeQRmgkcKriY1X0CcCrLOURoCHAZUCHXhn0F+gMq+jLLIlQfuAf0MjD5BVwAHnpfxYwxxMnlCjDCQmg+sNcA+s4RmeKBk+6jgONASwPGeOB00i+dIf1+7cUuhjfOCeO5gNMkl+ETMQDgNtAvj9BQl/KrBqAbXqXzXO8DvQ1YnYDnJb90hnQdpcQx2wMsijjt97oTw5LObQ0RUnaUpZjt88qb5yefeTEgl8WTgI74j6Uz9MRpTxcDiJrmgIjfXaCPAeuWl4BMQl+AxgYQueQVtXqfdm6xj0DzUIY+u/NsakEB3gOTM669dOgI0MqIozWbhQg9dnNMdyOQ3CSM573iSlAVO7ZAvFyl1j1DhC4BIwsCVup+0WV5dIiQxoxVxhWUHYnoC+C7j1Hv6+DnptgkUVpGE8WaEKFBwPUIIZ35Dlcju3wdZbm3AZYAS4EmETwptRQ785ZpV5ruQpOhdGoG8NKYRamwWkhZe0jEPgM6J7Gy0rrQDe27MxZ86maYvoCkoYi1AO64SbF9RlA1cDBGSLflAdAjBaAOrpeGaqeIadPHvEQk40RSmSvDCxXecEA3rl5q5cO+P30zMmrkZ2htJGmKV4uqqZ1QDSWD9EpQE03bG/ekWeeV+FOAmJR3qtv9ejdbqcDTNt2/2/76ELuaelMty8mG+pVqS8UpLBVx18jYoc1sDGHGCCluLbDBeER5bqqVxYGs18RZCMlZV12zUunJXJSfpERkzsQCrYSE09Bp1Gyv5B1jwP67+tRmQJfhnz6l0+sPc2PnLK9L6uqlzl76s0Fqr45fq382GJNSmVuRI6tsJWN0nSP0G/XDgCWm/mQVAAAAAElFTkSuQmCC"


    let data
    return Swal.fire({
        title: `${title}`,
        showCloseButton: true,
        color: "black",
        customClass: {
            title: "h1 fw-bold text-black",
            confirmButton: "px-5 py-3 mx-3 fs-6 fw-bold",
            popup: "container-loader",
            loader: "loader"
        },
        confirmButtonText: "Aceptar",
        confirmButtonColor: "rgb(var(--principal))",
        showCancelButton: false,
        width: "50%",
        allowOutsideClick: true,
        didOpen: async () => {
            Swal.showLoading();
            const res = await cargos.get({ paramOne: id })

            if (res.status === 200 && res.data.status === true) {
                data = res.data.data
                let HTMLpermisos = `<p class="m-0 mb-2 text-start"><b>Permisos: </b>`
                const dataPermisos=data.permisos?data.permisos:[]
                for (const permisos of dataPermisos) {
                    console.log(permisos)
                    const dataPermiso = `
                        <p class="m-0 mb-2 ms-2 text-start"><b>${permisos.nombre}: </b> ${permisos.descripcion}</p>
                    `
                    HTMLpermisos = HTMLpermisos + dataPermiso
                }
                Swal.getHtmlContainer().setAttribute('style', 'display: block')
                Swal.getHtmlContainer().innerHTML = `
                <div class='d-flex flex-column justify-content-start align-items-start'>
                    <img class="mx-auto mb-2" src='${data.img_logo ? data.img_logo : user}'/>
                    <p class="m-0 mb-2 text-start"><b>Codigo: </b>${formatoId(data.id)}</p>
                    <p class="m-0 mb-2 text-start"><b>Descripción: </b>${data.descripcion}</p>
                    <p class="m-0 mb-2 text-start"><b>Administrador: </b>
                        <spam>
                        ${data.administrador ?
                        `<img class="mx-auto mb-2" src='${iconChech}'/>`
                        :
                        `<img class="mx-auto mb-2" src='${iconX}'/>`
                    }
                        </spam>
                    ${data.permisos? HTMLpermisos : ""}
                    </p>
                    <p class="w-100 m-0 mb-2 text-start"><b>Fecha de Actualización: </b>${formatDateWithTime12Hour(data.fecha_actualizacion)}</p>
                    <p class="w-100 m-0 mb-2 text-start"><b>Fecha de Registro: </b>${formatDateWithTime12Hour(data.fecha_registro)}</p>
                </div>
                `
                Swal.hideLoading();
            } else {
                Swal.close()
                alerError("!Error", "Ha ocurrido un error al consultar, intente mas tarde")
            }
        }
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
