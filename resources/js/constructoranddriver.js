"use strict";
let datafetcher = null;
const speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;

document.addEventListener("DOMContentLoaded", init);

async function init(){
    if(document.querySelector("main section").getAttribute("class") === "drivers"){

        datafetcher = await import('./data.js');

        if(document.querySelector("main section").getAttribute("type") === "drivers"){
            if(document.querySelector("main section").getAttribute("driverid") === ""){
                //add animation tag to body
                await addLoadingAnimation();
                await fillDrivers();
                document.addEventListener('keypress', function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        return false;
                    }
                });
                if(speechRecognition){addSpeechButton()}
                document.querySelector("#search").addEventListener("keyup",filterElementList);
                removeAnimation()
            }else{
                document.querySelector(".form").setAttribute("id","hidden")
                let driverId = document.querySelector("main section").getAttribute("driverid");
                document.querySelector(".charts").innerHTML += `<canvas id="drivers-points-per-season-bar-chart"></canvas>`
                document.querySelector(".charts").innerHTML += `<canvas id="drivers-wins-per-season-bar-chart"></canvas>`
                await addLoadingAnimation();
                await loadAsideInformation(driverId)
                await loadPointsPerSeasonChart(driverId);
                await loadWinsPerSeasonChart(driverId);
                removeAnimation()
            }
        }else if(document.querySelector("main section").getAttribute("type") === "constructors"){
            if(document.querySelector("main section").getAttribute("constructorid") === ""){
                document.querySelector(".information").setAttribute("id","hidden")
                await addLoadingAnimation();
                await fillConstructors();
                document.addEventListener('keypress', function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        return false;
                    }
                });
                if(speechRecognition){addSpeechButton()}
                document.querySelector("#search").addEventListener("keyup",filterElementList);
                removeAnimation()
            }else{
                //display charts
                document.querySelector(".form").setAttribute("id","hidden")
                let constructorId = document.querySelector("main section").getAttribute("constructorId");
                document.querySelector(".charts").innerHTML += `<canvas id="constructors-wins-per-season-bar-chart"></canvas>`
                document.querySelector(".charts").innerHTML += `<div class="constructordrivers"></div>`
                await loadConstructorsAsideInformation(constructorId);
                await showWinsPerSeasonChart(constructorId);
                await loadAllDriversForConstructor(constructorId)
            }
        }
        
        
        
    }
}

function addSpeechButton(){
    document.querySelector("#form").innerHTML += `<a id="speech" href="#" muted="true"></a>`
    document.querySelector("#speech").addEventListener("click", voiceSearch);
}

function voiceSearch(e){
    const recognition = new speechRecognition();
    e.preventDefault();
    if(e.currentTarget.getAttribute("muted") === "true"){
        e.currentTarget.setAttribute("muted","false")
        recognition.start();
    }else{
        e.currentTarget.setAttribute("muted","true")
        recognition.stop();
    }
    recognition.addEventListener("result", resultOfRecognition);
    function resultOfRecognition(event){
        recognition.stop()
        document.querySelector(`form a`).setAttribute("muted", "true")
        document.querySelector("#search").value = event.results[0][0].transcript;
        filterElementList()
    }
}

async function addLoadingAnimation(){
    document.querySelector("body").setAttribute("animation","true")
    document.querySelector("body").innerHTML += `<div class="animation">
    <img class="car" src="/images/F1car.png">   
    <div class="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div><h1>loading</h1></div>`
    await new Promise(resolve => setTimeout(resolve, 600))//display loading animation;
}

function removeAnimation(){
    document.querySelector("body").removeAttribute("animation");
    let elem = document.querySelector(".animation");
    elem.remove();
}

//insert drivers with their id's into html
async function fillDrivers(){
    let drivers = await datafetcher.getAllDrivers()
    drivers.sort((a,b) => a.givenName.localeCompare(b.givenName))
    let elementlist = document.querySelector(".elementlist ul");
    drivers.forEach(driver => {
        let name = driver.givenName + " " + driver.familyName
        elementlist.insertAdjacentHTML("beforeend",`
        <li data="${name}"><a href="/drivers/${driver.driverId}">${name}</a></li>
    `);
    })
}

//insert constructors with their id's into html
async function fillConstructors(){
    let constructors = await datafetcher.getAllConstructors();
    constructors.sort((a,b) => a.name.localeCompare(b.name))
    let elementlist = document.querySelector(".elementlist ul");
    constructors.forEach(constructor => {
        elementlist.innerHTML += `<li data="${constructor.name}"><a href="/constructors/${constructor.constructorId}">${constructor.name}</a></li>`
    })
}


//filter the elementlist
function filterElementList(){
    let filter = document.querySelector("#search").value.toUpperCase();
    document.querySelectorAll(".elementlist ul li").forEach(element => {
        let lidata = element.getAttribute("data");
        if(lidata.toUpperCase().indexOf(filter) > -1){
            element.setAttribute("id","");
        }else{
            element.setAttribute("id","hidden")
        }
    })
}

