import React, { useContext, useEffect, useState } from 'react'
import style from './style/module/Pay.module.css'
import { Button, Image, Spinner } from 'react-bootstrap'
import { getAllOrder, getNotPayedOrderUser } from '../http/orderAPI';
import { Context } from '../index'
import { getBalanceUserWallet, payOrderUser } from '../http/payAPI';
import ModalPay from '../components/UI/Modal/ModalPay';

const Pay = () => {

    const { user } = useContext(Context)
    

    const [visibleOrders, setVisibleOrders] = useState({});
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState()
    const [balance, setBalance] = useState()
    const [modalVisible, setModalVisible] = useState(false)

    const toggleVisibility = (orderId) => {
        setVisibleOrders(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId]
        }));
    };

    const fetchOrdersAndBalance = () => {
        setLoading(true);
        getNotPayedOrderUser(user.userInfo.user_id)
            .then(data => {
                setOrders(data);
            })
            
        
        getBalanceUserWallet(user.userInfo.user_id)
            .then(data => {
                setBalance(data[0].balance);
            })
            .catch(() => {
                console.log('Ошибка при получении баланса');
            });
    };

    useEffect(() => {
        fetchOrdersAndBalance();
        setLoading(false)
    }, []);

    const payedOrder = (user_id, order_id, amount) => {
        console.log(user_id, order_id, amount);

        payOrderUser(user_id, order_id, amount)
            .then(() => {
                console.log('Оплата прошла успешно');
                fetchOrdersAndBalance();
                
            })
            .catch(() => {
                console.log('Ошибка при оплате');
            });
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }

    console.log(orders,  'adsasasdasdsadasdasdasdasd')
    return (
        <div className='d-flex flex-column align-items-center' style={{width: '99vw', minHeight: '60vh'}}>
            <div style={{width: 992, rowGap: 30}} className='d-flex flex-column'>
                <div style={{marginTop:50}}>
                    <span className={style.text_main}>Оплата</span>
                </div>
                <div>
                    <div className={style.card} style={{width: '40%'}}>
                        <div className='d-flex flex-column align-items-center' style={{padding: 10}}>
                            <span className={style.text}>Ваш баланс:</span>
                            <span className={style.text_balance}>{balance} ₽</span>
                            <Button style={{width: '100%'}} onClick={() => setModalVisible(true)}>Пополнить</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.text_main}>
                        Ваши заказы
                    </div>
                    
                    <div className='d-flex flex-column' style={{rowGap: 40}}>
                        {orders &&  Object.keys(orders).length > 0 ? orders.map(order =>(
                            <div className={style.card}>
                                <div style={{padding: 20}} className='d-flex justify-content-between align-items-center flex-column'>
                                    <div className='d-flex flex-row justify-content-between' style={{width: '100%'}}>
                                        <div className='d-flex flex-column ' style={{rowGap: 15, width: '45%'}}>
                                            <div>
                                                <span className={style.text}>Номер заказа:</span>
                                                <span className={style.text_number_order}> Заказ № {order.number_order}</span>
                                            </div>
                                            <div>
                                                <span className={style.text}>Способ оплаты:</span>
                                                <span className={style.text_slave}> {order.payment_method}</span>
                                            </div>
                                            <div>
                                                <span className={style.text}>Дата заказа:</span>
                                                <span className={style.text_slave}> {order.date_order}</span>
                                            </div>
                                            <div>
                                                {order.delivery_order
                                                    ?
                                                    <span className={style.text}>Дата доставки: {order.delivery_order.date_delivery}</span>
                                                    :
                                                    <span className={style.text}>Дата выдачи: </span>
                                                }
                                            </div>
                                            <div>
                                                <span className={style.text}>Статус заказа:</span>
                                                {order.status === 'Оплачен' && <span className={style.text_slave} style={{color: 'green', fontWeight:500}}> {order.status}✔</span>}
                                                {order.status === 'Не оплачен' && <span className={style.text_slave} style={{color: 'red', fontWeight:500}}> {order.status}❗</span>}
                                                {order.status === 'Доставлен' && <span className={style.text_slave} style={{color: 'green', fontWeight:500}}> {order.status}✔</span>}
                                                {order.status === 'Доставляется' && <span className={style.text_slave} style={{color: 'yellow', fontWeight:500}}> {order.status}🚚</span>}
                                                {order.status === 'Отменен' && <span className={style.text_slave} style={{color: 'red', fontWeight:500}}> {order.status}❌</span>}
                                                {order.status === 'Возврат' && <span className={style.text_slave} style={{color: 'red', fontWeight:500}}> {order.status}🔄</span>}
                                                {order.status === 'Сборка' && <span className={style.text_slave} style={{color: '#ff9a5d', fontWeight:500}}> {order.status}📦</span>}
                                            </div>
                                        </div>
                                        <div style={{width: '45%'}} className={style.devices}>
                                            {order.order_devices.map(device=> (
                                                <div className={style.device_card}>
                                                    <div className={style.device_card_next}>
                                                        <div>
                                                            <Image src={process.env.REACT_APP_API_URL + '/media/' + device.device.image_device.split("/media/")[1]} className={style.image} />
                                                        </div>
                                                        <div>
                                                            <span className={style.device_name}>{device.device.name_device.replace(/^(\S+\s+\S+).*/, '$1')}</span>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                {device.quantity}шт
                                                            </div>
                                                        </div>
                                                        <div className={style.price_block}>
                                                            <span className={style.price_device}>{device.device.price * device.quantity} ₽</span>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{width: '100%', rowGap: 10}} className='d-flex flex-column'>
                                        <div className='d-flex justify-content-end'>
                                            <span className={style.text}>Общая сумма: {order.total_amount}</span>
                                        </div>
                                        {visibleOrders[order.number_order]
                                            ?
                                            (order.delivery_order
                                                ?
                                                <div>
                                                    <Button style={{ width: '100%' }} onClick={() => toggleVisibility(order.number_order)}>Скрыть</Button>
                                                    <div className='d-flex flex-column' style={{ rowGap: 15, marginTop: 10 }}>
                                                        <div>
                                                            <span className={style.text}>ФИО:</span>
                                                            <span className={style.text_slave}> {order.delivery_order.name_user}</span>
                                                        </div>
                                                        <div>
                                                            <span className={style.text}>Номер телефона:</span>
                                                            <span className={style.text_slave}> {order.delivery_order.telephone}</span>
                                                        </div>
                                                        <div>
                                                            <span className={style.text}>Адрес:</span>
                                                            <span className={style.text_slave}> {order.delivery_order.address} п.{order.delivery_order.entrance} кв.{order.delivery_order.flat}</span>
                                                        </div>
                                                        <div>
                                                            <span className={style.text}>Комментарий:</span>
                                                            <span className={style.text_slave}> {order.delivery_order.comments}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <Button style={{ width: '100%' }} onClick={() => toggleVisibility(order.number_order)}>Скрыть</Button>
                                                    <div>
                                                        <span className={style.text}>ФИО:</span>
                                                        <span className={style.text_slave}> {order.pickup_order.name_user}</span>
                                                    </div>
                                                    <div>
                                                        <span className={style.text}>Телефон:</span>
                                                        <span className={style.text_slave}> {order.pickup_order.telephone}</span>
                                                    </div>
                                                </div>
                                            )
                                            
                                            :
                                            <div>
                                                <Button style={{ width: '100%' }} onClick={() => toggleVisibility(order.number_order)}>Подробнее</Button>
                                            </div>
                                        }
                                        <div className='d-flex justify-content-end'>
                                            <Button onClick={() => payedOrder(user.userInfo.user_id, order.id, order.total_amount)}>Оплатить</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )): <span>Нет не оплаченых заказов</span>} 
                    </div>
                </div>
            </div>
            <ModalPay show={modalVisible} onHide={() => setModalVisible(false)} userId={user.userInfo.user_id}/>
        </div>
  )
}

export default Pay
