import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState } from "react";
import Image from 'react-bootstrap/Image'
import { Form } from 'react-bootstrap';
import style from './style/Auth.module.css'
import './style/custom_reg.css'
import person from '../assets/img/person.svg'
import { registration } from "../http/userAPI";

const Register = ({show, onHide}) => {

    const [isChecked, setIsChecked] = useState(false); // Состояние для отслеживания выбранного состояния чекбокса

    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const click = async() => {
        const response = await registration(email, login, password, password2)
        console.log(response)
    }

    // Функция для обновления состояния чекбокса
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };
    
    return (
        
        <Modal show={show} onHide={onHide} centered>
            <Form>
                <div className={style.modal}>
                    
                    <div className='d-flex'>
                        <div><Image src={person} style={{maxWidth: 40, maxHeight: 40, marginBottom: 30}}/></div>
                        <div><Button className={style.closeButton} onClick={onHide}>X</Button></div>
                    </div>
                    <div><span className={style.sp1}>Регистрация</span></div>
                    
                        <Form.Control type="email" placeholder="Введите почту" className={style.mail}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Form.Control type="username" placeholder="Введите логин" className={style.mail} 
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <Form.Control type="password" placeholder="Пароль" className={style.password}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Form.Control type="password" placeholder="Подтвердите пароль" className={style.password}
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                        />
                    
                    <div className="check-block">
                        <div className="line">
                            <input type="checkbox" id="r-mail"/>
                            <label htmlFor="r-mail">Хочу получать выгодные предложения от магазина</label>
                        </div>
                        <div className="line">
                            <input type="checkbox" id="r-pol" onChange={handleCheckboxChange} />
                            <label htmlFor="r-pol">Принимаю условия<a href="#1"> Пользовательского соглашения</a>, <a href="#2"> Политики конфиденциальности</a></label>
                        </div>
                    </div>
                    <Button className={style.button} disabled={!isChecked} onClick={click}>Зарегистрироваться </Button>
                </div>
            </Form>
        </Modal>
        
    )
}

export default Register
