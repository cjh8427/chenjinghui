import axios from 'axios';
import $qs from 'qs';

// axios.defaults.baseURL = 'http://192.168.1.7:30000';
axios.defaults.baseURL = 'http://192.168.1.7:38009/bb1077';

axios.interceptors.request.use(
    config => {
        // config.data = JSON.stringify(config.data);
        config.headers = {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            "Content-Type": "application/json;charset=utf-8"
            
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
            // axios.post(url, $qs.stringify(data))
                axios.post(url, data)
                .then(response => {
                    resolve(response);
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