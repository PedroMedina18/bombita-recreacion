const pattern={
    user:/^[a-zA-Z0-9_!@#$%^&*(),.?":{}|<>]*$/,
    password:/^[a-zA-Z0-9+-@_.%&$#/]+$/,
    textNoneNumber:/^[a-zA-ZÁ-ÿ\s]+$/,
    textWithNumber:/^[a-zA-ZÁ-ÿ0-9\s]+$/,
    email:/^\w+([.-_+/$%&?¡¿]?\w+)@\w+([.-]?\w+)(.\w)+$/
}
export default  pattern