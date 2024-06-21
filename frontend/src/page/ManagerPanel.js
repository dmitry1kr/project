import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Accordion, Button, Col, Dropdown, Form, Image, Row, Spinner } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Context } from '../index';
import Plot from 'react-plotly.js';
import { changeDataOrder, changeStatusOrder, getAllOrder, getStatusOrder } from '../http/orderAPI';
import style from './style/module/ManagerPanel.module.css';
import moment from 'moment-timezone';
import { getPrognoz } from '../http/prognozAPI';
import { Messages } from 'primereact/messages';
import { createCharDevice, createDevice, getSales, postBrand, postType } from '../http/managerAPI';
import { fetchBrand, fetchDevice, fetchTypes } from '../http/deviceAPI';
import Accounting from '../components/UI/Accounting/Accounting';
moment.locale('ru');
moment.tz.setDefault("Europe/Ekaterinburg");

const ManagerPanel = observer(() => {
    const msgs = useRef({});

    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleOrders, setVisibleOrders] = useState({});
    const [status, setStatus] = useState([]);
    const [orderDates, setOrderDates] = useState({});
    const [selectedFilterStatus, setSelectedFilterStatus] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [prognozData, setPrognozData] = useState()
    const [sales, setSales] = useState()

    const [devices, setDevices] = useState()
    const [selectDevice, setSelectDevice] = useState()


    const [typeBD, setTypeBD] = useState()
    const [brandBD, setBrandBD] = useState()

    const [selectType, setSelectType] = useState()
    const [selectBrand, setSelectBrand] = useState()

    const [type, setType] = useState()
    const addType = async () => {
        try {
            const fetchData = await postType(type)
            showMessage(0, 'success', 'Успешно', 'Категория добавлена');
        } catch (error) {
            console.log('Ошибка при добавлении статуса', error)
            showMessage(0, 'error', 'Ошибка', 'Ошибка при добавлении категории');
        }
    }

    const [brand, setBrand] = useState()
    const [imageBrand, setImageBrand] = useState()
    const handleImageUploadBrand = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageBrand(file);
        }
    };
    const addBrand = async () => {
        try {
            const fetchData = await postBrand(brand, imageBrand)
            showMessage(1, 'success', 'Успешно', 'Бренд добавлен');
        } catch (error) {
            console.log('Ошибка',error)
            showMessage(1, 'error', 'Ошибка', 'Ошибка при добавлении бренда');
        }
    }

    const [nameDevice, setNameDevice] = useState()
    const [priceDevice, setPriceDevice] = useState()
    const [imageDevice, setImageDevice] = useState()
    const [infoDevice, setInfoDevice] = useState()

    const handleImageUploadDevice = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageDevice(file);
        }
    };

    const addDevice = async () => {
        try {
            const fetchData = await createDevice(nameDevice, selectBrand, selectType, priceDevice, imageDevice, infoDevice)
            showMessage(2, 'success', 'Успешно', 'Устройство добавлено');
        } catch (error) {
            console.log('Ошибка',error)
            showMessage(2, 'error', 'Ошибка', 'Ошибка при добавлении устройства');
        }
    }

    const showMessage = (id, severity, summary, detail) => {
        if (msgs.current[id]) {
            msgs.current[id].clear();
            msgs.current[id].show([
                { severity, summary, detail, sticky: true, closable: false }
            ]);
        }
    };


    const getStatusMessage = (status) => {
        switch (status) {
            case 'Оплачен':
                return <span className={style.text_slave} style={{ color: 'green', fontWeight: 700, fontSize: 26 }}> {status}✔</span>;
            case 'Не оплачен':
                return <span className={style.text_slave} style={{ color: 'red', fontWeight: 700, fontSize: 26 }}> {status}❗</span>;
            case 'Доставлен':
                return <span className={style.text_slave} style={{ color: 'green', fontWeight: 700, fontSize: 26 }}> {status}✔</span>;
            case 'Доставляется':
                return <span className={style.text_slave} style={{ color: '#0070ff', fontWeight: 700, fontSize: 26 }}> {status}🚚</span>;
            case 'Отменен':
                return <span className={style.text_slave} style={{ color: 'red', fontWeight: 700, fontSize: 26 }}> {status}❌</span>;
            case 'Возврат':
                return <span className={style.text_slave} style={{ color: 'red', fontWeight: 700, fontSize: 26 }}> {status}🔄</span>;
            case 'Сборка':
                return <span className={style.text_slave} style={{ color: '#ff9a5d', fontWeight: 700, fontSize: 26 }}> {status}📦</span>;
            default:
                return null;
        }
    }

    const toggleVisibility = (orderId) => {
        setVisibleOrders(prevState => ({
            ...prevState,
            [orderId]: !prevState[orderId]
        }));
    }

    const handleDateChange = (orderId, date) => {
        setOrderDates(prevDates => ({
            ...prevDates,
            [orderId]: date,
        }));
    };

    const handleStatusChange = (orderId, status) => {
        setSelectedStatuses(prevStatuses => ({
            ...prevStatuses,
            [orderId]: status
        }));
        
    };

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    }

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                const [orders, statuses, prognoz, types, brands, devices, sales] = await Promise.all([
                    getAllOrder(),
                    getStatusOrder(),
                    getPrognoz(3, 5),
                    fetchTypes(),
                    fetchBrand(),
                    fetchDevice(),
                    getSales()
                ]);
    
                if (isMounted) {
                    setOrders(orders);
                    setStatus(statuses);
                    setPrognozData(prognoz);
                    setTypeBD(types);
                    setBrandBD(brands);
                    setDevices(devices);
                    console.log(devices);
                    setLoading(false);
                    setSales(sales)
                }
            } catch (error) {
                console.log('Ошибка', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false;
        };
    }, []);


    const getOneDevice = (name) => {
        if (!devices) {
            console.log('Devices not loaded yet');
            return null;
        }
        return devices.find(device => device.name_device === name);
    };

    const selectedDevice = getOneDevice(selectDevice);

    const handleDeviceChange = (deviceName) => {
        setCharacteristics({});
        setSelectDevice(deviceName);
    };

    const [characteristics, setCharacteristics] = useState([]);

    const handleCharacteristicChange = (name, value) => {
        console.log('asdasdasdasd', name, value);
        const updatedCharacteristics = { ...characteristics }; 
        updatedCharacteristics[name] = { ...updatedCharacteristics[name], value: value };
        setCharacteristics(updatedCharacteristics);
    };

    console.log('charachter', characteristics)

    const addCharactersticsDevice = (id, type) => {
        

        const characteristicsArray = Object.keys(characteristics).map(key => ({
            value: characteristics[key].value,
            device: id,
            characteristic: key
        }));
    
        createCharDevice(characteristicsArray);
    }

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }

    const filteredOrders = selectedFilterStatus
        ? orders.filter(order => order.status === selectedFilterStatus)
        : orders;

    
    const changeStatus = (id) => {
        const status = selectedStatuses[id];
        try{
            changeStatusOrder(id, status);
            showMessage(id, 'success', 'Успешно', 'Статус изменён');
        } catch(error) {
            console.log('Ошибка при изменении статуса', error)
            showMessage(id, 'error', 'Ошибка', 'Статус не был изменён');
        }
        
    }

    const changeData = (id) => {
        const date = orderDates[id];
        try{
            changeDataOrder(id, moment(date).format("YYYY-MM-DD HH:mm:ss"));
            showMessage(id, 'success', 'Успешно', 'Дата изменена');
        } catch(error) {
            console.log('Ошибка при изменении статуса', error)
            showMessage(id, 'error', 'Ошибка', 'Дата не была изменёна');
        }
        
    }

   
    console.log(sales)
    return (
        <div className='d-flex flex-column align-items-center' style={{ width: '99vw' }}>
            
            <div style={{ width: 992, margin: '20px 0 20px 0' }}>
                <div style={{width: '100%', marginBottom: 30}} className='d-flex flex-column justify-content-center'>
                    <hr style={{height: '3px', border: 'none', color:'#702dff', backgroundColor: '#702dff'}}></hr>
                    <span className={style.text_mod}>Страница модератора</span>
                    <hr style={{height: '3px', border: 'none', color:'#702dff', backgroundColor: '#702dff'}}></hr>
                </div>
                <div style={{ marginTop: 30, marginBottom: 10 }}>
                    <span className={style.text}>Управление</span>
                </div>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header style={{ button: {color: 'black !important'} }}>Добавить тип</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div style={{width: '100%'}}>
                                    <Messages ref={(el) => msgs.current[0] = el} /> 
                                </div>
                                <Form.Control
                                    value={type}
                                    onChange={(e) => {setType(e.target.value)}}
                                    placeholder='Введите название типа'
                                />
                                <Button style={{ margin: '10px 0 0 0' }} onClick={() => {addType()}}>Добавить</Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Добавить бренд</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div style={{width: '100%'}}>
                                    <Messages ref={(el) => msgs.current[1] = el} /> 
                                </div>
                                <Form.Control
                                    value={brand}
                                    onChange={(e) => {setBrand(e.target.value)}}
                                    placeholder='Введите название бренда'
                                />
                                <Form.Control placeholder='Выберите файл' type='file' onChange={handleImageUploadBrand} style={{marginTop: 10}}></Form.Control>
                                <Button style={{ margin: '10px 0 0 0' }} onClick={() => {addBrand()}}>Добавить</Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Добавить устройство</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <div style={{width: '100%'}}>
                                    <Messages ref={(el) => msgs.current[2] = el} /> 
                                </div>
                                <Dropdown className='d-flex gap-3'>
                                    <Dropdown.Toggle>Выберите тип</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {typeBD.map(type =>
                                            <Dropdown.Item onClick={() => {setSelectType(type.name)}} key={type.id}>{type.name}</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                    <Form.Control value={selectType} placeholder='' disabled/>
                                </Dropdown>
                                <Dropdown style={{ margin: '10px 0 10px 0' }} className='d-flex gap-3'>
                                    <Dropdown.Toggle>Выберите бренд</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {brandBD.map(brand =>
                                            <Dropdown.Item onClick={() => {setSelectBrand(brand.name)}} key={brand.id}>{brand.name}</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                    <Form.Control value={selectBrand} placeholder='' disabled/>
                                </Dropdown>
                                <Form.Control placeholder='Введите название устройства' value={nameDevice} onChange={(e) => {setNameDevice(e.target.value)}}/>
                                <Form.Control placeholder='Введите стоимость' type='number' style={{ margin: '10px 0 10px 0' }} onChange={(e) => {setPriceDevice(e.target.value)}}/>
                                <Form.Control placeholder='Выберите файл' type='file' onChange={handleImageUploadDevice}/>
                                <Form.Control placeholder='Введите описание' style={{marginTop: 10}} onChange={(e) => {setInfoDevice(e.target.value)}}/>
                                
                                
                                <Button style={{ marginTop: 10 }} onClick={() => {addDevice()}}>Добавить</Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Добавить характеристики устройства</Accordion.Header>
                        <Accordion.Body>
                            <Dropdown className='d-flex gap-3'>
                                <Dropdown.Toggle>Выберите устройство</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {devices.map(device =>
                                        <Dropdown.Item onClick={() => handleDeviceChange(device.name_device)} key={device.id}>{device.name_device}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                                <Form.Control value={selectDevice} placeholder='' disabled/>
                            </Dropdown>
                            <div style={{ marginTop: 20}} className='d-flex flex-column'>
                                {selectedDevice && selectedDevice.characteristics 
                                    ? selectedDevice.characteristics.map((characteristic, index) => (
                                        <div className='d-flex flex-column' style={{ width: '100%'}} key={index}>
                                            <div className='d-flex flex-row'>
                                                <div style={{width: '30%'}}>
                                                    <span>{characteristic.name}</span>
                                                </div>
                                                <div style={{width: '70%'}}>
                                                    <Form.Control
                                                        value={characteristics[characteristic.name]?.value || ''} 
                                                        onChange={(e) => handleCharacteristicChange(characteristic.name, e.target.value)}
                                                        placeholder='Введите название устройства'
                                                    />
                                                </div>
                                            </div>
                                            <hr></hr>
                                        </div>
                                    ))
                                    : <div><span>Устройство не выбрано</span></div>
                                }
                                <Button onClick={() => {addCharactersticsDevice(selectedDevice.id, selectedDevice.type)}}>Добавить характеристики</Button>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    
                </Accordion>

                <div style={{ marginTop: 30, marginBottom: 10 }}>
                    <span className={style.text}>Прогноз посетителей</span>
                </div>

                <Accordion>                       
                    <Accordion.Item eventKey="1">
                            <Accordion.Header>Прогноз</Accordion.Header>
                            <Accordion.Body className='d-flex flex-column'>
                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                    <Plot
                                        data={[
                                            {
                                                x: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
                                                y: prognozData.forecast_values,
                                                type: 'scatter',
                                                mode: 'lines+markers',
                                                marker: { color: 'red' },
                                                name: 'Прогнозные значения'
                                            },
                                            {
                                                x: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
                                                y: prognozData.data,
                                                type: 'scatter',
                                                mode: 'lines+markers',
                                                marker: { color: 'blue' },
                                                name: 'Данные из БД'
                                            },
                                        ]}
                                        layout={{ width: '100%', height: '100%', title: 'Прогноз посетителей' }}
                                        
                                    />
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                    <span>MAE(Средняя абсолютная ошибка): <span style={{fontWeight:600}}>{prognozData.MAE}</span></span>
                                    <span>MSE(Среднеквадратичная ошибка): <span style={{fontWeight:600}}>{prognozData.MSE}</span></span>
                                    <span>Оценка точности: <span style={{fontWeight:600, color: 'green'}}>{prognozData.average_relative_error}</span></span>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        
                </Accordion>
                <div style={{ marginTop: 30, marginBottom: 10 }}>
                    <span className={style.text}>Учет</span>
                </div>
                <Accordion>                       
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Учет товаров</Accordion.Header>
                        <Accordion.Body className='d-flex flex-column align-items-center'>
                            <Accounting ></Accounting>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                            <Accordion.Header>Продажи</Accordion.Header>
                            <Accordion.Body className='d-flex flex-column'>
                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                    <Plot
                                        data={[
                                            {
                                                x: sales.sales_dates,
                                                y: sales.actual_sales,
                                                type: 'scatter',
                                                mode: 'lines+markers',
                                                marker: { color: 'red' },
                                            },
                                            
                                        ]}
                                        layout={{ width: '100%', height: '100%', title: 'Продажи за день' }}
                                        
                                    />
                                </div>

                            </Accordion.Body>
                        </Accordion.Item>
                </Accordion>

                <div style={{ marginTop: 30, marginBottom: 10 }}>
                    <span className={style.text}>Заказы пользователей</span>
                </div>
                
                <Accordion>
                    <Accordion.Item eventKey='1'>
                        <Accordion.Header>Все заказы</Accordion.Header>
                        <Accordion.Body>
                            <div className='d-flex flex-column' style={{ rowGap: 40 }}>
                                <div className={style.card}>
                                    <div style={{ padding: 20 }} className='d-flex justify-content-between align-items-center flex-column'>
                                        <span className={style.text_slave} style={{ fontWeight: 700, fontSize: 26 }}>Фильтры</span>
                                        <Form.Select
                                            value={selectedFilterStatus}
                                            onChange={(e) => setSelectedFilterStatus(e.target.value)}
                                        >
                                            <option value="">Все заказы</option>
                                            {status.map(status => (
                                                <option key={status.id} value={status.description}>
                                                    {status.description}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                                {filteredOrders.map(order => (
                                    <div className={style.card} key={order.id}>
                                        <div style={{ padding: 20 }} className='d-flex justify-content-between align-items-center flex-column'>
                                            <div style={{width: '100%'}}>
                                                <Messages ref={(el) => msgs.current[order.id] = el} />  
                                            </div>
                                             
                                            
                                            <div className='d-flex flex-row justify-content-between' style={{ width: '100%' }}>
                                                <div className='d-flex flex-column ' style={{ rowGap: 15, width: '45%' }}>
                                                    <div>
                                                        {getStatusMessage(order.status)}
                                                        <span style={{fontSize:25, fontWeight: 700}}>{order.type_order}</span>
                                                    </div>
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
                                                            <span className={style.text}>Дата выдачи: {order.pickup_order.date_pickup}</span>
                                                        }
                                                        
                                                        <Calendar
                                                            
                                                            onChange={(e) => handleDateChange(order.id, e.value)}
                                                            showIcon
                                                            style={{borderRadius: 5}}
                                                            dateFormat='yy-mm-dd'
                                                            showTime
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className={style.text}>Изменение статуса заказа:</span>
                                                            <Form.Select
                                                                style={{height: '75.2%'}}
                                                                value={selectedStatuses[order.id] || ''}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            >
                                                                <option value="">Выберите статус</option>
                                                                {status.map(status => (
                                                                    <option key={status.id} value={status.description}>
                                                                        {status.description}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                    </div>
                                                </div>
                                                <div style={{ width: '45%' }} className={style.devices}>
                                                    {order.order_devices.map(device => (
                                                        <div className={style.device_card} key={device.device.id}>
                                                            <div className={style.device_card_next}>
                                                                <div>
                                                                    <Image src={process.env.REACT_APP_API_URL + '/media/' + device.device.image_device.split("/media/")[1]} className={style.image} />
                                                                </div>
                                                                <div>
                                                                    <span className={style.device_name}>{device.device.name_device.replace(/^(\S+\s+\S+).*/, '$1')}</span>
                                                                </div>
                                                                <div>
                                                                    <div>
                                                                        {device.quantity} шт
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
                                            <div style={{ width: '100%', rowGap: 10 }} className='d-flex flex-column'>
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
                                                <div className='d-flex justify-content-end gap-3'>
                                                    <Button onClick={() => changeData(order.id)}>Изменить дату</Button>
                                                    <Button onClick={() => changeStatus(order.id)}>Изменить статус</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    );
});

export default ManagerPanel;
