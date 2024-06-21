import React, { useEffect, useState, useContext, useRef } from 'react'
import { Button, FormControl, Image, Spinner } from 'react-bootstrap'
import default_img from '../../../assets/img/default.svg'
import { Password } from 'primereact/password'
import { FloatLabel } from 'primereact/floatlabel'
import { InputMask } from 'primereact/inputmask';
import style from './style/Profile.module.css'
import { InputText } from 'primereact/inputtext'
import iconUser from '../../../assets/img/person.svg'
import { changePersonalUserInfo, changeUserPassword, changeUserPhone, getProfile } from '../../../http/userAPI'
import { Context } from '../../../index'
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import 'primeicons/primeicons.css';

const Profile = () => {

    const {user} = useContext(Context)
    const [image, setImage] = useState()
    const [profile, setProfile] = useState(user.userInfo)
    const [loading, setLoading] = useState(true)

    const msgs = useRef(null)
    const showMessage = (severity, summary, detail) => {
        msgs.current.clear()
        msgs.current.show([
            { severity, summary, detail, sticky: true, closable: false }
        ])
    }

    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [repeatNewPassword, setRepeatNewPassword] = useState()

    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    const [patronymic, setPatronymic] = useState()
    const [phone, setPhone] = useState()

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    useEffect(() => {
        getProfile(user.userInfo.user_id).then(data => {
            setProfile(data)
            setName(data.first_name)
            setPatronymic(data.patronymic)
            setSurname(data.surname)
            setPhone(data.phone_number)
        })
        .finally(() => setLoading(false));
    }, [])

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }

    const changePassword = async () => {
        if (newPassword === repeatNewPassword) {
            console.log('Пароли совпадают');
            try {
                await changeUserPassword(oldPassword, newPassword, repeatNewPassword);
                showMessage('success', 'Успешно', 'Пароль изменён');
                
            } catch (error) {
                showMessage('error', 'Ошибка', 'Неверный старый пароль');
                console.log(error, 'Ошибка при смене пароля');
            }
        } else {
            console.log('Пароли не совпадают');
            showMessage('error', 'Ошибка', 'Пароли не совпадают');
        }
    }

    const changePersonalInfo = async () => {
        try {
            changePersonalUserInfo(profile.id, name, surname, patronymic, image)
            showMessage('success', 'Успешно', 'Персональная информация изменена');
        } catch (error) {
            
            showMessage('error', 'Ошибка', 'Произошла ошибка, попробуйте снова или обратитесь в тех.поддержку')
        }
        
    }

    const changeContactInfo = async () => {
        try {
            changeUserPhone(profile.id, phone)
            showMessage('success', 'Успешно', 'Контактная информация изменена');
        } catch (error) {
            
            showMessage('error', 'Ошибка', 'Произошла ошибка, попробуйте снова или обратитесь в тех.поддержку')
        }
    }
    console.log(profile)
    return (
        <div className='d-flex justify-content-between flex-column' style={{width: '100%', marginBottom: 30}} >
            <Messages ref={msgs} />
            <div className='d-flex justify-content-between ' style={{width: '100%', marginBottom: 30}}>

            
            <div style={{width: '45%', height: '100%'}} className={style.card}> 
            
                <div style={{margin: 15}}>
                    <div style={{marginBottom: 40}}>
                        <span className={style.personal}>Персональная информация</span>
                    </div>
                    <div className='d-flex align-items-center justify-content-between' style={{marginBottom: 10}}>
                        <div>
                            <Image src={process.env.REACT_APP_API_URL + '/media/' + profile.image.split("/media/")[1]} alt="Uploaded Image" style={{width:75, height: 75, borderRadius:12}}/>
                        </div>
                        <div style={{width: '70%'}}>
                            <FormControl placeholder='Выберите файл' type='file' onChange={handleImageUpload}></FormControl>
                        </div>
                    </div>
                    <div>
                        <div style={{marginBottom: 10}}>
                            <span className={style.text}>Имя</span>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    value={name}
                                    onChange={(e) => {setName(e.target.value)}}
                                    placeholder="Имя"
                                />
                            </div>
                        </div>
                        <div style={{marginBottom: 10}}>
                            <span className={style.text}>Фамилия</span>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText 
                                    value={surname}
                                    onChange={(e) => {setSurname(e.target.value)}}
                                    placeholder="Фамилия" 
                                />
                            </div>
                        </div>
                        <div style={{marginBottom: 10}}>
                            <span className={style.text}>Отчество</span>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText 
                                    value={patronymic}
                                    onChange={(e) => {setPatronymic(e.target.value)}}
                                    placeholder="Отчество" 
                                />
                            </div>
                        </div>
                        <div style={{marginBottom: 10}}>
                            <span className={style.text}>Адрес почты</span>
                            <div className="p-inputgroup flex-1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-at"></i>
                                </span>
                                <InputText 
                                    variant="filled"
                                    value={user.userInfo.email}
                                    placeholder="Почта"
                                />
                            </div>
                        </div>
                        <div className='d-flex justify-content-end'>
                            <Button onClick={changePersonalInfo}>Сохранить изменения</Button>
                        </div>
                    </div>
                </div>     
            </div>
            <div style={{width: '45%'}} className='d-flex flex-column justify-content-between'>
                <div className={style.card} style={{marginBottom: 20}}>
                    <div style={{padding: 15}}>
                        <div>
                            <div style={{marginBottom: 10}}>
                                <span className={style.personal}>Контактная информация (подтверждение заказов)</span>
                            </div>
                            <div style={{marginBottom: 10}}>
                                <span className={style.text}>Номер телефона</span>
                                <InputMask id="phone" mask="8 (999) 999-99-99" placeholder="8 (999) 999-99-99" className={style.custom_input}
                                    value={phone}
                                    onChange={(e) => {setPhone(e.target.value)}}
                                ></InputMask>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <Button onClick={changeContactInfo}>Сохранить изменения</Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className={style.card}> 
                    <div>
                        <div style={{padding: 15}}>
                            
                            <span className={style.personal}>Изменение пароля</span>
                            <div style={{marginBottom: 30, marginTop: 30}}>
                                <FloatLabel className="card flex justify-content-center">
                                        <Password
                                            variant="filled"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            inputClassName="w-full"
                                            className="bg-red-100 w-full"
                                            toggleMask
                                            pt={{ input: { style: { width: '100%' } }, iconField: {root: { style: { width: '100%'}}} }}
                                        />
                                        <label htmlFor="password">Старый пароль</label>
                                </FloatLabel>
                            </div>
                            <div style={{marginBottom: 10}}>
                                <FloatLabel className="card flex justify-content-center">
                                    <Password
                                        variant="filled"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        inputClassName="w-full"
                                        className="bg-red-100 w-full"
                                        toggleMask
                                        pt={{ input: { style: { width: '100%' } }, iconField: {root: { style: { width: '100%'}}} }}
                                    />
                                    <label htmlFor="password">Новый пароль</label>
                                </FloatLabel>
                            </div>
                            <div style={{marginTop: 30}}>
                                <FloatLabel className="card flex justify-content-center" >
                                        <Password
                                            variant="filled"
                                            value={repeatNewPassword}
                                            onChange={(e) => setRepeatNewPassword(e.target.value)}
                                            inputClassName="w-full"
                                            className="bg-red-100 w-full"
                                            toggleMask
                                            pt={{ input: { style: { width: '100%' } }, iconField: {root: { style: { width: '100%'}}} }}
                                        />
                                        <label htmlFor="password">Повторите новый пароль</label>
                                </FloatLabel>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <Button style={{margin: '30px 0 10px 0'}} onClick={changePassword}>Сохранить изменения</Button>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Profile
