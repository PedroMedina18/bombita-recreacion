const pattern={
    user:/^[a-zA-Z0-9]{8,16}$/,
    password:/^(?=.*[A-Za-z])(?=.*\d)[\w.!#$&?*-+%,]{8,20}$/,
    textNoneNumber:/^[a-zA-ZÁ-ÿ\s]+$/,
    textWithNumber:/^[a-zA-ZÁ-ÿ0-9.,\s]+$/,
    email:/^[a-zA-Z0-9._%+\-$!]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    tel:/^[0-9]{11}$/
}
export default  pattern