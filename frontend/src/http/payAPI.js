import { $authHost, $host } from "./index"

export const getBalanceUserWallet = async (id) => {
    const { data } = await $host.get(`/wallet/${id}`)
    return data
}

export const topUpBalanceUserWallet = async (id, amount) => {
    const { data } = await $host.post(`/wallet/${id}/topup/`, { amount })
}

export const payOrderUser = async (id_user, order_id, amount) => {
    const { data } = await $host.post(`/wallet/${id_user}/pay-order/`, {order_id, amount})
}