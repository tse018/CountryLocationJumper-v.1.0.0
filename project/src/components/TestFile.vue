<template>
   <div id="map"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
   data() {
      return {
         mapbox_id: import.meta.env.VITE_MAPBOX_ID,
      };
   },

   mounted() {
      mapboxgl.accessToken = this.mapbox_id;

      const map = new mapboxgl.Map({
         container: "map", // container ID
         style: "mapbox://styles/mapbox/light-v10", // style URL
         center: [-68.137343, 45.137451], // starting position
         zoom: 5, // starting zoom
      });

      map.on('load', () => {
map.addSource('country-boundaries-simplified', {
type: 'vector',
url: 'mapbox://examples.countries-simplification'
});

map.addLayer({
'id': 'countries-simplification-data',
'type': 'line',
'source': 'country-boundaries-simplified',
'source-layer': 'countries_polygons',
'layout': {
'line-join': 'round',
'line-cap': 'round'
},
'paint': {
'line-color': '#' + Math.floor(Math.random()*16777215).toString(16),
'line-width': 3
}})})


      

   
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
