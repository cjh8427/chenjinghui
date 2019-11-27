import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        "version": "监控版: 3.0.0.13 beta",
        "token": localStorage.$demoToken 
    },
    getters: {}
})