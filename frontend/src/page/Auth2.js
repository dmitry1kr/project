import React, { useContext, useState } from "react";
import { Modal, Form, Button, Image, Nav } from 'react-bootstrap';
import style from './style/Auth.module.css'
import './style/custom.css'
import person from '../assets/img/person.svg'
import Register from './Register';
import { Context } from "../index";
import {observer} from 'mobx-react-lite'
import { login } from "../http/userAPI";

const Auth = observer(({show, onHide}) => {

    const {user} = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [registrtionVisible, setRegistrationVisible] = useState(false)
    

    const handleRegistrationClick = () => {
        onHide(); // Скрыть текущее модальное окно для авторизации
        setRegistrationVisible(true); // Показать модальное окно для регистрации
    };
    
    const click = async() => {
        try{
            const response = await login(email, password)
            console.log(response, 'авторизация')
            user.setUser(user)
            user.setIsAuth(true)
            user.setUserInfo(response)
            onHide()
        } catch (e) {
            alert('Введен не правильный логин или пароль')
        } 
    }
    

    return (
        <Form>
            <Modal show={show} onHide={onHide} centered>
                <div className={style.modal}>
                    
                    <div className='d-flex justify-content-center'>
                        <div><Image src={person} style={{maxWidth: 40, maxHeight: 40, marginBottom: 30}}/></div>
                        <div><Button className={style.closeButton} onClick={onHide}>X</Button></div>
                    </div>
                    <div><span className={style.sp1}>Войти в личный кабинет</span></div>
                    
                    <Form.Control type="email" placeholder="Введите почту" className={style.mail}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control type="password" placeholder="Пароль" className={style.password}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                        
                    
                    <div><span className={style.sp2}>Забыл пароль?</span></div>
                        <Button className={style.button} onClick={click}>Войти</Button>
                    <div className='d-flex flex-row align-items-center'>
                        <span className={style.sp3} style={{marginRight: 5}}>Впервые у нас?</span>
                        <Nav.Link href="#registration" onClick={handleRegistrationClick}>
                                <span className={style.link}>Зарегистрироваться</span>
                        </Nav.Link>
                    </div>
                </div>
            </Modal>
            <Register show={registrtionVisible} onHide={() => setRegistrationVisible(false)}/>
        </Form>
    )
})

export default Auth
