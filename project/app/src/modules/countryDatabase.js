export default {
   state() {
      return {
         countries: [],
         errors: ''
      };
   },

   mutations: {
      setCountries(state, countries) {
         state.countries = countries;
      },
      setError(state, errors) {
         state.errors = errors;
      }
   },

   actions: {
      async fetchCountryApi(state) {
         const url = 'https://restcountries.com/v3.1/all'
         const response = await fetch(url);
         try {
            if(response.status >= 200 && response.status < 300){
               const results = await response.json();
               state.commit('setCountries', results);
            } else {
               if(response.status === 404){
                  throw new Error('url ikke eksistere')
               }
               throw new Error('noe gikk galt!')
            }
         } catch (error) {
            state.commit('setError', error);
         }
      },
   },

   getters: {
      getCountries(state) {
         return state.countries;
      },

      getError(state) {
         return state.errors;
      },
   },
}