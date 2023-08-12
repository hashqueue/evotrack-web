import { defineStore } from 'pinia'

import { setItem, getItem } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    menuPermissions: null,
    buttonPermissions: null
  }),
  getters: {
    getToken(state) {
      if (!state.token) {
        const newToken = getItem('token')
        this.token = newToken
        return newToken
      }
      return state.token
    },
    getMenuPermissions(state) {
      if (!state.menuPermissions) {
        const newMenuPermissions = getItem('menuPermissions')
        this.menuPermissions = newMenuPermissions
        return newMenuPermissions
      }
      return state.menuPermissions
    },
    getButtonPermissions(state) {
      if (!state.buttonPermissions) {
        const newButtonPermissions = getItem('buttonPermissions')
        this.buttonPermissions = newButtonPermissions
        return newButtonPermissions
      }
      return state.buttonPermissions
    }
  },
  actions: {
    setToken(token) {
      this.token = token
      setItem('token', token)
    },
    setMenuPermissions(pMenuPermissions) {
      this.menuPermissions = pMenuPermissions
      setItem('menuPermissions', pMenuPermissions)
    },
    setButtonPermissions(pButtonPermissions) {
      this.buttonPermissions = pButtonPermissions
      setItem('buttonPermissions', pButtonPermissions)
    }
  }
})
