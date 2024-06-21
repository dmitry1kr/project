import React, { useContext, useEffect, useState } from 'react'
import style from './style/module/MakeOrder.module.css'
import { Button, Form, FormControl, Image, ListGroup } from 'react-bootstrap'
import { observer } from 'mobx-react-lite';
import OrderInfo from '../components/UI/OrderInfo/OrderInfo';
import { Context } from '../index'

import moment from 'moment-timezone';
import { createOrder } from '../http/orderAPI';
import { useNavigate } from 'react-router-dom';
import { CREATED_ORDER } from '../utils/const';
import { getLastNumberOrder } from '../http/basketAPI';
moment.locale('ru');
moment.tz.setDefault("Europe/Ekaterinburg");


const MakeOrder = observer(() => {

    const [activeItem, setActiveItem] = useState(0)
    const [ number, setNumber ] = useState()

    const navigate = useNavigate()

    const { cart, user } = useContext(Context)

    const delivery_prcie = 250.00

    useEffect(() => {
        getLastNumberOrder()
            .then(data => {
                console.log(data, 'data')
                
                setNumber((parseInt(data[0].number_order) + 1).toString().padStart(data[0].number_order.length, '0'))
                console.log(number)
            })
    }, [number])

    const visibleItem = (index) => {
        setActiveItem(index)
    }
    console.log(cart, 'basket')
    
    const countAllPrice = () => {

        return cart.cartItems.reduce((totalPrice, data) => {
            const price = parseFloat(data.device.price)
            const quantity = parseFloat(data.quantity)
            

            if (!isNaN(price) && !isNaN(quantity)) {
                totalPrice += price * quantity
            }

            return totalPrice
        }, 0).toFixed(2)
        
    }

    console.log(countAllPrice(), 'final_price')

    const [orderInfo, setOrderInfo] = useState(1)

    const handleOrderInfoChange = (info) => {
        console.log('OrderInfo data:');
        setOrderInfo(info)
        return info
    };

    // Для форм
    const [typeOrder, setTypeOrder] = useState(1)
    
    const [orderDevices, setOrderDevices] = useState(
        cart.cartItems.map(data => ({
            quantity: data.quantity,
            device_id: data.device.id
        }))
    )

    console.log(orderInfo)
    const [formOrder, setFormOrder] = useState()

    const create = () => {
        const data = {
            user: user.userInfo.user_id,
            status: 2,
            type_order: typeOrder,
            date_order: moment().format("YYYY-MM-DD HH:mm:ss"),
            payment_method: orderInfo.paymentMethod,
            total_amount: countAllPrice(),
            order_devices: orderDevices,
            delivery_order: orderInfo.formData,
            pickup_order: orderInfo.formPickup,
    
        }
        setFormOrder(data)
        console.log(formOrder)
        navigate(CREATED_ORDER + `/${number}`, { state: { data: data, number: number } })
    }


    return (
        <Form>         
            <div style={{width: '99vw'}} className='d-flex justify-content-center'>
                <div style={{width: '992px', marginTop: 30, height: '100%'}}>
                    <span className={style.text_order_main}>Оформление заказа</span>
                    <div className='d-flex justify-content-between'>
                        <div style={{width: '45%'}} className={style.devices}>
                            {cart.cartItems.map(data => (
                                <div className={style.device_card} key={data.id}>
                                    <div className={style.device_card_next}>
                                        <div>
                                            <Image src={process.env.REACT_APP_API_URL + '/media/' + data.device.image_device.split("/media/")[1]} className={style.image} />
                                        </div>
                                        <div>
                                            <span className={style.device_name}>{data.device.name_device ? data.device.name_device.replace(/^(\S+\s+\S+).*/, '$1') : ""}</span>

                                        </div>
                                        <div>
                                            <div>
                                                {data.quantity}шт
                                            </div>
                                        </div>
                                        <div className={style.price_block}>
                                            <span className={style.price_device}>{data.device.price * data.quantity} ₽</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                        <OrderInfo active={activeItem} onOrderInfoChange={handleOrderInfoChange}/>
                    </div>
                    <div style={{width: '100%'}} className='d-flex justify-content-between'>
                        <div style={{width: '45%'}}>  
                            <div className={style.card}>
                                <ListGroup style={{width: '100%'}}>
                                    <div className='d-flex' style={{width: '100%'}}>
                                        <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 0} onClick={() => {visibleItem(0); setTypeOrder(1)}} className={(activeItem === 0) ? style["list_group_item_custom"] + " " + style.active : style["list_group_item_custom"]}>
                                            <span>Доставка</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 1} onClick={() => {visibleItem(1); setTypeOrder(2)}} className={(activeItem === 1) ? style["list_group_item_custom"] + " " + style.active : style["list_group_item_custom"]}>
                                            <span>Самовывоз</span>
                                        </ListGroup.Item> 
                                    </div>      
                                </ListGroup>
                            </div>
                            
                            <div className={style.card} style={{marginTop:10, backgroundColor: 'rgb(251 250 250)', marginBottom: 30}}>
                                <div style={{padding: 15}}>
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex flex-column justify-content-between'>
                                            <span className={style.text_order}>Итого</span>
                                            <span className={style.text_order}>Доставка</span>
                                        </div>
                                        <div className='d-flex flex-column justify-content-between'>
                                            <span className={style.text_order}>{countAllPrice()}</span>
                                            {activeItem === 0 && <span className={style.text_order_color}>{delivery_prcie}</span>}
                                            {activeItem === 1 && <span className={style.text_order_color}>0 ₽</span>}
                                        </div>
                                        <div className='d-flex flex-column justify-content-between'>
                                            <span className={style.final_text}>ИТОГО К ОПЛАТЕ</span>
                                            {activeItem === 0 && <span className={style.final_price}>{(parseFloat(countAllPrice()) + delivery_prcie).toFixed(2)} ₽</span>}
                                            {activeItem === 1 && <span className={style.final_price}>{(parseFloat(countAllPrice())).toFixed(2)} ₽</span>}
                                        </div>  
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div style={{width: '45%'}} className='d-flex align-items-center justify-content-center'>
                            <Button style={{width: '100%', height: '30%'}} onClick={create}>Оформить заказ</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
})

export default MakeOrder
