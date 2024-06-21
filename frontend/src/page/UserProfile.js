import React, { useState } from 'react'
import { Button, Form, ListGroup, Image } from 'react-bootstrap'
import Profile from '../components/UI/ProfileItem/Profile'
import HistoryOrder from '../components/UI/ProfileItem/HistoryOrder'
import personal from '../assets/img/personal.svg'
import personal_color from '../assets/img/personal_color.svg'
import order from '../assets/img/order.svg'
import order_color from '../assets/img/order_color.svg'
import style from './style/module/UserProfile.module.css'

const UserProfile = () => {
    const [valueInput, setValueInput] = useState(1)
    const [activeItem, setActiveItem] = useState(0)

    const visibleItem = (index) => {
        setActiveItem(index); // Устанавливаем индекс активного элемента
    }



    return (
        <div className='d-flex justify-content-center flex-column align-items-center' style={{width: '99vw'}}>
            <Form style={{width: 992}}>
                <div className={style.card}>
                    <ListGroup style={{width: '100%'}}>
                        <div className='d-flex' style={{width: '100%'}}>
                            <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 0} onClick={() => visibleItem(0)} className={(activeItem === 0) ? style["list_group_item_custom"] + " " + style.active : style["list_group_item_custom"]}>
                                {activeItem === 0
                                    ? <Image src={personal}></Image>
                                    : <Image src={personal_color}></Image>
                                }
                                <span>Личные данные</span>
                            </ListGroup.Item>
                            <ListGroup.Item style={{cursor: 'pointer'}} active={activeItem === 1} onClick={() => visibleItem(1)} className={(activeItem === 1) ? style["list_group_item_custom"] + " " + style.active : style["list_group_item_custom"]}>
                                {activeItem === 1
                                    ? <Image src={order}></Image>
                                    : <Image src={order_color}></Image>
                                }
                                <span>История заказов</span>
                            </ListGroup.Item> 
                        </div>
                          
                    </ListGroup>
                </div>
                <div>
                    {activeItem === 0 && <Profile />}
                    {activeItem === 1 && <HistoryOrder />}
                </div>
                
            </Form>  
        </div>
    )
}

export default UserProfile
