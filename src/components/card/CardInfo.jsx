import React from 'react'
import { IconClient } from "../Icon.jsx"
import "./cards.css"

function CardInfo({title, icon, cursor=false, color="red", margin="0px 0px"}) {
  return (
    <div className={`card-info ${cursor && `cursor-pointer card-${color}`}`} style={{margin:margin}}>
        <h5 className='title-info'>{title}</h5>
        {icon}
    </div>
  )
}

export default CardInfo