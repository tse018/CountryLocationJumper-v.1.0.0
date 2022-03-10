export default {
   state() {
      return {
         countries: [],
      };
   },

   mutations: {
      setCountries(state, countries) {
         state.countries = countries;
      },
   },

   actions: {
      async fetchCountryApi(state) {
         const url = 'https://restcountries.com/v3.1/all'
         const response = await fetch(url);
         const results = await response.json();
         state.commit('setCountries', results);
      },
   },

   getters: {
      getCountries(state) {
         return state.countries;
      }
   }
}