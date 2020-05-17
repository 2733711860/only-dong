import * as types from './mutation-types'

// user信息
export const setUser = function({ commit }, user) {
  commit(types.SET_USER, user)
}
