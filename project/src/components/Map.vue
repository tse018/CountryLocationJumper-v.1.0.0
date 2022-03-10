<template>
   <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
   data() {
      return {
         mapbox_id: import.meta.env.VITE_MAPBOX_ID,

         // getting all the values stored from rest-api
         countries: [],
      };
   },

   async created() {
      // fetching rest-countries API from the store and using getter to get the values
      this.countries = await this.$store.dispatch("fetchCountryApi");
      this.countries = this.$store.getters.getCountries;
   },

   mounted() {
      mapboxgl.accessToken = this.mapbox_id;

      const countryDetails = this.countries.map((country) => {
            return {
               type: "Feature",
               properties: {
                  message: "foo",
                  iconSize: [60, 60],
                  title: country.name.official,
                  capital: country.capital,
                  languages: country.languages,
                  continents: country.continents[0],
               },
               geometry: {
                  type: "Point",
                  coordinates: [
                     country.latlng[1],
                     country.latlng[0],
                  ],
               },
            };
         });

         return {
            type: "FeatureCollection",
            features: countryDetails,
         };
   }};

      // starting point when uploading the the page
      const map = new mapboxgl.Map({
         container: "map", // container ID
         style: "mapbox://styles/mapbox/streets-v11", // style URL
         center: [8.0, 60.0], // starting position [lng, lat]
         zoom: 3, // starting zoom
      });
/*
   methods: {
      filteringCountriesValues() {
         const countryDetails = this.countries.map((country) => {
            return {
               type: "Feature",
               properties: {
                  message: "foo",
                  iconSize: [60, 60],
                  title: country.name.official,
                  capital: country.capital,
                  languages: country.languages,
                  continents: country.continents[0],
               },
               geometry: {
                  type: "Point",
                  coordinates: [
                     country.latlng[1],
                     country.latlng[0],
                  ],
               },
            };
         });

         return {
            type: "FeatureCollection",
            features: countryDetails,
         };
      },
*/
      createMarkers(map) {
         for (const marker of countryDetails.features) {
            // Create a DOM element for each marker.
            const el = document.createElement("div");
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            el.className = "marker";
            el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = "100%";

            el.addEventListener("click", () => {
               window.alert(marker.properties.message);
            });

            // Add markers to the map.
            new mapboxgl.Marker(el)
               .setLngLat(marker.geometry.coordinates)
               .addTo(map);
         }
      },
   },
};
</script>

<style scoped>
#map {
   width: 100vw;
   height: 100vh;
   margin: 0px;
   padding: 0px;
}

.marker {
   display: block;
   border: none;
   border-radius: 50%;
   cursor: pointer;
   padding: 0;
}
</style>
