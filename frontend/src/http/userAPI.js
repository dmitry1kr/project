import { $authHost, $host } from "./index"
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, username, password, password2) => {
    const { data } = await $host.post('/register/', { email, username, password, password2});
}

export const login = async (email, password) => {
    const { data } = await $host.post('/token/', { email, password });
    console.log(data.access)
    localStorage.setItem('token', data.access)
    return jwtDecode(data.access);
}

export const check = async () => {
    const {data} = await $authHost.get('/dashboard/')     
}

export const getProfile = async (id) => {
    const { data } = await $host.get(`/profile/${id}`)
    return data
}

export const changeUserPassword = async (old_password, new_password, new_password2) => {
    try {
        const response = await $authHost.patch(`/change-password/`, { old_password, new_password, new_password2 });
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw new Error('Нет ответа от сервера');
        } else {
            throw new Error('Ошибка при смене пароля');
        }
    }
}

export const changePersonalUserInfo = async (id, first_name, surname, patronymic, image) => {
    console.log(id, first_name, surname, patronymic, image);
    try {
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('surname', surname);
        formData.append('patronymic', patronymic);
        if (image) {
            formData.append('image', image);
        }

        const response = await $authHost.patch(`/profile/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw new Error('Нет ответа от сервера');
        } else {
            throw new Error('Ошибка при смене пароля');
        }
    }
}

export const changeUserPhone = async (id, phone_number) => {
    try {
        const response = await $authHost.patch(`/profile/${id}`, { phone_number });
        return response.data
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw new Error('Нет ответа от сервера');
        } else {
            throw new Error('Ошибка при смене пароля');
        }
    }
}
