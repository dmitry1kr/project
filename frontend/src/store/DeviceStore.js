import { makeAutoObservable } from 'mobx'

export default class DeviceStore {
    constructor() {
        this._types = [];
        this._brands = [];
        this._devices = [];

        this._selectedType = {}
        makeAutoObservable(this);
    }

    setSelectedType(type) {
        this._selectedType = type
    }

    setTypes(types) {
        this._types = types;
    }

    setBrands(brands) {
        this._brands = brands;
    }

    setDevices(devices) {
        this._devices = devices;
    }

    get types() {
        return this._types;
    }

    get brands() {
        return this._brands;
    }

    get devices() {
        return this._devices;
    }

    get selectedType() {
        return this._selectedType
    }
}