import axios from 'axios';
import $qs from 'qs';

axios.defaults.baseURL = 'https://www.easy-mock.com/mock';

axios.interceptors.request.use(
    config => {
        config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        return config;
    },
    error => {
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error)
    }
);
export default {
    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, $qs.stringify(data))
                .then(response => {
                    resolve(response.data);
                }, err => {
                    reject(err)
                })
        })
    },
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                    params: params
                })
                .then(response => {
                    resolve(response.data);
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}