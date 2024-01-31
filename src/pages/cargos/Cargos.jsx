import Navbar from "../../components/navbar/Navbar"
import {InputText, InputTextTarea, InputCheck, MultiSelect} from "../../components/input/Input"

function Cargos() {
    const opciones=[
        {value:"prubea", label:"prueba1"},
        {value:"prubesa", label:"prueba2"},
        {value:"prubeae", label:"prueba3"}
    ]
    return (
        <Navbar name="Registrar un nuevo Cargo">
            <div className="w-100 bg-white p-3 round">
                <form className="w-100">
                    <InputText name="Nombre" id="nombre"/>
                    <InputTextTarea name="Descripcion" id="descripcion"/>
                    <InputCheck name="Administrador" id="administrador"/>
                    <MultiSelect name="Permisos" id="permisos" options={opciones}/>
                    <button>Enviar</button>
                </form>
            </div>
        </Navbar>
    )
}

export default Cargos