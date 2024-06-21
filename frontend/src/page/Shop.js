import React, { useRef, useEffect, useContext, useState } from 'react'
import { Container, Image, Row, Col, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap'
import './style/shop.css'
import style from './style/module/Shop.module.css'
import logo from './../assets/img/logo.svg'
import Slider from '../components/UI/Slider/Slider'
import Carousel from 'react-bootstrap/Carousel';
import SwiperUI from '../components/UI/Swiper/SwiperUI'
import { Context } from '../index';
import { ListGroup } from 'react-bootstrap';
import {observer} from 'mobx-react-lite'
import DeviceList from '../components/DeviceList'
import { fetchDevice, fetchTypes } from '../http/deviceAPI'
import { useNavigate } from 'react-router-dom'
import { PRODUCT_ROUT } from '../utils/const'
import smart from '../assets/img/Умный дом.jpg'



const Shop = observer(() => {

    const navigate = useNavigate();

    const {device} = useContext(Context)
    const [types, setTypes] = useState()

    useEffect(() => {
        fetchTypes().then(data => device.setTypes(data))
        fetchDevice().then(data => device.setDevices(data))

        const fetchData = async () => {
            try{
                const typeData = await fetchTypes()
                setTypes(typeData)
            } catch (error) {
                console.log('Произошла ошибка', error)
            }
        }

        fetchData()
    }, [])

    const handleSelect = (id) => {
        navigate(PRODUCT_ROUT, { state: { selectedCategoryId: id } })
    };

    return (
        <Container className={style.main_container}>
            
            {/* <div className='animate_block'> */}
                {/* <div className='center d-flex'> */}
                    {/* <Image src={logo} alt="Logo"/>  */}
                    {/* <span className='stroke-text'>Умный дом для вас</span> */}
                {/* </div> */}
            {/* </div> */}
            
                <div className='center d-flex' style={{marginTop: 10, width: '99vw'}}>
                    <Image src={smart} alt="Logo" style={{width: '100%'}}/> 
                </div>
            
            <Slider />
            
            
            
            <div style={{width: 992, marginTop:10, marginBottom: 30}}>
                <div style={{width: '100%'}} className='d-flex flex-column justify-content-center'> 
                    <hr style={{height: '3px', border: 'none', color:'#702dff', backgroundColor: '#702dff'}}></hr>
                    <span className={style.text_cat}>Категории</span>
                    <hr style={{height: '3px', border: 'none', color:'#702dff', backgroundColor: '#702dff'}}></hr>
                </div>
                <Col md={12} className="mt-3">
                    <div className='d-flex flex-wrap gap-5'>
                        {types ? (
                            types.map(data => (

                                <Col md={3} style={{width: '0% !important'}} key={data.id}>
                                    <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-top`}>Перейти к категории</Tooltip>}
                                    >
                                        <div className={style.card} onClick={() => handleSelect(data.id)}>
                                            <div style={{padding:10}}>
                                                <div className='d-flex'>
                                                    <Image src={process.env.REACT_APP_API_URL + '/media/' + data.image.replace(/.*\/type/, '/type')} style={{width: '100%', borderRadius: 15}}></Image>
                                                </div>
                                                <div className='d-flex justify-content-center'>
                                                    <span style={{fontSize: 20, fontWeight: 600}}>{data.name}</span>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </OverlayTrigger>
                                </Col>
                            ))
                            ) : (
                                <Spinner animation={'border'}></Spinner>
                        )}
                    </div>  
                </Col>
            </div>
            
        </Container>
    );
})

export default Shop
