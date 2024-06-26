import { $host } from "./index"

export const createOrder = async (formOrder) => {
    
    if (formOrder.type_order === 1) {
        delete formOrder.pickup_order
        const { data } = await $host.post(`/orders/${formOrder.user}/delivery`, formOrder)
    } else {
        delete formOrder.delivery_order
        const { data } = await $host.post(`/orders/${formOrder.user}/pickup`, formOrder)
    }
    
}

export const getAllOrder = async () => {
    const { data } = await $host.get('/orders/')
    return data
}

export const getOrderUser = async (id) => {
    const { data } = await $host.get(`/orders/${id}`)
    return data
}

export const getNotPayedOrderUser = async (id) => {
    const { data } = await $host.get(`/orders/pay/${id}`)
    return data
}

export const getStatusOrder = async () => {
    const { data } = await $host.get('/status/')
    return data
}

export const changeStatusOrder = async (id, status) => {
    const { data } = await $host.post(`/status/change/${id}/`, {status})
}

export const changeDataOrder = async (id, date) => {
    const { data } = await $host.post(`/status/change/${id}/`, {date})
}

export const getOrderDeliveried = async (id) => {
    const { data } = await $host.get(`/delivery/${id}`)
    return data
}