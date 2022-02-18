"use strict";

document.addEventListener("DOMContentLoaded",init);

let datafetcher = null;

async function init(){
    let year;
    let round;
    datafetcher = await import('./data.js');
    if(document.querySelector("main section").getAttribute("class") === "results"){
        year = document.querySelector("main section").getAttribute("year")
        round = document.querySelector("main section").getAttribute("roundnr")
        if(year != "" && round === ""){
            await showYearCharts(year)
            hideContainers("round")
        }else if(year != "" && round != ""){
            await showRoundCharts(year,round);
            hideContainers("year")
        }
        if(document.querySelector("main section").getAttribute("year") === ""){
            addYearSelect("")
        }else{
            
            addYearSelect(year)
            if(document.querySelector("main section").getAttribute("roundnr") === ""){
                addRoundSelect(year, "")
            }else{
                
                addRoundSelect(year, round)
            }
        }
        
    }   
}

function hideContainers(value){
    document.querySelectorAll(`.${value}`).forEach(element => element.setAttribute("id","hidden"));
}

async function addYearSelect(selectedyear){
    document.querySelector("#form").innerHTML += `<label for="wdcyear">Pick a year:</label><select name="wdcyear" id="wdcyear"></select>`
    const response = await fetchAllWorldChampionships();
    response.forEach((season) => {
        document.querySelector("#wdcyear").innerHTML += `<option value="${season.season}">${season.season}</option>`;
    })
    if(selectedyear != ""){
        document.querySelector("#wdcyear").value = selectedyear;
    }
    document.querySelector("#wdcyear").addEventListener("change",changedYear);
}

async function addRoundSelect(currentyear, currentround){
    document.querySelector("#form").innerHTML += `<label for="wdcround">Pick a round:</label><select name="wdcround" id="wdcround"></select>`
    document.querySelector("#wdcround").innerHTML += `<option value="0">0</option>`
    const response = await fetchRoundsPerChampionship(currentyear);
    response.forEach((race)=>{
        document.querySelector("#wdcround").innerHTML += `<option value="${race.round}">${race.round}</option>`
    })
    if(currentround != ""){
        document.querySelector("#wdcround").value = currentround;
    }
    document.querySelector("#wdcround").addEventListener("change",changedRound);
}

function toggleFullScreen(e){
    let target = e.target
    if(!document.fullscreenElement){
      target.requestFullscreen();
    }
    else{
      if(document.exitFullscreen){
        document.exitFullscreen();
      }
    }
  }

async function fetchAllWorldChampionships(){
    try{
        const api_resp = await fetch("https://ergast.com/api/f1/seasons.json?limit=100");
        const resp = await api_resp.json();
        return resp.MRData.SeasonTable.Seasons;
    }catch(error){
        console.log(error)
    }
}

