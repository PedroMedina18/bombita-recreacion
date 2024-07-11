import "./table.css"
import {useState} from 'react'
import { useAuthContext } from "../../context/AuthContext.jsx"
function TableDescriptionFacture({ listaData, listDescripcion, saveListDescription }) {
    const { getUser } = useAuthContext();
    const [dataUser] = useState(getUser());

    const FilaVacia = () => {
        const array = [];
        for (let index = 0; index < 3 - listDescripcion.length; index++) {
            array.push(
                <tr key={`${index}_none_${Date.now + (Math.floor(Math.random()) * 100)}`} className="fc-none">
                    <th>none</th>
                    <th>none</th>
                    <th>none</th>
                </tr>
            )
        }
        return array
    }

    const deleteSelect = (index) =>{
        const array = [...listDescripcion];
        array.splice(index, 1)
        saveListDescription(array)
    }
    return (
        <table className="table-data border-none ">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Precio en $</th>
                    <th>Precio en Bs</th>
                </tr>
            </thead>
            <tbody>
                {
                    listDescripcion.map((element, index) => {
                        const objet = listaData.find(objeto => objeto.id === element)
                        const precio = objet.precio ? objet.precio : objet.monto
                        const precioBs = precio * dataUser.dollar.price
                        return (
                            <tr key={`${index}_${objet.nombre.toLowerCase().replace(/\s+/g, '')}`} onDoubleClick={()=>{deleteSelect(index)}}>
                                <th className="text-start">{objet.nombre}</th>
                                <th>{`${precio} $`}</th>
                                <th>{`${precioBs.toFixed(2)} BS.s`}</th>
                            </tr>
                        )
                    })
                }
                {FilaVacia()}
            </tbody>

        </table>
    )
}

export default TableDescriptionFacture