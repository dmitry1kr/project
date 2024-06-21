import { makeAutoObservable } from 'mobx'

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._userInfo = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setUserInfo(user) {
        this._userInfo = user
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get userInfo() {
        return this._userInfo
    }
}