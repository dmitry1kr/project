import { $authHost, $host } from "./index"

export const postType = async (name) => {
    const { data } = await $host.post(`types/`, {name})
}

export const postBrand = async (name, image) => {
    try {
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('logo_brand', image);
        }

        const response = await $authHost.post(`/brands/`, formData, {
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
            throw new Error('Ошибка при добавлении бренда');
        }
    }
}

export const createDevice = async (name_device, brand, type, price, image, info) => {
    try {
        const formData = new FormData();
        formData.append('name_device', name_device);
        formData.append('brand', brand);
        formData.append('type', type);
        formData.append('price', price);
        formData.append('info', info);
        if (image) {
            formData.append('image_device', image);
        }

        const response = await $authHost.post(`/devices/`, formData, {
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
            throw new Error('Ошибка при добавлении бренда');
        }
    }
}

export const createCharDevice = async (props) => {
    console.log(props)

    
    const response = {
        characteristics: props.reduce((acc, cur) => {
            acc[cur] = cur.value;
            return acc;
        }, {})
    };

    
    
    console.log(response)
    try {
        const { data } = await $authHost.post('/character/device/', props);
        return data; 
    } catch (error) {
        throw error; 
    }
}

export const editPriceAndQuantity = async (data) => {
    console.log(data, 'пришла дата')
    const device= data.id
    const quantity = parseInt(data.status_accounting.quantity)
    const price = parseInt(data.price)

    try{
        const { data } = await $authHost.post('/accounting/', { device, quantity})
        const { data_device } = await $authHost.patch(`devices/${device}/`, {price})
    } catch (error){
        console.log(error)
    }
}

export const  getSales = async () => {
    const { data } = await $authHost.get('/daily-sales/')
    return data
}