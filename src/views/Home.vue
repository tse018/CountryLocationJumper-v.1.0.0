<template>
   <div v-if="error">
      <p>
         Errors: {{ getError }}
      </p>
   </div>

   <div v-else>
      <div id="map"></div>
   </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

import seoMixin from "../mixins/seoMixin.js";

export default {
   mixins: [seoMixin], 

   data() {
      return {
         countries: [],
         markers: {},
         location: [],
         error: false,
         map: import.meta.env.VITE_YOUSNJFSNIJNSNFNFOFNFJFOSMFFMFFLFMFMDJFJILO
      };
   },

   async created() {
      this.countries = await this.$store.dispatch("fetchCountryApi");
      this.countries = this.$store.getters.getCountries;
      this.error = this.$store.getters.getError;

      // the new mapped geoJson file created in the methods, will be stored in this.markers array from data()
      this.markers = this.creatingGeoJsonMarkers();

      // before creating adding mapbox map here
      this.creatingMapFromMapBox();

      this.metaTags({
         title: 'Country Location Jumper',
		});
   },

   computed: {
      getError() {
         // getting error message from Vuex store
         this.error = this.$store.getters.getError;
      },
   },

   methods: {
      creatingMapFromMapBox() {
         mapboxgl.accessToken = this.map

         // creating the map to the browser and giving start posistion
         const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/tse018/cl3fy4bep000i14qii6hxjxt0",
            center: [10, 53],
            zoom: 5,
         });

         // creating new empty array to store all the coordinates converted from objects
         const newCoord = [];

         // The for...in statement iterates over all enumerable properties of this.markers.features
         for (const coordinates of this.markers.features) {
            // getting the coordinates from the objects
            const coordinate = coordinates.geometry.coordinates;
            // {0: 147, 1: 37 }, {0: 44, 1: 35} ...etc

            // here I create a new array with only the object values from coordinate variable
            const arrayCoordinate = Object.values(coordinate);

            // here we add all the arrayCoordinates to the new list we created outside for...in loop
            newCoord.push(arrayCoordinate);

            // for each index, jump to array value coordinates
            map.on("load", () => {
               newCoord.map((itemC, index) => {
                  setTimeout(() => {
                     map.jumpTo({ center: itemC });
                  }, 2000 * index);
               });
            });
         }

         // adding everything that needs to be part of the map in here
         this.createMarkers(map);
         this.borderColor(map);
      },

      // mapping a new array of objects like how mapbox geoJson file looks like
      creatingGeoJsonMarkers() {
         const countryDetails = this.countries.map((country) => {
            return {
               type: "Feature",
               properties: {
                  message: country.name.official,
                  iconSize: [30, 30],
                  title: country.name.official,
                  capital: country.capital,
                  languages: country.languages,
                  continents: country.continents[0],
                  flags: country.cca2.toLowerCase(),
                  description: country.name.offical,
                  population: country.population,
               },
               geometry: {
                  type: "Point",
                  // NOTE: Mapbox API using longitude,latitude while RestCountries API using latitude, longitude
                  coordinates: [country.latlng[1], country.latlng[0]],
               },
            };
         });

         return {
            type: "FeatureCollection",
            features: countryDetails,
         };
      },


      createMarkers(map) {
         for (const marker of this.markers.features) {
            // Create a DOM element for each marker.
            const el = document.createElement("div");
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            const countryName = marker.properties.title;
            const countryCapital = marker.properties.capital;
            const countryPopulation = marker.properties.population;

            el.className = "marker";
            /* using third-part REST api called countryflagsapi to get all the flags pictures to showcase as icons */
            el.style.backgroundImage = `url(https://countryflagsapi.com/svg/${marker.properties.flags})`;
            el.style.backgroundRepeat = "no-repeat";
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = "100%";

            // when hovering on country flag, country details will popup on click
            const popUpMarker = new mapboxgl.Popup({
               closeButton: false,
               closeOnClick: false,
            })

               // creating popup markers content such as country name, capital and population
               .setHTML(
                  "<strong>" +
                     countryName +
                     "</strong>" +
                     "<br>" +
                     "Capital: " +
                     countryCapital +
                     "<br>" +
                     "Population:" +
                     " " +
                     countryPopulation
               );

            // Add markers to the map.
            new mapboxgl.Marker(el)
               .setLngLat(marker.geometry.coordinates)
               .setPopup(popUpMarker)
               .addTo(map);
         }
      },
      
      // drawing a line across the country borders
      borderColor(map) {
         map.on("load", () => {
            map.addSource("country-boundaries-simplified", {
               type: "vector",
               url: "mapbox://examples.countries-simplification",
            });

            map.addLayer({
               id: "countries-simplification-data",
               type: "line",
               source: "country-boundaries-simplified",
               "source-layer": "countries_polygons",
               layout: {
                  "line-join": "round",
                  "line-cap": "round",
               },
               paint: {
                  "line-color":
                     // creating random colors each time browser get refreshed just for fun
                     "#" + Math.floor(Math.random() * 16777215).toString(16),
                  "line-width": 4,
               },
            });
         });
      },

   },
};
</script>

<style>
#map {
   position: relative;
   width: 90vw;
   height: 80vh;
   margin: 70px auto;
   padding: 0;
}

.geocoder {
   position: absolute;
   z-index: 1;
   width: 55%;
   left: 50%;
   margin-left: -25%;
   top: 10px;
}

.mapboxgl-ctrl-geocoder {
   min-width: 100%;
}

.mapboxgl-popup {
   max-width: 400px;
}
</style>
