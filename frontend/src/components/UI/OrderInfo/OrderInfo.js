import React, { useEffect, useState } from 'react'
import { YMaps, Map, SearchControl, FullscreenControl, GeolocationControl, Placemark} from '@pbe/react-yandex-maps';
import { Button, Form, FormControl, Image } from 'react-bootstrap'
import style from './OrderInfo.module.css'
import { observer } from 'mobx-react-lite';
import moment from 'moment-timezone';
moment.locale('ru');
moment.tz.setDefault("Europe/Ekaterinburg");


const OrderInfo = observer(({ active, onOrderInfoChange }) => {

 
    const [activeItem, setActiveItem] = useState(0)

    const [ visibleComment, setVisibleComment] = useState(false)

    const [coordinate, setCoordinate] = useState("")

    const [ addressName, setAddressName ] = useState('');

    const [maps, setMaps] = useState(null);
    const onLoad = (map) => {
        setMaps(map);
      };

    const getCoords = (e) => {
        maps.geocode(e.get('coords')).then(res => {
            let firstGeoObject = res.geoObjects.get(0);
            setAddressName(firstGeoObject.getAddressLine())
        })
        

    };

    const [formData, setFormData] = useState({
        name_user: '',
        telephone: '',
        address: '',
        entrance: '',
        flat: '',
        comments: null,
        date_delivery: moment().format("YYYY-MM-DD HH:mm:ss"),
    })

    const [formPickup, setFormPickup] = useState({
        name_user: '',
        telephone: '',
        date_pickup: moment().format("YYYY-MM-DD HH:mm:ss"),
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const handleChangePickup = (e) => {
        const { name, value } = e.target;
        setFormPickup(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        setActiveItem(active);
        onOrderInfoChange({
            paymentMethod: 'Наличные',
            formData,
            formPickup,
        })
    }, [active, formData, formPickup]);
    

    return (
        <div style={{width: '45%', height: '100%'}} className={style.card}>
            {activeItem === 0 && (
                <div style={{margin: 15}}>
                    <span className={style.text}>Укажите адрес доставки</span>
                    <div style={{height: '43%'}}>  
                        <YMaps query={{apikey: 'f7c8bd9c-47cf-4bd7-9367-6be3cddd24a7'}}>
                            <div style={{height: '100%'}}>
                                <Map 
                                    defaultState={{ center: [57.154136197354866,65.53755355130535], zoom: 11 }}
                                    width={'100%'}
                                    onClick={(e) => {getCoords(e); setCoordinate(e.get("coords"))}}
                                    modules={["geolocation", "geocode"]}
                                    onLoad={(ymaps) => onLoad(ymaps)}                               
                                >
                                    <GeolocationControl options={{ float: "left" }} />
                                    <SearchControl options={{ float: "right" }} />
                                    <FullscreenControl />
                                    <Placemark 
                                        options={
                                            {
                                            preset: 'islands#circleIcon', // список темплейтов на сайте яндекса
                                            iconColor: '#702DFF', // цвет иконки, можно также задавать в hex
                                            } }
                                        geometry={coordinate}
                                        properties={{iconContent: 'Y', hintContent: 'Я появляюсь при наведении на метку', balloonContentBody: addressName}}
                                        // onClick={coordinate => getCoords(coordinate)}
                                    />
                                </Map>
                            </div>
                        </YMaps>
                    </div>
                    <div style={{marginTop: 20, marginBottom:15}}>
                        <span className={style.text}>ФИО</span>
                        <FormControl type='text' placeholder='Введите ФИО' className={style.custom_input} name='name_user' value={formData.name_user} onChange={handleChange}/>
                    </div>
                    <div style={{marginBottom:15}}>
                        <span className={style.text}>Телефон</span>
                        <FormControl placeholder='+7' type='number' className={style.custom_input} maxLength='11' name='telephone' value={formData.telephone} onChange={handleChange}></FormControl>
                    </div>
                    <div style={{marginBottom:15}}>
                        <span className={style.text}>Адрес</span>
                        <FormControl type='text' placeholder='Адрес' name='address' value={formData.address = addressName} className={style.custom_input} onChange={handleChange}/>
                    </div>
                    <div className='d-flex' style={{columnGap: 45, marginBottom: 15}}>
                        <div>
                            <span className={style.text}>Подъезд</span>
                            <FormControl type='number' placeholder='Номер подъезда' className={style.custom_input} name='entrance' value={formData.entrance} onChange={handleChange}/>
                        </div>
                        <div>
                            <span className={style.text}>Квартира</span>
                            <FormControl type='number' placeholder='Номер квартиры' className={style.custom_input} name='flat' value={formData.flat} onChange={handleChange}/>
                        </div>
                    </div>
                    <div style={{marginBottom:15}}>
                        <span className={style.text}>Способ оплаты</span>
                        <Form.Select aria-label="Выберите способ олпаты" className={style.custom_input} name='paymentMethod' value={formData.paymentMethod} onChange={handleChange}>
                            <option value="Наличные">Наличные</option>
                            <option value="Банковская карта">Банковская карта</option>
                        </Form.Select>
                    </div>
                    <div>
                        
                        {visibleComment
                            ?  
                            <div className='d-flex flex-column'>
                                <Button onClick={() => setVisibleComment(false)} style={{marginBottom: 15}}>Убрать коментарий</Button>
                                <span className={style.text}>Коментарий</span>
                                <FormControl type='text' placeholder='Введите коментарий' className={style.custom_input} name='comments' value={formData.comments} onChange={handleChange}/>
                            </div>
                            :
                            <Button onClick={() => setVisibleComment(true)} style={{width: '100%'}}>Добавить коментарий</Button>
                        }
                    </div>
                </div>
            )}
            {activeItem === 1 && (
                <div style={{margin: 15}}>
                    <div style={{marginTop: 20, marginBottom:15}}>
                        <span className={style.text}>ФИО</span>
                        <FormControl type='text' placeholder='Введите ФИО' className={style.custom_input} name="name_user" value={formPickup.name_user} onChange={handleChangePickup}/>
                    </div>
                    <div style={{marginBottom:15}}>
                        <span className={style.text}>Телефон</span>
                        <FormControl placeholder='+7' type='number' className={style.custom_input} maxLength='11' name="telephone" value={formPickup.telephone} onChange={handleChangePickup}></FormControl>
                    </div>
                </div>
            )}
        </div>
    )
})

export default OrderInfo
