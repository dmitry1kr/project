import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRouter from './components/AppRouter';
import { observer } from 'mobx-react-lite';
import NavBar from './components/UI/NavBar/NavBar';
import Footer from './components/UI/Footer/Footer';
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import './App.css'
import { jwtDecode } from 'jwt-decode';
import { getBasketUser } from './http/basketAPI';

const App = observer(() => {


    const {user, cart} = useContext(Context)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check()
            .then(data => {
                user.setUser(data);
                user.setIsAuth(true);
                user.setUserInfo(jwtDecode(localStorage.getItem('token')))

                
            })
            .catch(error => {
                localStorage.removeItem('token')
            })
            .finally(() => setLoading(false)); 
               
            if (cart.cartItems.length === 0) {
                getBasketUser(user.userInfo.user_id)
                    .then(data => {
                        data.map(devices => {
                            cart.addToCart(devices.device);
                        });
                    })
                    .catch(error => {
                        console.error("Произошла ошибка при проверке:", error);
                    });
            }
    }, []);

    

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{height: '553px'}}>
                <Spinner animation={'border'}/>
            </div>
            
        )
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
            <Footer />
        </BrowserRouter>

    ) 
})

export default App

