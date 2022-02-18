"use strict";

//code would need to be updated to work in 2022 and further, this version was from 2021

document.addEventListener("DOMContentLoaded",init);

const CURR_SZN_API_URL = "https://ergast.com/api/f1/2022.json"
const OPENROUTESERVICE_API_KEY = "enter key here";
/*
I hardcoded the date because the formula 1 season ended on 12/12/2021 and the ordering tickets aspect of the site wouldn't work anymore
The code for non-hardcoded date would be:
const today = new Date();
const date = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate())
*/
const today = new Date(2021,9,20);
const date = new Date(today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate())
let uuid = require("uuid");

function init(){
    if(document.querySelector("main section").getAttribute("class") === "home"){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(loadmap, function(error){
              loadmap(null);
            });
        }
        insertRacesIntoPage();
        if(typeof orders !== 'undefined'){
          checkIfUserHasTicketsForUpcomingRace();//show notification based on closest race
        }
    }
    if(document.querySelector("main section").getAttribute("class") === "order"){
        displayOrder(document.querySelector("main section").getAttribute("id"));
    }
    if(document.querySelector("main section").getAttribute("class") === "confirmation"){
      setTimeout(function(){showUpcomingRaceNotification(localStorage.getItem("currentorderraceid"),"Your order has been processed!");},2000);
    } 
    if(document.querySelector("main section").getAttribute("class") === "profile"){
        document.querySelector("#notification").addEventListener("click",enableNotifications);
        loadProfile();
    }
}

//load all the cards containing the race calendar on homepage
async function insertRacesIntoPage(){
    const races = await fetchRaces();
    races.forEach(race =>{
      //check if race has already occured, if so add a view results, if not add purchase tickets button
      if(dateChecker(race.date)){
        addRaceHTMLtoPage(race,"View results",`/results/${race.season}/${race.round}`);
      }
      else{
        addRaceHTMLtoPage(race,"Purchase tickets",`/tickets/${race.round}`);
      }
    });
}

//get a racedate in the format from api and check if it has already occured
function dateChecker(receivedracedate){
  let racedate = new Date(receivedracedate)
  return date > racedate
}

//adds the html of a race into the homepage
function addRaceHTMLtoPage(race,value,link){
  document.querySelector(".gp-list").innerHTML += `<div class="gp-div">
    <div class="card">
      <h2>${race.raceName}</h2>
      <p>Round: ${race.round}</p>
      <p>${race.date}</p>
      <a href="${link}">${value} ></a>
    </div>
  </div>`
  document.querySelector(".gp-list .gp-div:last-of-type").style.backgroundImage = `url("../images/${Math.floor(Math.random()*(7-1)+1)}.png")`;
}

