import React, { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'react-bootstrap/Image'
import { Row, Col, Spinner } from 'react-bootstrap'
import logo from '../../../assets/img/logo.svg'
import style from './Navbar.module.css'
import person from '../../../assets/img/person.svg'
import cart from '../../../assets/img/cart.svg'
import phone from '../../../assets/img/phone.svg'
import Auth from "../../../page/Auth";
import { observer } from 'mobx-react-lite'
import { Context } from "../../../index";
import { useNavigate } from 'react-router-dom';
import { BASKET_ROUT, DELIVERY_ORDER, MANGER_ROUT, PAY_ROUTE, PRODUCT_ROUT, SHOP_ROUT, USER_PROFILE } from "../../../utils/const";
import { fetchTypes } from "../../../http/deviceAPI";


const NavBar = observer(() => {

    const navigate = useNavigate();

    const [loginVisible, setLoginVisible] = useState(false)
    const [types, setTypes] = useState()
    
    const {user} = useContext(Context)
    

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
        navigate(SHOP_ROUT)
    }
    
    useEffect(() => {
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
        <Navbar className={style.nav}>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Container className={style.main}>
                 
                
                    <div>
                        
                        <Image src={logo} className={style.img_logo} onClick={() => navigate(SHOP_ROUT)} style={{cursor: 'pointer'}}/>
                        
                    </div>
                    <div className={style.col_link}>
                        <Nav
                            className="me-auto my-2 my-lg-0 links_shop"
                            style={{display: "flex", columnGap: 60, alignItems: 'center'}}
                        >
                            <NavDropdown title="Категории " id="navbarScrollingDropdown" style={{ fontWeight: 600 }}>
                                {types ? (
                                    types.map(data => (
                                        <NavDropdown.Item onClick={() => handleSelect(data.id)} key={data.id}>{data.name}</NavDropdown.Item>
                                    ))
                                ) : (
                                    <NavDropdown.Item><Spinner animation={'border'}></Spinner></NavDropdown.Item> // Пока данные загружаются
                                )}
                            </NavDropdown>
                            {user.isAuth  
                                ?
                                <NavDropdown title="Заказы" id="navbarScrollingDropdown" style={{fontWeight: 600}}>
                                    <NavDropdown.Item href="#action3" className="d-flex align-items-center">
                                        <i className="pi pi-truck"></i>
                                        <Nav.Link href="#" style={{fontWeight: 600}} onClick={() => navigate(DELIVERY_ORDER)}>Доставка</Nav.Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action4" className="d-flex align-items-center">
                                        <i className="pi pi-credit-card"></i>
                                        <Nav.Link href="#" style={{fontWeight: 600}} onClick={() => navigate(PAY_ROUTE)}>Оплата</Nav.Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                :
                                <div></div>
                            }
                            
            
                            {user.isAuth && (user.userInfo.role === 'MODERATOR' || user.userInfo.role === 'ADMIN') 
                                ?
                                <span style={{cursor: 'pointer', fontWeight: 600}} onClick={() => navigate(MANGER_ROUT)}>Модератор {}</span>
                                :
                                <div></div>
                            }
                            
                        </Nav>
                    </div>
                    <div className={style.menu_right}>
                        <div className={style.menu_right_telephone}>
                            <Nav.Link href="#action1"><Image src={phone} style={{width: 20, height: 20, marginRight: 5}}/>+7 (800) 555-35-35</Nav.Link>
                        </div>
                        {user.isAuth
                            ?
                            <div>
                                {/* <Nav.Link href="#login-user" style={{marginRight: 5}}><Image src={user_img} style={{width: 40, height: 40}}/></Nav.Link> */}
                                <NavDropdown title={<Image src={process.env.REACT_APP_API_URL + '/media/' + user.userInfo.image} style={{width: 40, height: 40}}/>} id="navbarScrollingDropdown">
                                    <NavDropdown.Item><span style={{cursor: 'pointer'}} onClick={() => navigate(USER_PROFILE + '/id_' + user.userInfo.user_id + '_' + user.userInfo.username)}>Профиль</span></NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => logOut()}>Выйти</NavDropdown.Item>
                                </NavDropdown>
                            </div>
                            :
                            <div>
                                <Nav.Link href="#login-user" style={{marginRight: 5}} onClick={() => setLoginVisible(true)}><Image src={person}/></Nav.Link>
                                
                            </div>    
                        }
                        
                        <div>
                            <span style={{paddingBottom: 3, cursor: 'pointer'}} onClick={() => navigate(BASKET_ROUT)}><Image src={cart}/></span>
                        </div>
                        
                    </div>
            </Container>
            <Auth visible={loginVisible} setVisible={setLoginVisible}></Auth>
            
        </Navbar>
    )
})

export default NavBar
