import React from 'react'
import style from './ParametrsDevice.module.css'

const ParametrsDevice = ({params}) => {

    
    return (
        <div>
            {params.map(param =>
                <div key={param.id} className={style.line_params}>
                    <div className={style.title_params} style={{width: '45%'}}>
                        <span>{param.name}</span>
                    </div>
                    <div className={style.descr_params} style={{width: '50%'}}>
                        <span>{param.value}</span>
                    </div>

                </div>
            )}
        </div>
    )
}

export default ParametrsDevice
