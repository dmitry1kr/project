import { $authHost, $host } from "./index"

export const getPrognoz = async (step, period) => {
    const { data } = await $host.get(`attendance/prognoz/${step}/${period}`)
    return data
}