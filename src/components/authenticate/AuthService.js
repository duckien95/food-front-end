import decode from 'jwt-decode';
import $ from 'jquery';
export default class AuthService {

    constructor(domain) {
        this.domain = domain || 'http://localhost:8000'
        this.fetch = this.fetch.bind(this);
        this.signup = this.signup.bind(this);
        this.localSignUp = this.localSignUp.bind(this);
        this.localLogin = this.localLogin.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.googleFaceLogin= this.googleFaceLogin.bind(this);
        this.setDownloadPermission = this.setDownloadPermission.bind(this);
    }

    setDownloadPermission(){
        if(!this.loggedIn()){
            $(window).contextmenu(function() {
                return false;
            });
        }
        // console.log(this.loggedIn);

    }

    editUser(editData) {
        return this.fetch(`${this.domain}/auth/edit-user`, {
            method: 'POST',
            body: JSON.stringify(editData)
        }).then(res => {
            console.log(res);
            if(res.token !== null){
                this.setToken(res)
            }
            return Promise.resolve(res);
        })
    }

    googleFaceLogin(postData){
        console.log('in googleFaceLogin fucntion');
        console.log(postData);
        return this.fetch(`${this.domain}/auth/login-google-facebook`, {
            method: 'POST',
            body: JSON.stringify(postData)
        }).then(res => {
            console.log(JSON.stringify(res));
            if(res.token !== null){
                this.setToken(res)
            }
            return Promise.resolve(res);
        })

    }



    signup(userData){

        return this.fetch(`${this.domain}/local`, {
            method: 'POST',
            body: JSON.stringify(userData)
            }).then(function (response) {
                return response.json()
            }).then(res => {
                console.log("return from server");
                console.log(res);
                this.setToken(res.token)
                return Promise.resolve(res);
                // return resolve(res);
            }).catch(err => {
                console.log(err);
            })
    }

    localSignUp(username, password,  provider, email, firstname, lastname) {
    // Get a token
        return this.fetch(`${this.domain}/auth/local-signup`, {
            method: 'POST',
            body: JSON.stringify({ username, password,  provider, email, firstname, lastname })
        }).then(res => {
            console.log(JSON.stringify(res));
            if(res.token !== null){
                this.setToken(res)
            }
            return Promise.resolve(res);
        })
    }

    localLogin(username, password){
        return this.fetch(`${this.domain}/auth/local-login`, {
            method: 'POST',
            body: JSON.stringify({ username, password })
        }).then(res => {
            console.log(JSON.stringify(res));
            if(res.token !== null){
                this.setToken(res)
            }
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken()
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(res) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('user');
    }

    getProfile() {
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }
        //
        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
