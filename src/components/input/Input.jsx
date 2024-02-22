import "./input.css"
import Select from "react-select"
import MakeAnimated from "react-select/animated"

export function InputText({ label, id, name, form, params = {}, isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="text"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}
export function InputNumber({ label, id, name, form, params = {}, isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="number"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}

export function InputTextTarea({ label, id, name, form, params = {}, rows = null, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 mb-1 ${errors[name] ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input textarea m-0">
                <textarea className="formulario-textarea" rows={rows ? rows : 4}
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}

export function InputCheck({ label, id, name, form, params = {}, isError = true, className = "", ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 d-flex check ${errors[name] && isError ? "error" : " "} ${className}`}>
            <input className="form-check-input" type="checkbox"

                id={id}
                name={name}
                {
                ...register(name,
                    params)
                }
                {...props} />
            <label className="formulario-label ms-4 " htmlFor={id}>{label}</label>
        </div>
    )
}

export function InputEmail({ label, id, name, form, params = {}, isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="email"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}

export function InputPassword({ label, id, name, form, params = {}, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="password"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}

export function InputTel({ label, id, name, form, params = {}, isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input">
                <input className="formulario-input" type="number"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}
export function InputDate({ label, id, name, form, params = {}, isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "} `}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input date">
                <input className="formulario-input-date" type="date"
                    id={id}
                    {
                    ...register(name,
                        params
                    )
                    }
                    {...props} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}

export function InputDuration({ label, id, name, form, params = {}, isError = true }) {
    const { errors, register } = form
    const hours = [{ value: 0, label: "00" }, { value: 1, label: "01" }, { value: 2, label: "02" }, { value: 3, label: "03" }, { value: 4, label: "04" }, { value: 5, label: "05" }, { value: 6, label: "06" }, { value: 7, label: "07" }, { value: 8, label: "08" }, { value: 9, label: "09" }, { value: 10, label: "10" }, { value: 11, label: "11" }, { value: 12, label: "12" }, { value: 13, label: "13" }, { value: 14, label: "14" }, { value: 15, label: "15" }, { value: 16, label: "16" }, { value: 17, label: "17" }, { value: 18, label: "18" }, { value: 19, label: "19" }, { value: 20, label: "20" }, { value: 21, label: "21" }, { value: 22, label: "22" }, { value: 23, label: "23" }, { value: 24, label: "24" }]
    const minutes = [{ value: 0, label: "00" }, { value: 1, label: "01" }, { value: 2, label: "02" }, { value: 3, label: "03" }, { value: 4, label: "04" }, { value: 5, label: "05" }, { value: 6, label: "06" }, { value: 7, label: "07" }, { value: 8, label: "08" }, { value: 9, label: "09" }, { value: 10, label: "10" }, { value: 11, label: "11" }, { value: 12, label: "12" }, { value: 13, label: "13" }, { value: 14, label: "14" }, { value: 15, label: "15" }, { value: 16, label: "16" }, { value: 17, label: "17" }, { value: 18, label: "18" }, { value: 19, label: "19" }, { value: 20, label: "20" }, { value: 21, label: "21" }, { value: 22, label: "22" }, { value: 23, label: "23" }, { value: 24, label: "24" }, { value: 25, label: "25" }, { value: 26, label: "26" }, { value: 27, label: "27" }, { value: 28, label: "28" }, { value: 29, label: "29" }, { value: 30, label: "30" }, { value: 31, label: "31" }, { value: 32, label: "32" }, { value: 33, label: "33" }, { value: 34, label: "34" }, { value: 35, label: "35" }, { value: 36, label: "36" }, { value: 37, label: "37" }, { value: 38, label: "38" }, { value: 39, label: "39" }, { value: 40, label: "40" }, { value: 41, label: "41" }, { value: 42, label: "42" }, { value: 43, label: "43" }, { value: 44, label: "44" }, { value: 45, label: "45" }, { value: 46, label: "46" }, { value: 47, label: "47" }, { value: 48, label: "48" }, { value: 49, label: "49" }, { value: 50, label: "50" }, { value: 51, label: "51" }, { value: 52, label: "52" }, { value: 53, label: "53" }, { value: 54, label: "54" }, { value: 55, label: "55" }, { value: 56, label: "56" }, { value: 57, label: "57" }, { value: 58, label: "58" }, { value: 59, label: "59" }, { value: 60, label: "60" }]

    return (
        <div className={`w-100  ${errors[name] && isError ? "error" : " "} `}>
            <label className="formulario-label" htmlFor={`${id}-hour`}>{label}</label>
            <div className="d-flex align-items-center justify-content-center">
                <select name={`${name}-hour`} id={`${id}-hour`} className="w-50 me-2 formulario-input">
                    <option value=""  >{"..."}</option>
                    {
                        hours.map((element) => (
                            <option key={element.value} value={element.value}>{element.label}</option>
                        ))
                    }
                </select>
                <select name={`${name}-minute`} id={`${id}-minute`} className="w-50 ms-2 formulario-input">
                    <option value=""  >{"..."}</option>
                    {
                        minutes.map((element) => (
                            <option key={element.value} value={element.value}>{element.label}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}


export function UnitSelect({ label, id, name, form, params = {}, options, placeholder = "...", isError = true, ...props }) {
    const { errors, register } = form
    return (
        <div className={`w-100 ${errors[name] && isError ? "error" : " "}`}>
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <div className="formulario-grupo-input select">
                <select name={name} id={id} className="formulario-input select"
                    {
                    ...register(name,
                        params
                    )
                    }

                    {...props}>
                    <option value=""  >{placeholder}</option>
                    {

                        options.length ?
                            (
                                options.map((element) => (
                                    <option key={element.value} value={element.value}>{element.label}</option>
                                ))
                            )
                            :
                            ""
                    }
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-check-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="bi bi-x-circle-fill">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                </svg>
            </div>
            <p className="formulario-message-error">{errors[name] ? errors[name].message : "error"}</p>
        </div>
    )
}


const animatedComponent = MakeAnimated()
export function MultiSelect({ name, id, label, options, save, placeholder, }) {
    return (
        <div className="w-100">
            <label className="formulario-label" htmlFor={id}>{label}</label>
            <Select
                id={id}
                isMulti
                options={options}
                components={animatedComponent}
                closeMenuOnSelect={false}
                placeholder={placeholder}

                styles={{
                    control: (styles) => {
                        return {
                            ...styles,
                            borderColor: "rgb(22, 21, 21)",
                            borderWidth: "2px",
                            borderRadius: "5px",
                        }
                    },
                }}
                captureMenuScroll={true}
                noOptionsMessage={() => {
                    return "Sin Opciones"
                }}
                onChange={(selectecOptions) => {
                    save(selectecOptions)
                }}
            />
        </div>
    )
}


