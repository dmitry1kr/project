import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Image, InputGroup, Spinner, Placeholder } from 'react-bootstrap';
import style from './style/module/DevicePage.module.css'
import apple from '../assets/img/apple.svg'
import Rating from '../components/UI/Rating/Rating';
import cart_white from '../assets/img/cart_white.svg'
import { ListGroup } from "react-bootstrap";
import DeviceInfo from '../components/UI/InfoDevice/DeviceInfo';
import ParametrsDevice from '../components/UI/ParametrsDevice/ParametrsDevice';
import FeedbackUser from '../components/UI/FedbackUser/FeedbackUser';
import Counter from '../components/UI/Counter/Counter';
import { observer } from 'mobx-react-lite';
import { Context } from '../index'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOneDevice } from '../http/deviceAPI';
import { addBasketDeivce, getBasketUser } from '../http/basketAPI';
import { BASKET_ROUT } from '../utils/const';

const DevicePage = observer(() => {

    const navigete = useNavigate()

    const [loading, setLoading] = useState(true)
    
    const {cart, user} = useContext(Context)

    const [device, setDevice] = useState({info: []})
    const {id} = useParams()
    const max_device = 23

    const [valueInput, setValueInput] = useState(1);

    const [activeItem, setActiveItem] = useState(0)

    const [basket, setBasket] = useState()
    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const deviceData = await fetchOneDevice(id);
                setDevice(deviceData);
    
                if (user.isAuth) {
                    const basketData = await getBasketUser(user.userInfo.user_id);
                    setBasket(basketData);
                }
    
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } 
        };
    
        fetchData();
    }, [id, user.userInfo.user_id, user.isAuth]);

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }
    console.log(device)

    
    const handleAddToCart = (user_id, device_id) => {
        addBasketDeivce(user_id, device_id)
            .then(() => {
                cart.addToCart(device);
                return getBasketUser(user_id); // Получаем обновленную корзину
            })
            .then(updatedBasket => {
                setBasket(updatedBasket); // Обновляем состояние корзины
                console.log('Basket updated:', updatedBasket);
            })
            .catch(error => {
                console.error("Произошла ошибка при добавлении товара в корзину:", error);
            });
    };

    const isInCart = (id) => {
        return basket && basket.some(data => data.device.id === id);
    }
    

    const visibleItem = (index) => {
        setActiveItem(index); 
    }

    const payDevice  = (user_id, device_id) => {
        addBasketDeivce(user_id, device_id)
            .then(() => {
                cart.addToCart(device);
                navigete(BASKET_ROUT)
                return getBasketUser(user_id); // Получаем обновленную корзину
            })
            .then(updatedBasket => {
                setBasket(updatedBasket); // Обновляем состояние корзины
                console.log('Basket updated:', updatedBasket);
            })
            .catch(error => {
                console.error("Произошла ошибка при добавлении товара в корзину:", error);
            });
    };

    
    console.log(device)
    return (
        <div className='d-flex justify-content-center'>
            <div className={style.main}>

                {/* div 1 */}
                <div className={style.section_1}> 


                    <div className={style.img_device}>
                        <Image src={process.env.REACT_APP_API_URL + '/media/' + device.image_device.split("/media/")[1]} className={style.image_}/>
                    </div>

                    <div className={style.card_device}>  
                        <div className={style.brand}>
                            <Image src={process.env.REACT_APP_API_URL + '/media/' + device.brand.image} className={style.brand_img}/>
                        </div>
                        <div className={style.device}>
                            <div>
                                <span className={style.device_name}>{device.name}</span>
                            </div>
                            <div>
                                <Rating star={device.rating_device.mean_rating} />
                            </div>
                            <div>
                                <span className={style.feedbacks}>Кол-во отзывов: {device.rating_device.count_feedbacks}</span>
                            </div>
                            <div className={style.line}>
                                <span className={style.text}>Цена</span>
                                <span className={style.text_left}>{device.price} ₽</span>
                            </div>
                            <div className={style.line}>
                                <span className={style.text}>В наличии</span>
                                <span className={style.text_left}>{device.status_accounting.quantity} шт.</span>
                            </div>
                            <div className={style.line}>
                                <span className={style.text_left}>Итого к оплате</span>
                                <span className={style.full_price}>{device.price * valueInput} ₽</span>
                            </div>
                            
                                {
                                    user.isAuth
                                    ?
                                    (device.status_accounting.status === 'закончился'
                                        ?
                                        <div className='d-flex justify-content-center'>
                                            <Button disabled>Товар закончился</Button>
                                        </div>
                                        :
                                        <div className={style.line}>
                                            <Button style={{width: '70%'}} onClick={() => {payDevice(user.userInfo.user_id, device.id)}} disabled={isInCart(device.id)}>
                                            {isInCart(device.id) ? 'В корзине ✔' : 'Купить'}
                                            </Button>
                                            <Button style={{width: '20%'}} onClick={() => {handleAddToCart(user.userInfo.user_id, device.id)}} disabled={isInCart(device.id)}>  
                                                {isInCart(device.id) ? '✔' : <Image src={cart_white}/>}
                                            </Button>
                                        </div>
                                    )
                                        
                                    :
                                    <div className='d-flex justify-content-center' >
                                        <Button disabled>Для покупки авторизуйтесь</Button>
                                    </div>
                                }
                                
                            
                        </div>
                    </div>
                </div>

                {/* div 2 */}
                <div className={style.section_2}>
                    <div className={style.device_info}>
                        <div className={style.list_group_item}>
                            <ListGroup>
                                <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 0} onClick={() => visibleItem(0)}>
                                    <span>О товаре</span>
                                </ListGroup.Item>
                                <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 1} onClick={() => visibleItem(1)}>
                                        <span>Параметры</span>
                                </ListGroup.Item>   
                                <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 2} onClick={() => visibleItem(2)}>
                                        <span>Отзывы</span>
                                </ListGroup.Item>   
                            </ListGroup>
                        </div>
                        <div>
                            {activeItem === 0 && <DeviceInfo info={device.info} />}
                            {activeItem === 1 && <ParametrsDevice params={device.characteristics} />}
                            {activeItem === 2 && <FeedbackUser deviceId={device.id}/>}
                        </div>
                    </div>
                    


                </div>
                {/* div 3 */}
                <div>

                </div>
                </div>
        </div>
    )
})

export default DevicePage
