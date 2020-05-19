import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import persistedState from 'vuex-persistedstate' // vuex持久化

//import * as Cookies from "js-cookie" // Cookies存储时需要引入

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
//plugins: [persistedState()]

	plugins: [ // sessionStorage存储
    persistedState({
    	storage: window.sessionStorage,
//  	reducer(val) { // 持久化指定
//      return {
//        // 只储存state中的user
//        user: val.user
//      }
//    }
    })
	]

//	plugins: [ // Cookies存储
//  persistedState({
//    storage: {
//      getItem: key => Cookies.get(key),
//      setItem: (key, value) => Cookies.set(key, value, { expires: 7, secure: true }),
//      removeItem: key => Cookies.remove(key)
//    }
//  })
//]
})
