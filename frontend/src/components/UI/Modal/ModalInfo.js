import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from './ModalInfo.module.css'

const ModalInfo = ({children, visible, setVisible}) => {

    const rootClasses = [style.myModal]
    if (visible) {
        rootClasses.push(style.active)
    }

    return ( 
        <div 
            className={rootClasses.join(' ')}
            onClick={ () => setVisible(false)}
        >
            <div 
                className={style.myModalContent}
                onClick={ (e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default ModalInfo