async function fetchRoundsPerChampionship(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}.json`);
        const response = await api_resp.json();
        return response.MRData.RaceTable.Races;
    }catch(error){
        console.log(error)
    }
}

function changedYear(e){
    let year = e.currentTarget.value;
    let form = document.querySelector("#form");
    form.setAttribute("action",`/results/${year}`);
    form.submit();
}

function changedRound(e){
    let year = document.querySelector("main section").getAttribute("year");
    let form = document.querySelector("#form");
    let round = e.currentTarget.value;
    if(round != "0"){
        form.setAttribute("action",`/results/${year}/${round}`);
        form.submit();
    }else{
        form.setAttribute("action",`/results/${year}`);
        form.submit();
    }
}

async function showYearCharts(year){
    await loadTourMap(year)
    await showYearInfo(year);
    await showDoughnutDriversChart(year);
    await showDoughnutConstructorsChart(year);
    await showLineChart(year);
}

async function showRoundCharts(year,round){
    await showRoundInfo(year, round);
    await showDriversPointsBarChart(year,round);
    await showDriverStandingsAfterRoundBarChart(year, round);
}

async function showYearInfo(year){
    const seasoninfo = await datafetcher.getSeasonInfo(year)
    const points = await datafetcher.getHighestPointsInAYear(year)
    let winnername = seasoninfo.DriverStandings[0].Driver.givenName + " " + seasoninfo.DriverStandings[0].Driver.familyName;  
    let wins = seasoninfo.DriverStandings[0].wins
    document.querySelector(".information").innerHTML += `
        <div>
            <h1>Season: ${seasoninfo.season} - Races: ${seasoninfo.round}</h1>
            <h2>Winner: ${winnername}</h2>
            <h3>${wins} wins - ${points} points</h3>
        </div>
    `
}

async function loadTourMap(year){
    document.querySelector("#world-tour").innerHTML += `<h1>Countries with race held:</h1>`
    const countrynames = await datafetcher.getAllRaceCountries(year)
    let width = 500;
    let height = 260;
    
    let projection = d3.geoOrthographic()
        .scale(100)
        .clipAngle(90);
    let path = d3.geoPath()
    .projection(projection)
    
    let globe = d3.select("#world-tour").append("svg").attr("width",width).attr("height",height);

    globe.append("circle")
        .attr("class", "graticule-outline")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", projection.scale());

    //import countries
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", function(error, world){
        let countries = topojson.object(world,world.objects.countries).geometries;
        let filteredcountries = countries.filter(country => countrynames.includes(country.properties.name))
        let othercountries = countries.filter(country => !(countrynames.includes(country.properties.name)))
        let n = filteredcountries.length
        othercountries.forEach(country => {
            filteredcountries.push(country)
        })
        let i = -1;

        let country = globe.selectAll(".country")
        .data(filteredcountries)
        .enter().insert("path",".graticule")
        .attr("class","country")
        .attr("d",path)

        step();

        function step(){
            
            if(++i >= n) i = 0;

            country.transition()
                .style("fill", function(d,j){return j === i ? "red" : "#b8b8b8";});

                d3.transition()
                .delay(250)
                .duration(1250)
                .tween("rotate", function() {
                    let point = d3.geoCentroid(filteredcountries[i]),
                      rotate = d3.interpolate(projection.rotate(), [-point[0], -point[1]]);
                  return function(t) {
                    projection.rotate(rotate(t));
                    country.attr("d", path);
                  };
                })
              .transition()
            .on("end", step);
        }
    });
        
}
        
async function showDoughnutDriversChart(year){
    const unsorted = await datafetcher.getDriverStandingsEndOfSeason(year);
    const data = Object.fromEntries(Object.entries(unsorted).sort(([,a],[,b])=>b-a));
    let colors = randomColor({
        count: 30,
        luminosity:"dark"
    })
    let totalPoints = 0;
    Object.values(data).forEach((points) => {
        totalPoints += points
    })
    const ctx = document.querySelector("#drivers-doughnut-chart").getContext("2d");
    const configuration = {
        type:"doughnut",
        data:{
            labels: Object.keys(data),
            datasets:[
                {
                    data: Object.values(data),
                    backgroundColor:colors
                }
            ]
        },
        options:{
            plugins:{
                title:{
                    display:true,
                    text:`Drivers points (${totalPoints} in total)`,
                    font:{
                        size:24
                    }
                }
            }
        }
    };
    new Chart(ctx,configuration)
}

async function showDoughnutConstructorsChart(year){
    if(parseInt(year) < 1958){
        document.querySelector("#constructors-doughnut-chart").height = 500;
        document.querySelector("#constructors-doughnut-chart").width = 900;
        let ctx = document.querySelector("#constructors-doughnut-chart").getContext("2d");
        ctx.font = "25px Arial";
        ctx.fillText("Constructors data available after 1957", 300, 250);
    }else{
        const unsorted = await datafetcher.getConstructorStandingsEndOfSeason(year)
        const data = Object.fromEntries(Object.entries(unsorted).sort(([,a],[,b])=>b-a));
        let colors = randomColor({
            count:30,
            luminosity:"dark"
        });
        let totalPoints = 0;
        Object.values(data).forEach((points) => {
            totalPoints += points
        });
        let ctx = document.querySelector("#constructors-doughnut-chart").getContext("2d");
        const configuration = {
            type:"doughnut",
            data:{
                labels: Object.keys(data),
                datasets:[
                    {
                        data: Object.values(data),
                        backgroundColor: colors
                    }
                ]
            },
            options:{
                plugins:{
                    title:{
                        display:true,
                        text:`Constructors points (${totalPoints} in total)`,
                        font:{
                            size: 24
                        }
                    }
                }
            }
        }
        new Chart(ctx, configuration);
    }
}

async function showLineChart(year){
    const data = await datafetcher.getDriverPointsOverSeason(year)
    const ctx = document.querySelector("#drivers-line-chart").getContext('2d');
    let dataset = data.map(driver => {return {label:driver.id,data:driver.values,backgroundColor:randomColor({luminosity:"dark"})}})
    let labels = await datafetcher.getAllRaces(year)
    let maxpoints = parseFloat(await datafetcher.getHighestPointsInAYear(year))
    const configuration = {
        type: 'line',
        data:{
            labels: labels,
            datasets: dataset
        },
        options:{
            plugins:{
                title:{
                    display: true,
                    text: "Driver points over season",
                    font:{
                        size: 24
                    }
                },
                legend:{
                    labels:{
                        boxHeight: 1
                    }
                }
            },
            scales:{
                x:{
                    title:{
                        display:true,
                        text:"Races",
                        font:{
                            weight: 'bold'
                        }
                    }
                },
                y:{
                    max:(maxpoints+10),
                    title:{
                        display: true,
                        text:"Points",
                        font:{
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    };
    new Chart(ctx, configuration)
}

async function showRoundInfo(year, round){
    //show general text info
    const roundinfo = await datafetcher.getRoundInfo(year, round)
    document.querySelector(".information").innerHTML += `
        <div>
            <h1>${roundinfo.raceName}</h1>
            <h2>Date: ${roundinfo.date}</h2>
            <h3>Location: ${roundinfo.Circuit.Location.locality}, ${roundinfo.Circuit.Location.country}</h3>
        </div>
    `
    //show map of race location
    let marker = new ol.Feature({
        type: "marker",
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(roundinfo.Circuit.Location.long),parseFloat(roundinfo.Circuit.Location.lat)]))
    })

    const markerVectors = new ol.source.Vector({
        features: [marker]
    })

    const markerLayer = new ol.layer.Vector({
        source: markerVectors,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src:"../../images/marker.png",
                anchor: [0.5,1],
                scale: [1.2,1.2]
            })
        })
    })

    const map = new ol.Map({
        target: 'map',
        layers:[
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),markerLayer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([parseFloat(roundinfo.Circuit.Location.long),parseFloat(roundinfo.Circuit.Location.lat)]),
            zoom: 12
        })
    })

}

async function showDriversPointsBarChart(year, round){
    const data = await datafetcher.getRaceResults(year,round)
    const ctx = document.querySelector("#drivers-points-bar-chart").getContext('2d');
    const configuration = {
        type:'bar',
        data:{
            datasets:[
                {
                    data: data
                }
            ]
        },
        options:{
            backgroundColor: '#E10600',
            plugins:{
                title:{
                    display: true,
                    text: 'Points achieved by drivers this race',
                    font:{
                        size: 24
                    }
                },
                legend:{
                    display: false
                }
            },
            scales:{
                x:{
                    title:{
                        display: true,
                        text: "Drivers",
                        font:{
                            size: 16
                        }
                    }
                },
                y:{
                    max: 30,
                    title:{
                        display: true,
                        text: "Points",
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    };
    new Chart(ctx, configuration);
}

async function showDriverStandingsAfterRoundBarChart(year, round){
    const data = await datafetcher.getDriverStandingsAfterRound(year, round);
    const ctx = document.querySelector("#drivers-points-after-round-bar-chart").getContext("2d");
    const max = await datafetcher.getHighestPointsAfterRound(year, round);
    const configuration = {
        type: "bar",
        data:{
            datasets:[
                {
                    data: data
                }
            ]
        },
        options: {
            backgroundColor: '#E10600',
            plugins:{
                title:{
                    display:true,
                    text:"Drivers total points after current race",
                    font:{
                        size: 24
                    }
                },
                legend:{
                    display:false
                }
            },
            scales:{
                x:{
                    title:{
                        display: true,
                        text:"Drivers",
                        font:{
                            size: 16
                        }
                    }
                },
                y:{
                    max: (max + 10),
                    title:{
                        display: true,
                        text :"Points",
                        font:{
                            size: 16
                        }
                    }
                }
            }
        }
    }
    new Chart(ctx, configuration)
}
