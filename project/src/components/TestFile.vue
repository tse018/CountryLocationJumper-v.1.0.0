<template>
   <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
   data() {
      return {
         mapbox_id: import.meta.env.VITE_MAPBOX_ID,
         countries: [],
         filteredVersion: [],
      };
   },

   async created() {
      /* fetching rest-countries API from the store and using getter
         to get the values
      */
      this.countries = await this.$store.dispatch("fectCountryApi");
      this.countries = this.$store.getters.getCountries;

      console.log(this.countries);
   },

   mounted() {
      mapboxgl.accessToken = this.mapbox_id;
/*
      let geojson = this.countries.map((country) => {
         return {
            type: "FeatureCollection",
            features: [
               {
                  type: "Feature",
                  properties: {
                     message: "Foo",
                     iconSize: [60, 60],
                     title: country.name.official,
                     capital: country.capital[0],
                     languages: country.languages,
                     continents: country.continents[0],
                  },
                  geometry: {
                     type: "Point",
                     coordinates: [
                        country.capitalInfo.latlng[1],
                        country.capitalInfo.latlng[0],
                     ],
                  },
               },
            ],
         };
      });
*/
      const geojson = {
         type: "FeatureCollection",
         features: [
            {
               type: "Feature",
               properties: {
                  message: "Foo",
                  iconSize: [60, 60],
               },
               geometry: {
                  type: "Point",
                  coordinates: [-66.324462, -16.024695],
               },
            },
            {
               type: "Feature",
               properties: {
                  message: "Bar",
                  iconSize: [50, 50],
               },
               geometry: {
                  type: "Point",
                  coordinates: [-61.21582, -15.971891],
               },
            },
            {
               type: "Feature",
               properties: {
                  message: "Baz",
                  iconSize: [40, 40],
               },
               geometry: {
                  type: "Point",
                  coordinates: [-63.292236, -18.281518],
               },
            },
         ],
      };

      const map = new mapboxgl.Map({
         container: "map",
         style: "mapbox://styles/mapbox/streets-v11",
         center: [-65.017, -16.457],
         zoom: 5,
      });

      // Add markers to the map.
      for (const marker of geojson.features) {
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
};

/* given a query in the form 'lng, lat' or 'lat, lng' */
/* check the query and see if it matches based on the input box */
/*
      coordinatesFinder(query) {
         const matches = query.match(
            /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
         );

         if(!matches) {
            return null;
         };
      },
*/

/*returns the matching geographic coordinates from the input box */
/*
      coordinatesFeature(lng, lat) {
         return {
            center: [lng, lat],
            geometry: {
               type: 'Point',
               coordinates: [lng, lat]
            },
            placeName: 'Lat: ' + lat + ' Lng: ' + lng,
            placeType: ['cooedinate'],
            properties: {},
            type: 'Feature'
         };
      },
*/

/* Add the controller to the map - input box */
/*
      controller() {
         map.addControl(
            new MapboxGeocoder({
               accessToken: mapboxgl.accessToken,
               localGeocoder: coordinatesGeocoder,
               zoom: 4,
               placeholder: 'Try: -40, 170',
               mapboxgl: mapboxgl,
               reverseGeocode: true
            })
         );
      },
*/
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
