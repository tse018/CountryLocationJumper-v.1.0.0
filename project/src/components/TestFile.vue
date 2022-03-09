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

      console.log(this.countries)
   },

   mounted() {
      mapboxgl.accessToken = this.mapbox_id;

      const geoCountries = {
         'type': 'FeatureColletion',
         'features' : this.filtered
      },

      // starting point when uploading the the page
      const map = new mapboxgl.Map({
         container: "map", // container ID
         style: "mapbox://styles/mapbox/streets-v11", // style URL
         center: [15, 60], // starting position [lng, lat]
         zoom: 1, // starting zoom
      });

      /* Add markers to the map */
      // Add markers to the map.
   
      for (const marker of geojson.features) {
      // Create a DOM element for each marker.
      const el = document.createElement('div');
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      el.className = 'marker';
      el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = '100%';

      el.addEventListener('click', () => {
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
