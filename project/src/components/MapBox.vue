<template>
   <p v-if="error">Errors: {{ error }}</p>
   <div id="geocoder" class="geocoder"></div>
   <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

export default {
   data() {
      return {
         mapbox_id: import.meta.env.VITE_MAPBOX_ID,
         countries: [],
         markers: [],
         coordinates: [],
         error: "",
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
   },

   computed() {
      this.error = this.$store.getters.getError;
   },

   methods: {
      creatingMapFromMapBox() {
         mapboxgl.accessToken = this.mapbox_id;

         // creating the map to the browser and giving start posistion
         const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [10, 53],
            zoom: 5,
         });

         // The for...in statement iterates over all enumerable properties
         for (const coordinates of this.markers.features) {
            // getting the coordinates from the objects
            const coordinate = coordinates.geometry.coordinates;
            // {0: 147, 1: 37 }, {0: 44, 1: 35} ...etc

            // [0,1] => [1,0]
            const reversedCoordinates = coordinate.map((location) => {
               return Object.values(coordinate).reverse();
            });

            const array = new Array(reversedCoordinates);
            

            const merge = []

            merge.push(...array)
            console.log(merge)


/*
            // for each values I want to jump to locations
            map.on("load", () => {
               for (const [index, coordinate] of merge.entries()) {
                  console.log(index, coordinate);
                  setTimeout(() => {
                     map.jumpTo({ center: coordinate });
                  }, 2000 * index);
               }
            });*/

            //console.log(Object.entries(coordinate).map(([k, v]) => ([v, +k])));
            //const transformToArray = obj => (Object.entries(obj).map(([k, v]) => ([v, +k])));
            //console.log(transformToArray)

            // returns {0: 1, 1: 1}

            // returns values as an array

            // returns two values, example [44.24, -12.166]

            /*
            const cityCoordinates = [
               [100.507, 13.745],
               [98.993, 18.793],
               [99.838, 19.924],
               [102.812, 17.408],
               [100.458, 7.001],
               [100.905, 12.935],
            ];
*/
         }

         // adding everything that needs to be part of the map in here
         this.createMarkers(map);
         this.searchLocationGeoCoder(map);
         this.navigationControllers(map);
         this.borderColor(map);
         this.locateTheUser(map);
         //this.locationShow(map);
      },

      // mapping a new array of objects like how mapbox geoJson file looks like
      creatingGeoJsonMarkers() {
         const countryDetails = this.countries.map((country) => {
            return {
               type: "Feature",
               properties: {
                  message: country.name.official,
                  iconSize: [20, 20],
                  title: country.name.official,
                  capital: country.capital,
                  languages: country.languages,
                  continents: country.continents[0],
                  flags: country.cca2.toLowerCase(),
                  description: country.name.offical + country.region,
                  population: country.population,
               },
               geometry: {
                  type: "Point",
                  coordinates: [country.latlng[1], country.latlng[0]],
               },
            };
         });

         return {
            type: "FeatureCollection",
            features: countryDetails,
         };
      },

      searchLocationGeoCoder(map) {
         const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,

            /* geocoder input field placeholder */
            placeholder: "Search for a country",

            /* adding easing in-out animation when searching for country  */
            flyTo: {
               bearing: 0,

               // Control the flight curve, making it move slowly and
               // zoom out almost completely before starting to pan.
               speed: 0.2, // Make the flying slow.
               curve: 4, // Change the speed at which it zooms out.

               // This can be any easing function: it takes a number between
               // 0 and 1 and returns another number between 0 and 1.
               easing: (posistion) => {
                  return posistion;
               },
            },
         });

         // trying to add place details when user search on a country
         geocoder.on("result", function ({ result }) {
            console.log(result.place_name);
            // figure how to create add layer so when user search country
            // popup will appear after the search with details about that country.
         });

         document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
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
            /* using countryflagsapi to get all the flags pictures to showcase as icons */
            el.style.backgroundImage = `url(https://countryflagsapi.com/svg/${marker.properties.flags})`;
            el.style.backgroundRepeat = "no-repeat";
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = "100%";

            /**************** Hover effect on popup  ************************/

            // when hovering on country flag, country details will popup
            const popUpMarker = new mapboxgl.Popup()

               // creating popup markers content such as country name, capital and population
               .setHTML(
                  "<strong>" +
                     countryName +
                     "</strong>" +
                     "<br>" +
                     "Capital:" +
                     " " +
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

         // mouse hover effect hide and show the popup
         map.on("mouseenter", this.countries, (e) => {
            map.getCanvas().style.cursor = "pointer";
         });
      },

      // zoom in - out button
      navigationControllers(map) {
         map.addControl(new mapboxgl.NavigationControl());
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
                     // creating random colors each time browser get refreshed
                     "#" + Math.floor(Math.random() * 16777215).toString(16),
                  "line-width": 2,
               },
            });
         });
      },

      // if user click on this button, will show the user
      locateTheUser(map) {
         map.addControl(
            new mapboxgl.GeolocateControl({
               positionOptions: {
                  enableHighAccuracy: true,
               },
               // When active the map will receive updates to the device's location as it changes.
               trackUserLocation: true,
               // Draw an arrow next to the location dot to indicate which direction the device is heading.
               showUserHeading: true,
            })
         );
      },
   },
};

