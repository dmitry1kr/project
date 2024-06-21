import React, {useContext, useRef} from 'react'
import Carousel from 'react-bootstrap/Carousel';
import { observer } from 'mobx-react-lite'
import { Context } from '../../../index'
import style from './Slider.module.css'
import { useEffect } from 'react';


const Slider = observer(() => {

    const {slider} = useContext(Context)

    return (
        <Carousel fade data-bs-theme="light" className={style.main}>
            {slider.images.map(image => (
                <Carousel.Item key={image.id} style={{width: '100%', height: '100%', background: 'linear-gradient(150deg, #2f0035, #702DFF)', borderRadius: 15}}>
                    
                    <Carousel.Caption className='d-flex'>
                        <div className='d-flex justify-content-between' style={{width: 800, height: 300}}>
                            <div className='d-flex flex-column' style={{color: 'white', width: '45%'}}>
                                <span style={{fontSize: 25, fontWeight: 700, marginBottom: 5}}>{slider.logo[image.id - 1].name}</span>
                                <span style={{fontSize: 15, fontWeight: 600, marginBottom: 5}}>{slider.header[image.id - 1].name}</span>
                                <p>{slider.description[image.id - 1].name}</p>
                            </div>
                            <div style={{ width: '50%'}}>
                                <img src={image.img} alt={`Slide ${image.id}`} className={style.image_slide}/>
                            </div>
                        </div>
                        
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    )
})

export default Slider
