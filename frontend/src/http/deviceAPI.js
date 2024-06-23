import { $authHost, $host } from "./index"


export const createType= async (type) => {
    const { data } = await $host.post('/types/', type);
    return data;
}

export const fetchTypes = async () => {
    const { data } = await $host.get('/types/');
    return data;
}

export const createBrand = async (brand) => {
    const { data } = await $host.post('/brands/', brand);
    return data;
}

export const fetchBrand = async () => {
    const { data } = await $host.get('/brands/');
    return data;
}


export const fetchDevice = async () => {
    const { data } = await $host.get('/devices/');
    return data;
}

export const fetchOneDevice= async (id) => {
    const { data } = await $host.get('/devices/' + id);
    return data;
}

export const getCommentsDevice = async (id) => {
    const { data } = await $host.get(`comments/all/${id}`)
    return data
}

export const postCommentDevice = async (id, user, comment_text, rating) => {
    const { data } = await $authHost.post(`comments/${id}/`, {user, comment_text, rating})
}


