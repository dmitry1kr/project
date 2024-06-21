import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import DeviceStore from './store/DeviceStore';
import SliderStore from './store/SlideStor';
import BasketStore from './store/BasketStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <Context.Provider value={{
        user: new UserStore(),
        device: new DeviceStore(),
        slider: new SliderStore(),
        cart: new BasketStore(),
    }}> 
        <App />    
    </Context.Provider>
    
);