//load map on homepage
async function loadmap(coords){

    function createMarkerFeature(coordinate){
      return new ol.Feature({
        type: 'marker',
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinate))
      })
    }

    let races = await fetchRaces();
    let markers = races.map(race => new ol.Feature({
        type: 'marker',
        data: race,
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(race.Circuit.Location.long),parseFloat(race.Circuit.Location.lat)]))
    }));

    if(coords != null){
      markers.push(createMarkerFeature([coords.coords.longitude, coords.coords.latitude]))
    }
    
    //vector for racemarkers
    const markerVectors = new ol.source.Vector({
      features: markers
    });

    //markerlayer with the styling of the markers and the source vector layer
    const markerLayer = new ol.layer.Vector({
      source: markerVectors,
      style: new ol.style.Style({
        image: new ol.style.Icon({
          src: "./images/marker.png",
          anchor: [0.5,1],
          scale: [1.2,1.2]
        })
      })
    })

    //pop-up variables
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');
    
    const overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };

    let map;
    //check if the user has enabled location, if not, still display the map with race markers
    if(coords != null){
      map = new ol.Map({
        controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
        target: 'gp-map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          markerLayer
        ],
        overlays: [overlay],
        view: new ol.View({
          center: ol.proj.fromLonLat([coords.coords.longitude,coords.coords.latitude]),
          zoom: 5
        })
      });
    }else{
      let race = races[0];
      map = new ol.Map({
        controls: [new ol.control.FullScreen(), new ol.control.Zoom()],
        target: 'gp-map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          markerLayer
        ],
        overlays: [overlay],
        view: new ol.View({
          center: ol.proj.fromLonLat([parseFloat(race.Circuit.Location.long),parseFloat(race.Circuit.Location.lat)]),
          zoom: 3
        })
      });
    }
    
    if(coords != null){
      getClosestRaceRoute(coords.coords.longitude, coords.coords.latitude).then( response => {
        const {location, route} = response;
        const routeLayer = drawRoute(route);
        map.addLayer(routeLayer);
        //check the date to show purschase tickets or results
        if(dateChecker(location.date)){
          content.innerHTML = `<b>The closest race to you is: ${location.raceName}</b><br /><a href="/results/${location.season}/${location.round}">View Results ></a>`;
        }
        else{
          content.innerHTML = `<b>The closest race to you is: ${location.raceName}</b><br /><a href="/tickets/${location.round}">Purchase tickets: ></a>`;
        }
        //set the postition of the map view to the closest race of the user
        overlay.setPosition(ol.proj.fromLonLat([parseFloat(location.Circuit.Location.long),parseFloat(location.Circuit.Location.lat)]));
      })
    }
    

    const bounds = markerVectors.getExtent();

    //eventlistener to detect a click on the map, that then filters clicks with the markerlayer and displays the popup if the click was on a marker
    map.on('singleclick', function (evt) {
      let feature = map.forEachFeatureAtPixel(evt.pixel, function(feature){
        return feature;
      },{layerFilter: function(layer){
        return layer === markerLayer
      }})

      if(feature && feature.A.type === "marker"){
        const coordinate = evt.coordinate;
        let race = feature.A.data
        if(dateChecker(race.date)){
          content.innerHTML = `<p>${race.raceName}:</p><a href="/results/${race.season}/${race.round}">View Results ></a>`;
        }else{
          content.innerHTML = `<p>${race.raceName}:</p><a href="/tickets/${race.round}">Purchase tickets: ></a>`;
        }
        overlay.setPosition(coordinate);}
      });
      
    //remove the doubleclick so it can be used for fullscreen
    let dblclickinteraction = null;
    map.getInteractions().getArray().forEach(function(interaction) {
      if (interaction instanceof ol.interaction.DoubleClickZoom) {
        dblclickinteraction = interaction;
      }
    });
    map.removeInteraction(dblclickinteraction);

    document.addEventListener("dblclick", toggleFullScreen);
    document.addEventListener("dbltap", toggleFullScreen);

}

function toggleFullScreen(){
  let map = document.querySelector("#gp-map");
  if(!document.fullscreenElement){
    map.requestFullscreen();
  }
  else{
    if(document.exitFullscreen){
      document.exitFullscreen();
    }
  }
}

//draw the route on a map
function drawRoute(route){
    const polyline = route.geometry.coordinates.map(el => ol.proj.fromLonLat(el));

    const routeLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [ new ol.Feature({
            type: 'route',
            geometry: new ol.geom.LineString(polyline)
        })]
      }),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 6,
            color: [255,87,34,0.8]
        })
      })
    });
    return routeLayer;
}

//display the data of the race you want to order a ticket for
async function displayOrder(raceid){
  const race = await fetchSpecificRace(raceid)
  localStorage.setItem("currentorderraceid",raceid);
  document.querySelector("#racedata").innerHTML += `<h2>${race.raceName}</h2>
      <h3>${race.Circuit.circuitName}</h3>
      <p>${race.date}</p>
      <p>${race.Circuit.Location.country}, ${race.Circuit.Location.locality}</p>
      <p>${race.time}</p>
      <img src="../images/order${Math.floor(Math.random()*(5-1)+1)}.png" alt="image of cars racing against eachother"></img>`;
    if(dateChecker(race.date)){
      document.querySelector("#racedata").innerHTML += "<p class='warning'>This race has already occured.</p>"
    }
    else{
      document.getElementById("submit").removeAttribute("disabled")
    }
}

