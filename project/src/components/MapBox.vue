<template>
   <div id="geocoder" class="geocoder"></div>

   <button id="fly">Go To Start posistion</button>

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
         polygon: [],
         popUp: [],
      };
   },

   async created() {
      this.countries = await this.$store.dispatch("fetchCountryApi");
      this.countries = this.$store.getters.getCountries;

      // the new mapped geoJson file created in the methods, will be stored in this.markers array from data()
      this.markers = this.creatingGeoJsonMarkers();

      //this.polygon
      //this.popUp

      this.creatingMapFromMapBox();
   },

   methods: {
      creatingMapFromMapBox() {
         mapboxgl.accessToken = this.mapbox_id;

         // creating the map to the browser and giving start posistion
         const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [10, 30],
            zoom: 2,
         });

         this.createMarkers(map);
         this.searchLocationGeoCoder(map);
         this.navigationControllers(map);
         this.goBackToStartPosistion(map);
         this.borderColor(map);
         this.colorEachCountries(map);
         //this.whenSearchedPopUpMarkersOnClicked(map);
         //this.addPolygon(map);
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
                  description: country.name.offical + country.region,
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

      // working progress - adding polygon colors for each countries
      creatingGeoJsonPolygon() {
         map.on("load", () => {
            map.addSource("maine", {});
         });
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
         });

         document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
      },

      createMarkers(map) {
         for (const marker of this.markers.features) {
            // Create a DOM element for each marker.
            const el = document.createElement("div");
            const width = marker.properties.iconSize[0];
            const height = marker.properties.iconSize[1];
            el.className = "marker";

            /* using countryflagsapi to get all the flags pictures to showcase as icons */
            el.style.backgroundImage = `url(https://countryflagsapi.com/svg/${marker.properties.flags})`;
            el.style.backgroundRepeat = "no-repeat";
            el.style.width = `${width}px`;
            el.style.height = `${height}px`;
            el.style.backgroundSize = "100%";

            // Add markers to the map.
            new mapboxgl.Marker(el)
               .setLngLat(marker.geometry.coordinates)
               .setLngLat(marker.geometry.coordinates)
               .addTo(map);
         }
      },

      // zoom in - out button
      navigationControllers(map) {
         map.addControl(new mapboxgl.NavigationControl());
      },

      // working progress - add button to reset / go back to start posistion
      goBackToStartPosistion(map) {
         let isAtStart = true;

         const target = isAtStart ? "" : "";

         isAtStart = !isAtStart;

         map.flyTo({
            // These options control the ending camera position: centered at
            // the target, at zoom level 9, and north up.
            center: target,
            zoom: 2,
            bearing: 0,

            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 0.2, // make the flying slow
            curve: 1, // change the speed at which it zooms out

            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: (t) => t,

            // this animation is considered essential with respect to prefers-reduced-motion
            essential: true,
         });
      },

      // 
      colorEachCountries(map) {
         map.on("load", function () {
            map.addLayer(
               {
                  id: "country-boundaries",
                  source: {
                     type: "vector",
                     url: "mapbox://mapbox.country-boundaries-v1",
                  },
                  "source-layer": "country_boundaries",
                  type: "fill",
                  paint: {
                     "fill-color": "#d2361e",
                     "fill-opacity": 0.4,
                  },
               },
               "country-label"
            );

            map.setFilter("country-boundaries", ["iso_3166_1_alpha_3"]);
         });
      },

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
                     "#" + Math.floor(Math.random() * 16777215).toString(16),
                  "line-width": 1,
               },
            });
         });
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
   width: 100vw;
   height: 100vh;
   margin: 75px 0 0 0;
   padding: 0;
}

#fly {
   display: block;
   position: relative;
   margin: 40px auto;
   width: 50%;
   height: 40px;
   padding: 10px;
   border: none;
   border-radius: 3px;
   font-size: 12px;
   text-align: center;
   color: #fff;
   background: #ee8a65;
}

.geocoder {
   position: absolute;
   z-index: 1;
   width: 50%;
   left: 50%;
   margin-left: -25%;
   top: 10px;
}

.mapboxgl-ctrl-geocoder {
   min-width: 100%;
}

.mapboxgl-popup {
   max-width: 400px;
   font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}

/* removing default geocoder marker from the map */
circle,
path,
ellipse {
   fill: transparent;
}
</style>
