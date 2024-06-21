import { Component } from "react"
import { BASKET_ROUT, CREATED_ORDER, DELIVERY_ORDER, DEVICE_ROUT, LOGIN_ROUT, MAKE_ORDER, MANGER_ROUT, PAY_ROUTE, PRODUCT_ROUT, REGISTRATION_ROUT, SHOP_ROUT, USER_PROFILE } from "./utils/const"
import ManagerPanel from './page/ManagerPanel'
import Basket from './page/Basket'
import Shop from "./page/Shop"
import Auth from "./page/Auth"
import DevicePage from './page/DevicePage'
import Register from "./page/Register"
import UserProfile from "./page/UserProfile"
import MakeOrder from "./page/MakeOrder"
import OrderCreate from "./components/UI/OrderCreate/OrderCreate"
import Pay from "./page/Pay"
import Delivery from "./page/Delivery"
import ProductPage from "./page/ProductPage"


export const authRoutes = [
    {
        path: MANGER_ROUT,
        Component: ManagerPanel
    },
    {
        path: BASKET_ROUT,
        Component: Basket
    },
    {
        path: MAKE_ORDER + '/:id', 
        Component: MakeOrder
    },
    {
        path: CREATED_ORDER + '/:id',
        Component: OrderCreate
    },
    {
        path: PAY_ROUTE,
        Component: Pay
    },

    {
        path: DELIVERY_ORDER,
        Component: Delivery
    }


]

export const publicRoutes = [
    {
        path: SHOP_ROUT,
        Component: Shop
    },
    {
        path: LOGIN_ROUT,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUT,
        Component: Register
    },
    {
        path: DEVICE_ROUT + '/:id',
        Component: DevicePage
    },
    {
        path: USER_PROFILE + '/:id',
        Component: UserProfile
    },
    {
        path: PRODUCT_ROUT,
        Component: ProductPage
    }
    
]