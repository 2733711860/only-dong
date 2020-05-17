import * as types from './mutation-types'

const mutations = {
	// 用户信息
  [types.SET_USER](state, user) {
  	console.log(user)
    state.user = user
  }
}

export default mutations
