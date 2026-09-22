// mixins/globalMixin.js
export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      getCurrency: localStorage.getItem('currency'),
      GET_PLATFORM: localStorage.getItem('platform'),
      GET_CURRENCYUNIT: localStorage.getItem('currencyUnit'),
      GET_AREACODE: localStorage.getItem('areaCode'),
      GET_ICONURL: localStorage.getItem('iconUrl'),
      GET_COUNTRYNAME: localStorage.getItem('countryName'),
      GET_COUNTRY: localStorage.getItem('country')
    }
  },
  methods: {},
  created() {}
}