/*
      addPolygon(map) {
         map.on("load", () => {
            // Add a data source containing GeoJSON data.
            map.addSource("maine", {
               type: "geojson",
               data: {
                  type: "Feature",
                  geometry: {
                     type: "Polygon",
                     // These coordinates outline Maine.
                     coordinates: [
                        [
                           [-67.13734, 45.13745],
                           [-66.96466, 44.8097],
                           [-68.03252, 44.3252],
                           [-69.06, 43.98],
                           [-70.11617, 43.68405],
                           [-70.64573, 43.09008],
                           [-70.75102, 43.08003],
                           [-70.79761, 43.21973],
                           [-70.98176, 43.36789],
                           [-70.94416, 43.46633],
                           [-71.08482, 45.30524],
                           [-70.66002, 45.46022],
                           [-70.30495, 45.91479],
                           [-70.00014, 46.69317],
                           [-69.23708, 47.44777],
                           [-68.90478, 47.18479],
                           [-68.2343, 47.35462],
                           [-67.79035, 47.06624],
                           [-67.79141, 45.70258],
                           [-67.13734, 45.13745],
                        ],
                     ],
                  },
               },
            });
         });

         // Add a new layer to visualize the polygon.
         map.addLayer({
            id: "maine",
            type: "fill",
            source: "maine", // reference the data source
            layout: {},
            paint: {
               "fill-color": "#0080ff", // blue color fill
               "fill-opacity": 0.5,
            },
         });

         // Add a black outline around the polygon.
         map.addLayer({
            id: "outline",
            type: "line",
            source: "maine",
            layout: {},
            paint: {
               "line-color": "#000",
               "line-width": 3,
            },
         });
      },
*/

/*
      whenSearchedPopUpMarkersOnClicked(map) {
         map.on("load", () => {
            map.addSource("places", {
               type: "Feature",
               properties: {
                  message: country.name.official,
                  iconSize: [30, 30],
                  title: country.name.official,
                  capital: country.capital,
                  languages: country.languages,
                  continents: country.continents[0],
                  flags: country.cca2.toLowerCase(),
                  description: country.name.offical + country.region,
               },
               geometry: {
                  type: "Point",
                  coordinates: [country.latlng[1], country.latlng[0]],
               },
            });

            return {
               type: "FeatureCollection",
               features: countryDetails,
            };
         });

         // Add a layer showing the places.
         map.addLayer({
            id: "places",
            type: "symbol",
            source: "places",
            layout: {
               "icon-image": "{icon}",
               "icon-allow-overlap": true,
            },
         });

         // When a click event occurs on a feature in the places layer, open a popup at the
         // location of the feature, with description HTML from its properties.
         map.on("click", "places", (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
               coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
               .setLngLat(coordinates)
               .setHTML(description)
               .addTo(map);
         });

         // Change the cursor to a pointer when the mouse is over the places layer.
         map.on("mouseenter", "places", () => {
            map.getCanvas().style.cursor = "pointer";
         });

         // Change it back to a pointer when it leaves.
         map.on("mouseleave", "places", () => {
            map.getCanvas().style.cursor = "";
         });
      },
*/
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
   font: 12px/24px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
</style>
