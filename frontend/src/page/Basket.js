import React, { useState, useEffect, useContext } from 'react'
import style from './style/module/Basket.module.css'
import { CloseButton, Image, Button, FormControl, Spinner } from 'react-bootstrap'
import Counter from '../components/UI/Counter/Counter'
import { Form } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import { deleteFromBasketDevice, getBasketUser, getLastNumberOrder } from '../http/basketAPI'
import { useNavigate } from 'react-router-dom'
import { MAKE_ORDER } from '../utils/const'

const Basket = observer(() => {

    const {user, cart} = useContext(Context)
    const [ number, setNumber ] = useState()
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()


    useEffect(() => {
        
            getBasketUser(user.userInfo.user_id)
                .then(data => {
                    cart.clearCart()
                    data.map(data => {
                        cart.addToCart(data);
                    });
                    cart.calculateTotalPrice();
                })
                .catch(error => {
                    console.error("Произошла ошибка при проверке:", error);
                }).finally(() => setLoading(false)); 
        
        
        getLastNumberOrder()
            .then(data => {
                setNumber((parseInt(data[0].number_order) + 1).toString().padStart(data[0].number_order.length, '0'))
            })
       
    }, []);
    

    const handleQuantityChange = (id, quantity) => {
        cart.updateCartItemQuantity(id, quantity); 
    };


    const handleRemoveItem = (user_id, device_id, basket_id) => {
        deleteFromBasketDevice(user_id, device_id)
            .then(() => {
                cart.removeFromCart(basket_id);
            })
            .catch(error => {
                console.error("Произошла ошибка при удалении товара из корзины:", error);
            });
    };


    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }

    return (
        <div className='d-flex justify-content-center' style={{marginTop: 50}}>
            <div style={{ width: 992 }} className={style.basket_container}>
                <div className={style.container_1}>
                    <div>
                        <span className={style.cart}>Корзина</span>
                    </div>

                    {cart.cartItems.map(item => (
                        <div className={style.order} key={item.basket}>
                            <div>
                                <CloseButton onClick={() => handleRemoveItem(user.userInfo.user_id, item.device.id, item.id)}/>
                            </div>
                            <div>
                                <Image src={process.env.REACT_APP_API_URL + '/media/' + item.device.image_device.split("/media/")[1]} className={style.image} />
                            </div>
                            <div>
                                <span className={style.device_name}>{item.device.name_device.replace(/^(\S+\s+\S+).*/, '$1')}</span>
                            </div>
                            <div>
                                <Counter
                                    initialValue={item.quantity}
                                    maxDevice={item.device.status_accounting.quantity}
                                    onQuantityChange={quantity => handleQuantityChange(item.id, quantity)}
                                    idCart = {item.id}
                                />
                            </div>
                            <div className={style.price_block}>
                                <span className={style.price_device}>{item.device.price * item.quantity} ₽</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={style.section_2}>
                    <div>
                        <div className={style.main_order}>
                            <div className={style.slave_order}>
                                <span className={style.order_n}>Заказ № {number}</span>
                                <div className={style.line}>
                                    <span className={style.text_line}>Товаров в корзине</span>
                                    <span className={style.text_line}>{cart.calculateTotalPrice()} ₽</span>
                                </div>
                                <div className={style.line}>
                                    <span className={style.text_line}>Промокод</span>
                                    <span className={style.text_promo}>-100 ₽</span>
                                </div>
                                <div className={style.line_col}>
                                    <span className={style.text_line}>Итого к оплате</span>
                                    <span className={style.text_line_price}>{cart.calculateTotalPrice()} ₽</span>
                                </div>
                                <Button onClick={() => navigate(MAKE_ORDER + '/' + number)}>Оформить заказ</Button>
                            </div>
                        </div>
                    </div>

                    <div style={{margin: '20px 0 20px 0'}}>
                        <span className={style.text_line}>Промокод</span>
                        <div className={style.line}>
                            <Form.Control
                                type="email"
                                placeholder="Введите промокод"
                                style={{backgroundColor: 'rgb(251 250 250)', boxShadow: '10px 5px 5px rgba(111, 45, 255, 0.26)', width: '50%'}}
                            />
                            <Button style={{width: '40%'}}>Подтвердить</Button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
});

export default Basket
