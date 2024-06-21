import React, { useContext, useRef, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputTextarea } from 'primereact/inputtextarea';
import { Context } from '../../../index';
import { postCommentDevice } from '../../../http/deviceAPI';
import { Rating } from 'primereact/rating';
import { Messages } from 'primereact/messages';

const ModalComments = ({show, onHide, id}) => {

    const { user } = useContext(Context)
    const msgs = useRef(null)

    const [device, setDevice] = useState(id)
    const [value, setValue] = useState('');
    const [rating, setRating] = useState(5)
    console.log(rating)

    const showMessage = (severity, summary, detail) => {
        msgs.current.clear()
        msgs.current.show([
            { severity, summary, detail, sticky: true, closable: false }
        ])
    }

    const checkRating = (value) => {
        if (value === null) {
            setRating(1)
        } else {
            setRating(value)
        }
    }
    
    const feedback = async () =>{
        try{
            const fetchData = await postCommentDevice(device, user.userInfo.user_id, value, rating)
            showMessage('success', 'Успешно', 'Коментарий добавлен');
        } catch (error) {
            console.log('Произошла ошибка', error.request.response.replace(/[\[\]']+/g,''))
            showMessage('error', 'Ошибка', `${error.request.response.replace(/[\[\]']+/g,'')}`)
        }
    }
    
    
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Оставить коментарий</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Messages ref={msgs} />
                <span>Коментарий:</span>
                <div className="card flex justify-content-center">
                    <InputTextarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} />
                </div>
                <div>
                    <span>Оценка:</span>
                    <Rating value={rating} onChange={(e) => checkRating(e.target.value)} />
                </div> 

            </Modal.Body>
            <Modal.Footer>
            
                <Button onClick={() => {feedback()}}>Отправить</Button>
            </Modal.Footer>
        </Modal>
            
        
    )
}

export default ModalComments
