import{r as d,o as c,c as m,m as i,l as g,a as u,b as l,t as _,d as y,e as k,f as v,g as b}from"./vendor.4d515961.js";const C=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerpolicy&&(s.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?s.credentials="include":r.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}};C();var p=(e,t)=>{const o=e.__vccOpts||e;for(const[n,r]of t)o[n]=r;return o};const w={};function M(e,t){const o=d("RouterView");return c(),m(o)}var x=p(w,[["render",M]]);const $={data(){return{countries:[],markers:{},location:[],error:"",mapbox_id:"pk.eyJ1IjoidHNlMDE4IiwiYSI6ImNsMmtkczJ2ZTAybmozY25reXE3MXpmMWUifQ.sm5TPLNYLn4Ozr1r7TCCZQ"}},async created(){this.countries=await this.$store.dispatch("fetchCountryApi"),this.countries=this.$store.getters.getCountries,this.error=this.$store.getters.getError,this.markers=this.creatingGeoJsonMarkers(),this.creatingMapFromMapBox()},computed(){this.error=this.$store.getters.getError},methods:{creatingMapFromMapBox(){i.accessToken=this.mapbox_id;const e=new i.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:[10,53],zoom:5}),t=[];for(const o of this.markers.features){const n=o.geometry.coordinates,r=Object.values(n);t.push(r),e.on("load",()=>{t.map((s,a)=>{setTimeout(()=>{e.jumpTo({center:s})},2e3*a)})})}this.createMarkers(e),this.searchLocationGeoCoder(e),this.navigationControllers(e),this.borderColor(e),this.locateTheUser(e)},creatingGeoJsonMarkers(){const e=this.countries.map(t=>({type:"Feature",properties:{message:t.name.official,iconSize:[30,30],title:t.name.official,capital:t.capital,languages:t.languages,continents:t.continents[0],flags:t.cca2.toLowerCase(),description:t.name.offical,population:t.population},geometry:{type:"Point",coordinates:[t.latlng[1],t.latlng[0]]}}));return{type:"FeatureCollection",features:e}},searchLocationGeoCoder(e){const t=new g({accessToken:i.accessToken,mapboxgl:i,placeholder:"Search for a country",flyTo:{bearing:0,speed:.2,curve:4,easing:o=>o}});t.on("result",function({result:o}){console.log(o.place_name)}),document.getElementById("geocoder").appendChild(t.onAdd(e))},createMarkers(e){for(const t of this.markers.features){const o=document.createElement("div"),n=t.properties.iconSize[0],r=t.properties.iconSize[1],s=t.properties.title,a=t.properties.capital,f=t.properties.population;o.className="marker",o.style.backgroundImage=`url(https://countryflagsapi.com/svg/${t.properties.flags})`,o.style.backgroundRepeat="no-repeat",o.style.width=`${n}px`,o.style.height=`${r}px`,o.style.backgroundSize="100%";const h=new i.Popup({closeButton:!1,closeOnClick:!1}).setHTML("<strong>"+s+"</strong><br>Capital: "+a+"<br>Population: "+f);new i.Marker(o).setLngLat(t.geometry.coordinates).setPopup(h).addTo(e)}},navigationControllers(e){e.addControl(new i.NavigationControl)},borderColor(e){e.on("load",()=>{e.addSource("country-boundaries-simplified",{type:"vector",url:"mapbox://examples.countries-simplification"}),e.addLayer({id:"countries-simplification-data",type:"line",source:"country-boundaries-simplified","source-layer":"countries_polygons",layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#"+Math.floor(Math.random()*16777215).toString(16),"line-width":4}})})},locateTheUser(e){e.addControl(new i.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0,showUserHeading:!0}))}}},L={key:0},E={key:1},T=l("div",{id:"geocoder",class:"geocoder"},null,-1),B=l("div",{id:"map"},null,-1),S=[T,B];function N(e,t,o,n,r,s){return r.error?(c(),u("section",L,[l("p",null," Errors: "+_(r.error),1)])):(c(),u("section",E,S))}var A=p($,[["render",N]]);const O={components:{MapBox:A}};function z(e,t,o,n,r,s){const a=d("MapBox");return c(),m(a)}var P=p(O,[["render",z]]),I=[{name:"home",path:"/",component:P}],H={state(){return{countries:[],errors:""}},mutations:{setCountries(e,t){e.countries=t},setError(e,t){e.errors=t}},actions:{async fetchCountryApi(e){const o=await fetch("https://restcountries.com/v3.1/all");try{if(o.status>=200&&o.status<300){const n=await o.json();e.commit("setCountries",n)}else throw o.status===404?new Error("url ikke eksistere"):new Error("noe gikk galt!")}catch(n){e.commit("setError",n)}}},getters:{getCountries(e){return e.countries},getError(e){return e.errors}}},U={modules:{countryDatabase:H}};const j=y(U),F=k({routes:I,history:v(),scrollBehavior(){window.scrollTo({top:0,left:0,behavior:"smooth"})}});b(x).use(j).use(F).mount("#app");
