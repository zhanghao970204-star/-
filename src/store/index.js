import { createStore } from 'vuex'
import { GetCollectList, ColletGame, ColletCancel } from '@/api/common'
import bus from '@/utils/eventBus'
import toast from '@/utils/toast'

// 收藏以服务端为准；state 仍按币种分组，兼容各页面 favorites.find(group => group.currency === ...)
function currentCurrency() {
  return localStorage.getItem('currency') || ''
}

function toItem(raw) {
  return {
    gid: Number(raw.gid),
    gameName: raw.gameName || '',
    gameIcon: raw.gameIcon || '',
    url: raw.url || '',
    parameter: raw.parameter || ''
  }
}

const store = createStore({
  state: {
    favorites: []
  },
  mutations: {
    SET_FAVORITES(state, { currency, list }) {
      state.favorites = list.length ? [{ currency, list }] : []
    },
    ADD_FAVORITE(state, { currency, item }) {
      let currencyGroup = state.favorites.find(
        (group) => group.currency === currency
      )
      if (!currencyGroup) {
        currencyGroup = { currency, list: [] }
        state.favorites.push(currencyGroup)
      }
      if (!currencyGroup.list.some((fav) => fav.gid === item.gid)) {
        currencyGroup.list.push(item)
      }
    },
    REMOVE_FAVORITE(state, { currency, item }) {
      const currencyGroup = state.favorites.find(
        (group) => group.currency === currency
      )
      if (!currencyGroup) return
      const index = currencyGroup.list.findIndex((fav) => fav.gid === item.gid)
      if (index === -1) return
      currencyGroup.list.splice(index, 1)
      if (currencyGroup.list.length === 0) {
        state.favorites = state.favorites.filter((g) => g !== currencyGroup)
      }
    }
  },
  actions: {
    async loadCollect({ commit }) {
      localStorage.removeItem('favorites')
      if (!localStorage.getItem('token')) {
        commit('SET_FAVORITES', { currency: currentCurrency(), list: [] })
        return
      }
      try {
        const res = await GetCollectList({})
        if (res && res.status === 'ok' && res.content) {
          const list = (res.content.dataList || [])
            .filter((g) => g && g.gid != null)
            .map(toItem)
          commit('SET_FAVORITES', { currency: currentCurrency(), list })
        }
      } catch (e) {
        /* 保留现有列表 */
      }
    },
    /** 成功返回 true；未登录弹登录；失败 toast 接口 msg */
    async addFavorite({ commit }, payload) {
      if (!localStorage.getItem('token')) {
        bus.emit('openLogin')
        return false
      }
      const item = toItem(payload.item || {})
      if (!item.gid || !item.gameName || !item.gameIcon) return false
      try {
        const res = await ColletGame({
          gid: item.gid,
          gameName: item.gameName,
          gameIcon: item.gameIcon,
          url: item.url || undefined,
          parameter: item.parameter || undefined
        })
        if (res && res.status === 'ok') {
          commit('ADD_FAVORITE', { currency: payload.currency, item })
          return true
        }
        if (res && res.status !== 'need_login') {
          toast({ message: res.msg || 'Error', icon: 'cross' })
        }
      } catch (e) {
        toast({ message: 'Network error', icon: 'cross' })
      }
      return false
    },
    async removeFavorite({ commit }, payload) {
      if (!localStorage.getItem('token')) {
        bus.emit('openLogin')
        return false
      }
      const item = toItem(payload.item || {})
      try {
        const res = await ColletCancel({ gid: item.gid })
        if (res && res.status === 'ok') {
          commit('REMOVE_FAVORITE', { currency: payload.currency, item })
          return true
        }
        if (res && res.status !== 'need_login') {
          toast({ message: res.msg || 'Error', icon: 'cross' })
        }
      } catch (e) {
        toast({ message: 'Network error', icon: 'cross' })
      }
      return false
    }
  }
})

export default store
