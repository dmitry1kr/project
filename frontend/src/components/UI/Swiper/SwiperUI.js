import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import style from './SwiperUI.module.css'
import {observer} from 'mobx-react-lite'
import 'swiper/css';
import './style.css'
import { Context } from '../../../index';
import { ListGroup } from 'react-bootstrap';

const SwiperUI = observer(() => {

    const {device} = useContext(Context)
    console.log(device.types)

    return (
        <div className={style.main}>
            <ListGroup>
                <Swiper
                    slidesPerGroup={1}
                    slidesPerView={7}
                    className={style.main}
                >   
                
                    {device.types.map(types =>
                        <SwiperSlide
                            className={style.slide_block}
                            key={types.id}
                        >
                            <ListGroup.Item
                                style={{cursor: 'pointer'}}
                                active={types.id === device.selectedType.id}
                                onClick={() => device.setSelectedType(types)}
                                
                            >
                                
                                    {types.name}
                                
                            </ListGroup.Item>  
                        </SwiperSlide>  
                    )}
                </Swiper>
            </ListGroup>
            
            
        </div>
        
    )
})

export default SwiperUI
