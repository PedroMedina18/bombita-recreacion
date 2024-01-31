import "./input.css"
import Select from "react-select"

// *Input con efecto de hover usado principalmente en el login
export function InputLabel({ name, id, ...props }) {
    return (
        <div className='w-100 position-relative overflow-hidden my-2 '>
            <input
                id={id}
                {...props}
            />
            <label htmlFor={id} className='lb-name  cursor-pointer'>
                <span className='text-name'>{name}</span>
            </label>
        </div>
    )
}

export function InputText({ name, id, ...props }) {
    return (
        <div className="w-100">
            <label className="formulario-label" htmlFor={id}>{name}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="text"
                    id={id}
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">El usuario tiene que ser de 4 a 16 dígitos y solo puede contener numeros, letras y guion bajo.</p>
        </div>
    )
}

export function InputTextTarea({ name, id, ...props }) {
    return (
        <div className="w-100 ">
            <label className="formulario-label" htmlFor={id}>{name}</label>
            <div className="formulario-grupo-input textarea">
                <textarea className="formulario-textarea" rows={3}
                    id={id}
                    {...props}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">El usuario tiene que ser de 4 a 16 dígitos y solo puede contener numeros, letras y guion bajo.</p>
        </div>
    )
}

export function TextTarea({ name, id, ...props }) {
    return (
        <div className="w-100">
            <label className="formulario-label" htmlFor={id}>{name}</label>
            <div className="formulario-grupo-input textarea">
                <textarea className="formulario-textarea" rows={3}
                    id={id}
                    {...props}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">El usuario tiene que ser de 4 a 16 dígitos y solo puede contener numeros, letras y guion bajo.</p>
        </div>
    )
}

export function InputCheck({ name, id, ...props }) {
    return (
        <div className="w-100 d-flex">
            <input className="form-check-input border border-black" type="checkbox"
                id={id}
                {...props} />
            <label className="formulario-label ms-3 " htmlFor={id}>{name}</label>
        </div>
    )
}

export function MultiSelect({name, id, options}){
    return (
        <div className="w-100">
            <label className="formulario-label" htmlFor={id}>{name}</label>
            <Select
            id={id}
            isMulti
            options={options}
            />
        </div>
    )
}
    

export function InputEmail({ name, id, ...props }) {
    return (
        <div className="w-100">
            <label className="formulario-label" htmlFor={id}>{name}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="email"
                    id={id}
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">El usuario tiene que ser de 4 a 16 dígitos y solo puede contener numeros, letras y guion bajo.</p>
        </div>
    )
}