//insert driver information into aside
async function loadAsideInformation(driverId){
    const genericinformation = await datafetcher.getDriverInformation(driverId);
    const totalwins = await datafetcher.getAllDriverWins(driverId);
    const totalWDC = await datafetcher.getTotalDriverWDC(driverId);
    const WDCYEARS = await datafetcher.getDriverWDCYears(driverId);
    const totalPolePositions = await datafetcher.getAllDriverPoles(driverId);
    const totalPodiums = await datafetcher.getAllDriverPodiums(driverId)
    document.querySelector(".numbergradient").innerHTML += `<h1>${genericinformation.familyName}</h1>`
    document.querySelector(".statistics").innerHTML += `
        <h2>Name: ${genericinformation.givenName} ${genericinformation.familyName}</h2>
        <h3>Date of birth: ${genericinformation.dateOfBirth}</h3>
        <p>Nationality: ${genericinformation.nationality}</p>
        <p>Total wins: ${totalwins}</p>
        <p>Total world championships: ${totalWDC}</p>
        <p>WDC year(s): ${WDCYEARS}</p>
        <p>Total pole positions: ${totalPolePositions}</p>
        <p>Total Podium finishes: ${totalPodiums}</p>
    `
}

async function loadPointsPerSeasonChart(driverId){
    const data = await datafetcher.getDriverPointsPerSeason(driverId);
    const ctx = document.querySelector("#drivers-points-per-season-bar-chart").getContext("2d");
    let array = Object.values(data);
    const max = Math.max(...array);
    const configuration = {
        type:"bar",
        data:{
            datasets:[
                {
                    data: data
                }
            ]
        },
        options:{
            backgroundColor: '#E10600',
            plugins: {
                title:{
                    display: true,
                    text: 'Points achieved by driver per season',
                    font: {
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
                        text:"Years",
                        font:{
                            size: 16
                        }
                    }
                },
                y:{
                    max: (max + 10),
                    title:{
                        display: true,
                        text:"Points",
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

async function loadWinsPerSeasonChart(driverId){
    const data = await datafetcher.getDriverWinsPerSeason(driverId);
    let array = Object.values(data);
    const max = Math.max(...array);
    const ctx = document.querySelector("#drivers-wins-per-season-bar-chart").getContext("2d");
    const configuration = {
        type:"bar",
        data:{
            datasets:[
                {
                    data: data
                }
            ]
        },
        options:{
            backgroundColor: '#E10600',
            plugins: {
                title:{
                    display: true,
                    text: 'Wins achieved by driver per season',
                    font: {
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
                        text:"Years",
                        font:{
                            size: 16
                        }
                    }
                },
                y:{
                    max: (max + 1),
                    title:{
                        display: true,
                        text:"Wins",
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

async function loadConstructorsAsideInformation(constructorId){
    const basicinfo = await datafetcher.getBasicConstructorInfo(constructorId)
    const totalchampionships = await datafetcher.getTotalConstructorChampionships(constructorId);
    let constructorchampionships = await datafetcher.getConstructorChampionships(constructorId);
    constructorchampionships = constructorchampionships.map(year => {return " " + year});
    let totalyearsparticipating = await datafetcher.getConstructorYearsInF1(constructorId);
    totalyearsparticipating = totalyearsparticipating.map(year => {return " " + year});
    document.querySelector(".numbergradient").innerHTML += `<h1>${basicinfo.name}</h1>`;
    document.querySelector(".statistics").innerHTML += `
    <h2>Nationality: ${basicinfo.nationality}</h2>
    <a href="${basicinfo.url}" target="_blank" >Wiki</a>
    <p>Total constructor championships: ${totalchampionships}</p>
    <p>Constructor championship years: <br> ${constructorchampionships}</p>
    <p>Years of participation in F1: ${totalyearsparticipating} (${totalyearsparticipating.length} years)</p>
    `
}

async function showWinsPerSeasonChart(constructorId){
    const data = await datafetcher.getConstructorWinsPerSeason(constructorId);
    const ctx = document.querySelector("#constructors-wins-per-season-bar-chart").getContext("2d");
    let array = Object.values(data);
    let max = Math.max(...array);
    const config = {
        type:"bar",
        data:{
            datasets:[
                {
                    data: data
                }
            ]
        },
        options:{
            backgroundColor: '#E10600',
            plugins: {
                title:{
                    display: true,
                    text: 'Wins achieved per season',
                    font: {
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
                        text:"Years",
                        font:{
                            size: 16
                        }
                    }
                },
                y:{
                    max: (max + 1),
                    title:{
                        display: true,
                        text:"Wins",
                        font:{
                            size: 16
                        }
                    }
                }
            }
        }
    }
    new Chart(ctx, config)
}

async function loadAllDriversForConstructor(constructorId){
    let data = await datafetcher.getAllDriversForConstructor(constructorId);
    document.querySelector(".statistics").innerHTML += `<p>Total drivers: ${data.length}</p>`
    data = data.sort((a,b) => a.givenName.localeCompare(b.givenName))
    data.forEach(driver => {
        let name = driver.givenName + " " + driver.familyName;
        document.querySelector(".constructordrivers").innerHTML += `<p><a href="/drivers/${driver.driverId}">${name}</a></p>`
    })
}