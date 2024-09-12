import React from 'react'
import userx from "../../assets/user-x.svg"
import './cards.css'
import { IconUserCircle, IconUserCircleSolid, IconUser } from "../Icon.jsx"
import { useNavigate } from 'react-router-dom';

function CardRecreador({ id, nombre = null,  nivel = null, genero = null, edad = null, img = null }) {
    const navigate=useNavigate()
    return (
        <div className="card-recreador" onDoubleClick={()=>{navigate(`/recreador/${id}/`)}}>
            <div className='card-header'>
                {
                    img ?
                        <img src={img ? img : userx} alt="..."  width={"130px"}/>
                        :
                        <IconUserCircle />
                }
                <h5 className='card-title'>{nombre ? nombre : "Sin Assignar"}</h5>
                {
                    nivel &&
                    <h6 className='text-capitalize m-0 mt-2 fs-5'>{nivel}</h6>
                }
            </div>
            <hr />
            {
                genero && edad &&
                <div className="d-flex justify-content-evenly">
                    <h6 className='text-capitalize m-0 fs-6s'>{genero}</h6>
                    <h6 className='text-capitalize m-0 fs-6s'>{`${edad} años`}</h6>
                </div>
            }
        </div>
    )
}

export default CardRecreador