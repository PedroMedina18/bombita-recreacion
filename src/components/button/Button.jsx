import "./button.css"

export function Button({ type, name, className }) {
    return (


        <button type={type} className={`button-style-login ${className}`}>
            <span class="transition"></span>
            <span class="gradient"></span>
            <span class="name">{name}</span>
        </button>

    )
}
