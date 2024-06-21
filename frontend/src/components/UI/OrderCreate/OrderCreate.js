import React, { useEffect, useState } from 'react'
import { Image, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import style from './OrderCreate.module.css'
import ok from '../../../assets/img/ok.svg'
import close from '../../../assets/img/cancel.svg'
import { createOrder } from '../../../http/orderAPI';
import { deleteFromBasketDeviceAll } from '../../../http/basketAPI';


const OrderCreate = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation()
    const [data, setData] = useState();
    const [numberOrder, setNumberOrder] = useState()
    const [state, setState] = useState()

    useEffect(() => {
        if (location.state && location.state.data) {
            console.log(location.state.data, 'asdasdassdaasdasdasdasdsd');
            setData(location.state.data);
            setNumberOrder(location.state.number);
        }
    }, [location.state]);

    useEffect(() => {
        if (data) {
            const fetchData = async () => {
                try {
                    await createOrder(data);
                    await deleteFromBasketDeviceAll(data.user);
                    setState(0);
                } catch (error) {
                    setState(1);
                    console.log(error)
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [data]);

    if (loading) {
        return <Spinner animation={'grow'}/>
    }

    return (
        <div className='d-flex justify-content-center'>
            {state === 0 && (
                <div style={{width:992}}>
                    <div className={style.card} >
                        <div className='d-flex justify-content-center'>
                            <Image src={ok} className={style.img}/>
                        </div>
                        
                            <span className={style.text1}>Спасибо!</span>
                        
                            <span className={style.text2}>Номер заказа: №{numberOrder}</span>
                            <span className={style.text2}>Ваш заказ успешно оформлен. Оплатите заказ в разделе 'Оплата'</span>
                        
                        
                    </div>
                </div>
            )}
            {state === 1 && (
               <div style={{width:992}}>
                    <div className={style.card} >
                        <div className='d-flex justify-content-center'>
                            <Image src={close} className={style.img}/>
                        </div>
                        
                            <span className={style.text1}>Что то пошло не так!</span>
                        
                            <span className={style.text2}>Номер заказа: №{numberOrder}</span>
                            <span className={style.text2}>Ваш заказ успешно не был оформлен. Попробуйте еще раз или обратитесь в поддержку!</span>
                        
                        
                    </div>
                </div> 
            )}
            
        </div>
    );
};

export default OrderCreate
