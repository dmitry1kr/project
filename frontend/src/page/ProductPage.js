import React, { useEffect, useState, useContext } from 'react';
import style from './style/module/ProductPage.module.css';
import { Button, Col, Form, Image, ListGroup, Spinner, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Context } from '../index';
import { fetchBrand, fetchDevice, fetchTypes } from '../http/deviceAPI';
import Rating from '../components/UI/Rating/Rating';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';
import { addBasketDeivce, getBasketUser } from '../http/basketAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEVICE_ROUT } from '../utils/const';

const ProductPage = () => {
    const { device, user, cart } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [priceSelected, setPriceSelected] = useState([0, 10000]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [brand, setBrand] = useState([]);
    const [activeItem, setActiveItem] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [basket, setBasket] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activePriceSwitch, setActivePriceSwitch] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const typesData = await fetchTypes();
                device.setTypes(typesData);

                const deviceData = await fetchDevice();
                device.setDevices(deviceData);

                const brandData = await fetchBrand();
                setBrand(brandData);

                const basketData = await getBasketUser(user.userInfo.user_id);
                setBasket(basketData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (location.state && location.state.selectedCategoryId) {
            const selectedCategoryId = location.state.selectedCategoryId;
            const selectedCategory = device.types.find(type => type.id === selectedCategoryId);
            if (selectedCategory) {
                setSelectedCategory([selectedCategory]);
            }
        }
    }, [location.state, device.types]);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const getSeverity = (product) => {
        switch (product.status_accounting.status) {
            case 'в наличии':
                return 'success';
            case 'осталось мало':
                return 'warning';
            case 'закончился':
                return 'danger';
            default:
                return null;
        }
    };

    const visibleItem = (index) => {
        setActiveItem(index);
    };

    const filterProducts = () => {
        return device.devices.filter((product) => {
            const matchesCategory = selectedCategory.length === 0 || selectedCategory.some(cat => cat.name === product.type);
            const matchesPrice = product.price >= priceSelected[0] && product.price <= priceSelected[1];
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand.name);
            const matchesSearch = product.name_device.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesPrice && matchesBrand && matchesSearch;
        });
    };

    const productList = (product, index) => {
        return (
            <Col md={12} style={{ margin: '15px 0' }} key={index}>
                <div className={style.product}>
                    <div className={style.card_item}>
                        <div style={{ height: '100%', width: '20%' }}>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip id={`tooltip-top`}>Перейти на страницу товара</Tooltip>}
                            >
                                <Image
                                    src={process.env.REACT_APP_API_URL + '/media/' + product.image_device.split("/media/")[1]}
                                    className={style.img_list}
                                    onClick={() => navigate(DEVICE_ROUT + '/' + product.id)}
                                />
                            </OverlayTrigger>
                        </div>
                        <div className='d-flex justify-content-between' style={{ width: '77%', height: '100%' }}>
                            <div className='d-flex flex-column'>
                                <span>{product.name_device}</span>
                                <Rating star={product.rating_device.mean_rating} />
                                <div className='d-flex gap-2'>
                                    <div className="flex align-items-center gap-3">
                                        <i className="pi pi-tag"></i>
                                        <span className="font-semibold">{product.type}</span>
                                    </div>
                                    <Tag value={product.status_accounting.status} severity={getSeverity(product)}></Tag>
                                </div>
                            </div>
                            <div className='d-flex flex-column gap-3'>
                                <span style={{textAlign: 'right'}}>{product.price} ₽</span>
                                {
                                    product.status_accounting.status === 'закончился'
                                    ?
                                    <Button disabled>
                                        <span>Товар закончился</span>
                                    </Button>
                                    :
                                    <Button onClick={() => handleAddToCart(user.userInfo.user_id, product.id)} disabled={isInCart(product.id)}>
                                        <i className={isInCart(product.id) ? 'pi pi-check' : 'pi pi-shopping-cart'} style={{ color: 'white' }}></i>
                                    </Button>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        );
    };

    const productGrid = (product, index) => {
        return (
            <Col md={6} className="mt-3 p-2" style={{ margin: '15px 0' }} key={index}>
                <div className={style.product}>
                    <div className={style.card_item}>
                        <div style={{ width: '100%', height: '100%' }}>
                            <div className='d-flex justify-content-between gap-2'>
                                <div className="flex align-items-center gap-3">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.type}</span>
                                </div>
                                <Tag value={product.status_accounting.status} severity={getSeverity(product)}></Tag>
                            </div>
                            <div style={{ height: '100%', width: '100%', marginTop: 15 }}
                                className='d-flex justify-content-center'
                                id="product" data-name="перейти на страницу товара"
                            >
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id={`tooltip-top`}>Перейти на страницу товара</Tooltip>}
                                >
                                    <Image
                                        src={process.env.REACT_APP_API_URL + '/media/' + product.image_device.split("/media/")[1]}
                                        className={style.img_list}
                                        style={{ width: '60%', height: '60%' }}
                                        onClick={() => navigate(DEVICE_ROUT + '/' + product.id)}
                                    />
                                </OverlayTrigger>
                            </div>
                            <div className='d-flex justify-content-center' style={{ width: '100%', marginTop: 15 }}>
                                <span style={{ width: '60%', textAlign: 'center' }}>{product.name_device}</span>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <Rating star={product.rating_device.mean_rating} />
                            </div>
                            <div className='d-flex justify-content-between'>
                                <span>{product.price} ₽</span>
                                {
                                    product.status_accounting.status === 'закончился'
                                    ?
                                    <Button disabled>
                                        <span>Товар закончился</span>
                                    </Button>
                                    :
                                    <Button onClick={() => handleAddToCart(user.userInfo.user_id, product.id)} disabled={isInCart(product.id)}>
                                        <i className={isInCart(product.id) ? 'pi pi-check' : 'pi pi-shopping-cart'} style={{ color: 'white' }}></i>
                                    </Button>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        );
    };

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '553px' }}>
                <Spinner animation={'border'} />
            </div>
        );
    }

    const filteredProducts = filterProducts();
    const categories = device.types.map(type => ({
        id: type.id,
        name: type.name
    }));

    const handleAddToCart = (user_id, device_id) => {
        addBasketDeivce(user_id, device_id)
            .then(() => {
                cart.addToCart(device);
                return getBasketUser(user_id); 
            })
            .then(updatedBasket => {
                setBasket(updatedBasket); 
            })
            .catch(error => {
                console.error("Произошла ошибка при добавлении товара в корзину:", error);
            });
    };

    const isInCart = (id) => {
        return Array.isArray(basket) && basket.some(data => data.device.id === id);
    };

    const handlePriceSwitchChange = (range, switchIndex) => {
        setPriceSelected(range);
        setActivePriceSwitch(switchIndex);
    };

    const handleApplyFilters = () => {
        setPriceSelected([0, 100000]);
        setSelectedBrands([]);
        setActivePriceSwitch(null);
    };

    return (
        <div className='d-flex justify-content-center' style={{ marginTop: 50, width: '99vw' }}>
            <div style={{ width: 992 }}>
                <div>
                    <span className={style.text_main}>Все продукты</span>
                </div>
                <div className='d-flex justify-content-between'>
                    <div style={{ width: '25%' }}>
                        <div style={{ marginBottom: 20 }}>
                            <Form.Control
                                placeholder='Поиск'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className={style.card} style={{ padding: 5 }}>
                                <div>Фильтры</div>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Цена</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='d-flex flex-column gap-3'>
                                                <InputText value={priceSelected.join(' - ')} />
                                                <Slider value={priceSelected} onChange={(e) => setPriceSelected(e.value)} range max={100000} />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch-0"
                                                    label="Любая цена"
                                                    onChange={() => handlePriceSwitchChange([0, 100000], 0)}
                                                    checked={activePriceSwitch === 0}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch-1"
                                                    label="от 0 до 1000"
                                                    onChange={() => handlePriceSwitchChange([0, 1000], 1)}
                                                    checked={activePriceSwitch === 1}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch-2"
                                                    label="от 1000 до 2000"
                                                    onChange={() => handlePriceSwitchChange([1000, 2000], 2)}
                                                    checked={activePriceSwitch === 2}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch-3"
                                                    label="от 2000 до 5000"
                                                    onChange={() => handlePriceSwitchChange([2000, 5000], 3)}
                                                    checked={activePriceSwitch === 3}
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch-4"
                                                    label="от 5000"
                                                    onChange={() => handlePriceSwitchChange([5000, 100000], 4)}
                                                    checked={activePriceSwitch === 4}
                                                />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Производитель</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='d-flex flex-column gap-3'>
                                                {brand.map(data => (
                                                    <Form.Check
                                                        type="switch"
                                                        id={`custom-switch-${data.id}`}
                                                        key={data.id}
                                                        label={data.name}
                                                        checked={selectedBrands.includes(data.name)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setSelectedBrands(prev =>
                                                                checked ? [...prev, data.name] : prev.filter(name => name !== data.name)
                                                            );
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <div className='d-flex justify-content-center'>
                                    <Button style={{ marginTop: 20, width: '100%' }} onClick={handleApplyFilters}>Сбросить фильтры</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '73%' }}>
                        <div className={style.card} style={{ padding: 5 }}>
                            <span>Категории</span>
                            <div>
                                <div className="card flex justify-content-center">
                                    <MultiSelect
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.value)}
                                        options={categories}
                                        optionLabel="name"
                                        display="chip"
                                        placeholder="Выбор категории"
                                        maxSelectedLabels={3}
                                        className="w-full md:w-20rem"
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div className={style.card} style={{ padding: 5 }}>
                                <ListGroup style={{ width: '100%' }} className='justify-content-end'>
                                    <div className='d-flex align-items-center'>
                                        <ListGroup.Item style={{ cursor: 'pointer' }} active={activeItem === 0} onClick={() => visibleItem(0)} className={(activeItem === 0) ? `${style["list_group_item_custom"]} ${style.active}` : style["list_group_item_custom"]}>
                                            {activeItem === 0
                                                ? <i className="pi pi-list" style={{ color: 'white' }}></i>
                                                : <i className="pi pi-list"></i>
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ cursor: 'pointer' }} active={activeItem === 1} onClick={() => visibleItem(1)} className={(activeItem === 1) ? `${style["list_group_item_custom"]} ${style.active}` : style["list_group_item_custom"]}>
                                            {activeItem === 1
                                                ? <i className="pi pi-table" style={{ color: 'white' }}></i>
                                                : <i className="pi pi-table"></i>
                                            }
                                        </ListGroup.Item>
                                    </div>
                                </ListGroup>
                            </div>
                            {activeItem === 0 && filteredProducts.map((product, index) => productList(product, index))}
                            <Col md={12}>
                                <div className='d-flex flex-wrap justify-content-between'>
                                    {activeItem === 1 && filteredProducts.map((product, index) => productGrid(product, index))}
                                </div>
                            </Col>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
