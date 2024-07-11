import AsyncSelect from 'react-select/async';
import { useState } from "react"

import React from 'react'

function SelectAsync() {
    const listDefault = [
        {
            id: 9,
            nombre: "Miguel",
            apellido: "Hernández",
            numeroIdentificacion: "77777777",
            fechaNacimiento: "1993-05-01"
        },
        {
            id: 13,
            nombre: "Francisco",
            apellido: "Jiménez",
            numeroIdentificacion: "12121212",
            fechaNacimiento: "1996-01-05"
        },
        {
            id: 2,
            nombre: "María",
            apellido: "González",
            numeroIdentificacion: "98765432",
            fechaNacimiento: "1985-06-25"
        },
        {
            id: 11,
            nombre: "Rafael",
            apellido: "Gómez",
            numeroIdentificacion: "99999999",
            fechaNacimiento: "1994-03-28"
        },
        {
            id: 6,
            nombre: "Sofía",
            apellido: "López",
            numeroIdentificacion: "44444444",
            fechaNacimiento: "1988-11-05"
        }
    ];
    const [value, setValue] = useState(null)
    const [options, setOptions] = useState(listDefault)
    const listaPersonas = [
        {
            id: 1,
            nombre: "Juan",
            apellido: "Pérez",
            numeroIdentificacion: "12345678",
            fechaNacimiento: "1990-02-12"
        },
        {
            id: 2,
            nombre: "María",
            apellido: "González",
            numeroIdentificacion: "98765432",
            fechaNacimiento: "1985-06-25"
        },
        {
            id: 3,
            nombre: "Pedro",
            apellido: "Rodríguez",
            numeroIdentificacion: "11111111",
            fechaNacimiento: "1992-01-15"
        },
        {
            id: 4,
            nombre: "Ana",
            apellido: "Díaz",
            numeroIdentificacion: "22222222",
            fechaNacimiento: "1980-03-20"
        },
        {
            id: 5,
            nombre: "Carlos",
            apellido: "Martínez",
            numeroIdentificacion: "33333333",
            fechaNacimiento: "1995-08-10"
        },
        {
            id: 6,
            nombre: "Sofía",
            apellido: "López",
            numeroIdentificacion: "44444444",
            fechaNacimiento: "1988-11-05"
        },
        {
            id: 7,
            nombre: "Javier",
            apellido: "García",
            numeroIdentificacion: "55555555",
            fechaNacimiento: "1991-04-22"
        },
        {
            id: 8,
            nombre: "Lucía",
            apellido: "Sánchez",
            numeroIdentificacion: "66666666",
            fechaNacimiento: "1982-09-18"
        },
        {
            id: 9,
            nombre: "Miguel",
            apellido: "Hernández",
            numeroIdentificacion: "77777777",
            fechaNacimiento: "1993-05-01"
        },
        {
            id: 10,
            nombre: "Elena",
            apellido: "Fernández",
            numeroIdentificacion: "88888888",
            fechaNacimiento: "1986-07-12"
        },
        {
            id: 11,
            nombre: "Rafael",
            apellido: "Gómez",
            numeroIdentificacion: "99999999",
            fechaNacimiento: "1994-03-28"
        },
        {
            id: 12,
            nombre: "Isabel",
            apellido: "Romero",
            numeroIdentificacion: "10101010",
            fechaNacimiento: "1989-10-15"
        },
        {
            id: 13,
            nombre: "Francisco",
            apellido: "Jiménez",
            numeroIdentificacion: "12121212",
            fechaNacimiento: "1996-01-05"
        },
        {
            id: 14,
            nombre: "Cristina",
            apellido: "Torres",
            numeroIdentificacion: "13131313",
            fechaNacimiento: "1987-02-20"
        },
        {
            id: 15,
            nombre: "Alejandro",
            apellido: "Álvarez",
            numeroIdentificacion: "14141414",
            fechaNacimiento: "1997-06-01"
        }
    ];

    const loadOptions = (inputValue, callback) => {
        const options =  listaPersonas.filter(e => e.nombre.toLowerCase().includes(inputValue.toLowerCase()))
        callback(options)
    }
    const handleOnChange = (e)=>{
        setValue(e)
    }
    // const handleOnInputChange = (e)=>{
    //     console.log("onInputChange")
    //     console.log(e)
    // }
    const getOptionLabel=(e)=>{
        return `${e.nombre} ${e.apellido}`
    }
    return (
        <AsyncSelect
            cacheOptions
            // options={options}
            defaultOptions = {listDefault}
            value={{
                id: 13,
                nombre: "Francisco",
                apellido: "Jiménez",
                numeroIdentificacion: "12121212",
                fechaNacimiento: "1996-01-05"
            }}
            loadOptions={loadOptions}
            onChange={handleOnChange}
            getOptionLabel={getOptionLabel}
            getOptionValue={e => e.id}
            // onInputChange={handleOnInputChange}
        />
    )
}

export default SelectAsync



// const filterColors = (inputValue) => {
//   return colourOptions.filter((i) =>
//     i.label.toLowerCase().includes(inputValue.toLowerCase())
//   );
// };

// const loadOptions = (inputValue, callback) => {
//   setTimeout(() => {
//     callback(filterColors(inputValue));
//   }, 1000);
// };