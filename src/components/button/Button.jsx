import "./button.css"

// Boton sencillo con un texto simple
export function ButtonSimple({ children, type, className = null, ...props }) {
    return (
        <button type={type} className={`button-initial ${className}`}
            {
            ...props
            }
        >
            {children}
        </button>
    )
}