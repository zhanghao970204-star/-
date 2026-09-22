import { createStore } from 'vuex'

const store = createStore({
  state: {
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
  },
  mutations: {
    ADD_FAVORITE(state, { currency, item }) {
      let currencyGroup = state.favorites.find(
        (group) => group.currency === currency
      )

      if (!currencyGroup) {
        currencyGroup = {
          currency: currency,
          list: []
        }
        state.favorites.push(currencyGroup)
      }

      const isExist = currencyGroup.list.some((fav) => fav.gid === item.gid)
      if (!isExist) {
        currencyGroup.list.push(item)
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    REMOVE_FAVORITE(state, { currency, item }) {
      const currencyGroup = state.favorites.find(
        (group) => group.currency === currency
      )

      if (currencyGroup) {
        const index = currencyGroup.list.findIndex(
          (fav) => fav.gid === item.gid
        )
        if (index !== -1) {
          currencyGroup.list.splice(index, 1)
          if (currencyGroup.list.length === 0) {
            const groupIndex = state.favorites.findIndex(
              (group) => group.currency === currency
            )
            state.favorites.splice(groupIndex, 1)
          }
          localStorage.setItem('favorites', JSON.stringify(state.favorites))
        }
      }
    }
  },
  actions: {
    addFavorite({ commit }, payload) {
      commit('ADD_FAVORITE', payload)
    },
    removeFavorite({ commit }, payload) {
      commit('REMOVE_FAVORITE', payload)
    }
  }
})

export default store
