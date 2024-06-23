import React, { useState } from 'react'
import { Modal, Form, Button, Image, Nav } from 'react-bootstrap'
import style from './ModalPay.module.css'
import { topUpBalanceUserWallet } from '../../../http/payAPI'

const ModalPay = ({show, onHide, userId}) => {

    const [balance, setBalance] = useState(0.00)

    const click = () => {
        topUpBalanceUserWallet(userId, balance)
            .then(
                console.log('Пополнился')
            ).catch(
                console.log('Не удачно')
            )
    }

    return ( 
        <Form>
            <Modal show={show} onHide={onHide} centered className={style.modal_main}>
                <div className='d-flex flex-column' style={{rowGap: 15}}>
                    <div><span className={style.sp1}>Пополнение кошелка</span></div>
                    <Form.Control type="balance" placeholder="Введите сумму" 
                        value={balance}
                        onChange={e => setBalance(e.target.value)}
                    />
                    <Button className={style.button} onClick={click}>Пополнить</Button>
                </div>
            </Modal>
        </Form>
    );
}

export default ModalPay