import React, { useContext, useRef, useState } from 'react';
import style from './style/module/Auth1.module.css';
import { Context } from '../index';
import { login, registration } from "../http/userAPI";
import person from '../assets/img/person.svg';
import { Form, Button, Image, Nav } from 'react-bootstrap';
import 'primeicons/primeicons.css';
import './style/custom_reg.css'
import { Messages } from 'primereact/messages';

const Auth = ({ visible, setVisible }) => {
    const rootClasses = [style.modal];
    const msgs = useRef();

    if (visible) {
        rootClasses.push(style.active);
    }

    const { user } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationVisible, setRegistrationVisible] = useState(false);

    const [isChecked, setIsChecked] = useState(false); 
    const [loginUser, setLoginUser] = useState('');
    const [password2, setPassword2] = useState('');

    const showMessage = (severity, summary, detail) => {
        if (msgs.current) {
            msgs.current.clear();
            msgs.current.show([
                { severity, summary, detail, sticky: true, closable: false }
            ]);
        }
    };

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked); 
    };

    const handleRegistrationClick = () => {
        setRegistrationVisible(true);
    };

    const click = async () => {
        try {
            const response = await login(email, password);
            user.setUser(user);
            user.setIsAuth(true);
            user.setUserInfo(response);
            msgs.current.clear();
            setVisible(false);
        } catch (e) {

            showMessage('error', 'Ошибка', 'Неправильный пароль или логин');
        }
    };

    const register = async () => {
        if (password === password2){
            try {
                const response = await registration(email, loginUser, password, password2);
                
                showMessage('success', 'Успешно', 'Вы зарегестрированы');
                setRegistrationVisible(false)
                msgs.current.clear();
            } catch (e) {
                showMessage('error', 'Ошибка', '');
            }
        } else {
            showMessage('error', 'Ошибка', 'Пароли не совпадают');
        }
        
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={style.modal_content} onClick={(e) => e.stopPropagation()}>
                {
                    !registrationVisible
                    ?
                    <div className='d-flex flex-column align-items-center'>
                        <Image src={person} style={{ maxWidth: 40, maxHeight: 40 }} />
                        <Button className={style.closeButton} onClick={() => {
                            setVisible(false);
                            setRegistrationVisible(false);
                        }}>
                            <i className="pi pi-times"></i>
                        </Button>
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
                            <span className={style.sp3} style={{ marginRight: 5 }}>Впервые у нас?</span>
                            <Nav.Link href="#registration" onClick={handleRegistrationClick}>
                                <span className={style.link}>Зарегистрироваться</span>
                            </Nav.Link>
                        </div>
                        <div >
                            <Messages ref={msgs}/>
                        </div>
                        
                    </div>
                    :
                    <div className='d-flex flex-column align-items-center'>
                        <Image src={person} style={{ maxWidth: 40, maxHeight: 40 }} />
                        <Button className={style.closeButton} onClick={() => {
                            setVisible(false);
                            setRegistrationVisible(false);
                        }}>
                            <i className="pi pi-times"></i>
                        </Button>
                        <div><span className={style.sp1}>Регистрация</span></div>
                        
                        <Form.Control type="email" placeholder="Введите почту" className={style.mail}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Form.Control type="text" placeholder="Введите логин" className={style.mail} 
                            value={loginUser}
                            onChange={e => setLoginUser(e.target.value)}
                        />
                        <Form.Control type="password" placeholder="Пароль" className={style.password}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Form.Control type="password" placeholder="Подтвердите пароль" className={style.password}
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                        />
                        
                        <div className="check-block" style={{width: '100%'}}>
                            <div className="line">
                                <input type="checkbox" id="r-mail"/>
                                <label htmlFor="r-mail">Хочу получать выгодные предложения от магазина</label>
                            </div>
                            <div className="line">
                                <input type="checkbox" id="r-pol" onChange={handleCheckboxChange} />
                                <label htmlFor="r-pol">Принимаю условия<a href="#1"> Пользовательского соглашения</a>, <a href="#2"> Политики конфиденциальности</a></label>
                            </div>
                        </div>
                        <Button className={style.button} disabled={!isChecked} onClick={register}>Зарегистрироваться </Button>
                        <div >
                            <Messages ref={msgs}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Auth;
