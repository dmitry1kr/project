import React from 'react';
import style from './style/module/Register.module.css';

const Register = ({ visibleRegister, setVisibleRegister }) => {
    console.log(visibleRegister, 'статус видимости окна регистрации');
    const rootClasses = [style.modal_register];
    if (visibleRegister) {
        rootClasses.push(style.active);
    }
    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisibleRegister(false)}>
            <div className={style.modal_content_register} onClick={(e) => e.stopPropagation()}>
                Регистрация
            </div>
        </div>
    );
};

export default Register;