import React, { useContext } from 'react'
import { Button, Col, Image } from 'react-bootstrap'
import Rating from './UI/Rating/Rating'
import style from './style/DeviceList.module.css'
import { useNavigate } from 'react-router-dom'
import { DEVICE_ROUT } from '../utils/const'
import { observer } from 'mobx-react-lite'
import { addBasketDeivce, deleteFromBasketDevice } from '../http/basketAPI'

const DeviceItem = observer(({device, cart, user}) => {

    const navigate = useNavigate()
    
    // const handleAddToCart = () => {
        // cart.addToCart(device);
        // console.log('Added to cart:', device);
    // };
    console.log(device, 'device', user.userInfo.email, cart)

    const handleAddToCart = (user_id, device_id) => {
        addBasketDeivce(user_id, device_id)
            .then(() => {
                cart.addToCart(device);
            })
            .catch(error => {
                console.error("Произошла ошибка при добавлении товара в корзину:", error);
            });
    };
    


    const isInCart = cart.cartItems.some(item => item.id === device.id);

    return (
        <Col md={3} style={{width: '0% !important'}}>
            <div>
                <div className={style.card}>
                    <div className={style.card_item}>
                        <div>
                            <Image src={process.env.REACT_APP_API_URL + '/media/' + device.image_device.split("/media/")[1]} style={{width:"100%", height:"100%"}} onClick={() => navigate(DEVICE_ROUT + '/' + device.id)}/>
                        </div>
                        <div className={style.brand}>
                            <span style={{marginRight: 2}}>{device.brand.name}</span>
                            <Image src={process.env.REACT_APP_API_URL + '/media/' + device.brand.image} className={style.logo_brand}/>
                        </div>
                        <div>
                            <span className={style.device_name}>{device.name_device}</span>
                        </div>
                        <div>
                            <Rating star={device.rating_device.mean_rating}/>
                            <span style={{paddingBottom:5}}>{device.rating_device.mean_rating}</span>
                        </div>
                        <div>
                            <span className={style.price}>{device.price} ₽</span>
                        </div>
                        <div>
                            {/* <Button style={{width: '100%', background: 'linear-gradient(150deg, #2f0035, #702DFF)'}} onClick={handleAddToCart} disabled={isInCart}> */}
                            <Button style={{width: '100%', background: 'linear-gradient(150deg, #2f0035, #702DFF)', marginBottom: 10}} onClick={() => handleAddToCart(user.userInfo.user_id, device.id)} disabled={isInCart}>
                                {isInCart ? 'В корзине✔' : 'В корзину'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    )
})

export default DeviceItem
