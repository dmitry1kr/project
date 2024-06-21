import React, { useContext, useEffect, useRef, useState } from 'react'
import style from './FeedbackUser.module.css'
import { getCommentsDevice } from '../../../http/deviceAPI'
import { Button, Image, Spinner } from 'react-bootstrap'
import { DataScroller } from 'primereact/datascroller';
import { Context } from '../../../index';
import Rating from '../Rating/Rating';
import ModalComments from './ModalComments';


const FeedbackUser = (deviceId) => {

    const { user } = useContext(Context)
    const ds = useRef(null);

    const [comments, setComments] = useState()
    const [userComment, setUserComment] = useState()
    const [loading, setLoading] = useState(true)

    const [showComment, setShowComment] = useState(false)

    console.log(deviceId.deviceId, 'id')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const commentsData = await getCommentsDevice(deviceId.deviceId)
                setComments(commentsData)

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);


    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' >
                <Spinner animation={'border'}/>
            </div>    
        )
    }

    const checkLenghtComments = () => {
        if (Object.keys(comments).length === 0){
            return true
        }

        return false
    }
    
    
    const itemComment = (data) => {
        const checkName = () => {
            if (data.user.first_name === '' ) {
                return false
            }
            return true
        }
        return(
            <div className={style.card} key={data.id}>
                <div style={{padding: 10}}>
                    <div className='d-flex'>
                        <Image src={process.env.REACT_APP_API_URL + '/media/' + data.user.image.replace(/.*\/user/, '/user')} className={style.img_comment}/>
                        <div>
                            <div className='d-flex flex-column gap-0'>
                                {checkName()
                                    ?
                                    <span className={style.name_user}>{data.user.first_name} {data.user.surname} <i className="pi pi-comment" style={{ color: 'rgba(111, 45, 255, 0.26)' }}></i></span>
                                    :
                                    <span className={style.name_user}>Нет имени <i className="pi pi-comment" style={{ color: 'rgba(111, 45, 255, 0.26)' }}></i></span>
                                }
                                <Rating star={data.rating} />
                                
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <span style={{marginTop: 10}}>{data.comment_text}</span>
                    </div>
                    
                    
                </div>
            </div>
        ) 
    }


    return (
        <div>
            <div>
            {user.isAuth
                ?
                <div>
                    <Button onClick={() => {setShowComment(true)}} style={{width: '100%', marginTop: 20}}>Оставить коментарий</Button>
                    
                </div>
                :
                <div>
                    Коментировать могут только авторизованые юзеры
                    
                </div>    
            }
            </div>
            {checkLenghtComments() 
                ?
                <div className='d-flex align-items-center justify-content-center' style={{marginTop: 30}}>
                    <span className={style.name_user}>Пока никто не оставил коментарии</span>
                </div>
                
                :
                <div style={{marginTop: 30}}>
                    <DataScroller value={comments} itemTemplate={itemComment} rows={2} buffer={0.4} header="Коментарии" />
                </div>
                
            }
            <ModalComments show={showComment} onHide={() => setShowComment(false)} id={deviceId.deviceId}/>    
        </div>
    )
}

export default FeedbackUser
