import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Context } from '../index'

import DeviceItem from './DeviceItem'

const DeviceList = observer(() => {

    const {cart, device, user} = useContext(Context)

    return (
        <div className='d-flex flex-wrap justify-content-between'>
            {device.devices.map(device =>
                <DeviceItem key={device.id} device={device} cart={cart} user={user}/>
            )}
        </div>
    )
})

export default DeviceList
