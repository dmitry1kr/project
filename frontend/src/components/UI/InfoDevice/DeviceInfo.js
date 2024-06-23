import React, { useState } from 'react'
import style from './DeviceInfo.module.css'

const DeviceInfo = ({info}) => {


    return (
        <div className={style.desc_section}>
            <span className={style.desc}>Описание</span>
            <span className={style.desc_text}>{info}</span>
     
        </div>
    )
}

export default DeviceInfo