//fetch all races, loop over every ticket in profile and filter the races to display specific race data per ticket
async function loadProfile(){
    let races = await fetchRaces();
    document.querySelectorAll(".tickets section div").forEach(e => {
      let roundnr = e.getAttribute("raceid");
      let race = races.filter(race => {return race.round === roundnr})[0];
      //check if the ticket is an old one or not, if so remove it.
      if(dateChecker(race.date)){
        e.innerHTML = '';
        e.parentNode.removeChild(e)
      }else{
        e.innerHTML = `<h1>${race.raceName}: </h1> <h2>${race.date}</h2>` + e.innerHTML + `<p>code: ${uuid.v4()}</p>`;
      }});
}

function enableNotifications(e){
  e.preventDefault();
  Notification.requestPermission();
}

async function checkIfUserHasTicketsForUpcomingRace(){
  let orderswithgpid = orders.map((order) => order.grand_prix_id);
  let racedates = [];
  for(let gpid of orderswithgpid){
    racedates.push(await fetchSpecificRace(gpid));
  }
  racedates = racedates.map((race) => race.date);
  for(let i = 0;i<racedates.length;i++){
    let racedatemin7 = new Date(racedates[i])
    racedatemin7.setDate(racedatemin7.getDate() - 7)
    if(racedatemin7 < date && date < new Date(racedates[i])){
      showUpcomingRaceNotification(orderswithgpid[i],"You have a ticket for an upcoming race:")
    }
  }
}

async function showUpcomingRaceNotification(gpid,title){
  const raceinformation = await fetchSpecificRace(gpid);
  let notification = new Notification(title,{
    body:`${raceinformation.raceName} - Click to view`
  })
  notification.addEventListener("click",() => {
    location.replace("profile")
  })
}

//fetch races from api
async function fetchRaces(){
  try{
    const api_resp = await fetch(CURR_SZN_API_URL);
    let response = await api_resp.json();
    if(response.MRData.total === "0"){
      const fallback_api_resp = await fetch(`https://ergast.com/api/f1/2021.json`);
      response = await fallback_api_resp.json();
    }
    return response.MRData.RaceTable.Races;
  }catch(error){
    console.log(error);
  }
}

//fetch specific race from api
async function fetchSpecificRace(roundnr){
  try{
    const api_resp = await fetch(`https://ergast.com/api/f1/current/${roundnr}.json`);
    let response = await api_resp.json();
    if(response.MRData.total === "0"){
      const fallback_api_resp = await fetch(`https://ergast.com/api/f1/2021/${roundnr}.json`);
      response = await fallback_api_resp.json();
    }
    return response.MRData.RaceTable.Races[0];
  }catch(error){
    console.log(error);
  }
}

//fetch the closest race to you 
async function getClosestRaceRoute(startlong, startlat) {

  function distance(long1, lat1, long2, lat2) {
    const r = 6371e3;
    const sigma1 = lat1 * Math.PI/180;
    const sigma2 = lat2 * Math.PI/180;
  
    const sigmadif = (lat2-lat1) * Math.PI/180;
    const lambdadif = (long2 - long1) * Math.PI/180;
  
    const a = Math.sin(sigmadif/2) * Math.sin(sigmadif/2) +
                Math.cos(sigma1) * Math.cos(sigma2) * Math.sin(lambdadif/2)   * Math.sin(lambdadif/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return r*c;
  }

  function sort_helper(element) {
      const value = distance(parseFloat(element.Circuit.Location.long),parseFloat(element.Circuit.Location.lat), startlong, startlat);
      return value;
  }

  const races = await fetchRaces();
  

  const closest = Array.from(races).sort((a, b) => sort_helper(a) - sort_helper(b))[0];
  const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_API_KEY}&start=${startlong},${startlat}&end=${closest.Circuit.Location.long},${closest.Circuit.Location.lat}`);

  const result = await response.json();
  return {location: closest, route: result.features[0]};
}


