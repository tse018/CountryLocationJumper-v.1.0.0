<template>
<div id='map'></div>

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
         style: "mapbox://styles/mapbox/streets-v11", // style URL
         center: [52.519325, 13.392709], // starting position [lng, lat]
         zoom: 1, // starting zoom
      });
   },
};
</script>

<style scoped>
#map {
   width: 100vw; 
   height: 100vh;
   margin: 0px;
   padding: 0px
}
</style>
