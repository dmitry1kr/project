import { $host } from "./index"

export const getBasketUser = async (id) => {
    const { data } = await $host.get(`/basket/${id}`)
    return data
}

export const addBasketDeivce = async (basket, device_id) => {
    const { data } = await $host.post(`/basket/${basket}/`, {basket, device_id})
}

export const deleteFromBasketDevice = async (id, device_id) => {
    const { data } = await $host.delete(`/basket/${id}/devices/${device_id}`)
}

export const deleteFromBasketDeviceAll = async (id) => {
    const { data } = await $host.delete(`/basket/${id}/delete_all`)
}

export const getLastNumberOrder = async () => {
    const { data } = await $host.get('/orders/last_order_number/')
    return data
}

export const updateQuantityDeviceInBasket = async (id, action) => {
    try {
        const { data } = await $host.patch(`/basket/${id}/update_quantity/`, { action });
        return data
    } catch (error) {
        throw error
    }
};