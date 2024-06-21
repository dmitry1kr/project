import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image'
import style from './Footer.module.css'
import { Link } from "react-router-dom";
import { Imgae } from 'react-bootstrap'
import vk from '../../../assets/img/vk.svg'
import telegram from '../../../assets/img/telegram.svg'
import person from '../../../assets/img/person_white.svg'


const Footer = () => {
  return (
    <div className={style.footer}>
        <div className={style.main}>
            <div>
                <div className={style.phone_shops}>
                    <div className={style.phone_country}>
                        <span className={style.phone_text}>Бесплатный звонок по РФ</span>
                        <span className={style.phone}>+7 (831) 282-60-00</span>
                    </div>
                    <div className={style.phone_shop}>
                        <span className={style.phone_text}>Для приема заказов</span>
                        <span className={style.phone}>+7 (904) 066-46-85</span>
                    </div>
                </div>
                <div>
                    <span className={style.graph_work}>График работы по будням с 9:00 до 18:00</span>
                </div>
                <div>
                    <span className={style.mail}>Email: info@.ru</span>
                </div>
                <div>
                    {/* <Link ></Link> */}
                    <span className={style.help}>Поддержка</span>
                </div>
                <div className={style.mini_foter}>
                    <span>©2024. SH4U</span>
                    <span>Условия и соглашения</span>
                    <span>Политика конфиденциальности</span>
                </div>
            </div >
            
                
            <div className={style.social}>
                <span><Image src={vk} style={{marginRight: 5}}/>Мы в вконтакте</span>
                <span><Image src={telegram} style={{marginRight: 5}}/>Мы в telegram</span>
            </div>

            <div>
                <span className={style.auth}><Image src={person}/>Войти / Регистрация</span>
            </div>
        </div>
    </div>
  )
}

export default Footer
