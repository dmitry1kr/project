import { makeAutoObservable } from 'mobx'

export default class BasketStore {
    constructor() {
        this._device_to_cart = []
        console.log(this._device_to_cart)
        makeAutoObservable(this)
    }

    // Добавление товара в корзину
    addToCart(item) {
        this._device_to_cart.push({ ...item });
    }
    
    // Удаление товара из корзины
    removeFromCart(itemId) {
        console.log(this._device_to_cart)
        const index = this._device_to_cart.findIndex(item => item.id === itemId);
        console.log(index)
        if (index !== -1) {
            this._device_to_cart.splice(index, 1);
        }
    }

    // Обновление кол-ва товара
    updateCartItemQuantity(id, quantity) {
        const index = this._device_to_cart.findIndex(item => item.id === id);
        if (index !== -1) {
            // Создаем копию объекта и обновляем значение quantity в этой копии
            const updatedItem = { ...this._device_to_cart[index], quantity };
            // Заменяем старый объект в массиве новой копией с обновленным quantity
            this._device_to_cart[index] = updatedItem;
        }
    }

    // Расчет общей стоимости корзины
    calculateTotalPrice() {
        let total = 0;

        this._device_to_cart.forEach(item => {
            total += item.device.price * item.quantity;
        });
        return total;
    }

    // Количество товаров в корзине 
    getCountItemsCart() {
        return this._device_to_cart.length;
    }
    
    // Метод для очищения корзины
    clearCart() {
        this._device_to_cart = [];
    }

    get cartItems() {
        return this._device_to_cart;
    }
}
