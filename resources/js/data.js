async function fetchDriverStandingsEndOfSeason(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/driverStandings.json`);
        const resp = await api_resp.json();
        return resp.MRData.StandingsTable.StandingsLists[0];
    }catch(error){
        console.log(error)
    }
}

async function fetchConstructorStandingsEndOfSeason(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/constructorStandings.json`);
        const resp = await api_resp.json();
        return resp.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    }catch(error){
        console.log(error)
    }
}

async function fetchAllDriversFromSeason(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/drivers.json?limit=1000000`)
        const resp = await api_resp.json()
        return resp.MRData.DriverTable.Drivers;
    }catch(error){
        console.log(error);
    }
}

async function fetchAllRacesFromSeason(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}.json?limit=10000`)
        const resp = await api_resp.json()
        return resp.MRData.RaceTable.Races;
    }catch(error){
        console.log(error);
    }
}

async function fetchYearResults(year){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/results.json?limit=1000000`)
        const resp = await api_resp.json()
        return resp.MRData.RaceTable.Races;
    }catch(error){
        console.log(error);
    }
}

async function fetchRaceResults(year, round){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/${round}/results.json?limit=10000`)
        const resp = await api_resp.json()
        return resp.MRData.RaceTable.Races[0];
    }catch(error){
        console.log(error)
    }
}

async function fetchDriverStandingsAfterRound(year, round){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/${round}/driverStandings.json?limit=10000`)
        const resp = await api_resp.json()
        return resp.MRData.StandingsTable.StandingsLists[0].DriverStandings
    }catch(error){
        console.log(error)
    }
}

async function fetchAllDrivers(){
    try{
        const api_resp = await fetch("https://ergast.com/api/f1/drivers.json?limit=100000");
        const response = await api_resp.json();
        return response.MRData.DriverTable.Drivers;
    }catch(error){
        console.log(error)
    }
}

async function fetchDriverInformation(driverId){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/drivers/${driverId}.json`);
        const response = await api_resp.json();
        return response.MRData.DriverTable.Drivers[0];
    }catch(error){
        console.log(error)
    }
}

async function fetchDriverFinishingPositions(driverId,pos){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/drivers/${driverId}/results/${pos}.json?limit=250`);
        const resp = await api_resp.json();
        return resp.MRData;
    }catch(error){
        console.log(error)
    }
}

async function fetchAllDriverWDC(driverId){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/drivers/${driverId}/driverStandings/1/seasons.json`);
        const response = await api_resp.json();
        return response.MRData;
    }catch(error){
        console.log(error);
    }
}

async function fetchAllDriverPolePositions(driverId){
    try{
        const api_response = await fetch(`https://ergast.com/api/f1/drivers/${driverId}/qualifying/1.json?limit=1000`);
        let response = await api_response.json();
        response = parseInt(response.MRData.total)
        return response;
    }catch(error){
        console.log(error)
    }
}

async function fetchAllDriverYearsInF1(driverId){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/drivers/${driverId}/seasons.json?limit=1000`)
        const response = await api_resp.json()
        let years = []
        response.MRData.SeasonTable.Seasons.forEach(season => {
            years.push(season.season)
        })
        return years;
    }catch(error){
        console.log(error)
    }
}

async function fetchDriverSeasonResults(year, driverId){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/${year}/drivers/${driverId}/results.json?limit=10000`)
        const resp = await api_resp.json();
        return resp.MRData.RaceTable.Races;
    }catch(error){
        console.log(error)
    }
}

async function fetchAllConstructors(){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/constructors.json?limit=10000`);
        const response = await api_resp.json();
        return response.MRData.ConstructorTable.Constructors;
    }catch(error){
        console.log(error)
    }
}

async function fetchBasicConstructorInfo(constructorId){
    try{
        const api_response = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}.json?limit=1000`);
        const resp = await api_response.json();
        return resp.MRData.ConstructorTable.Constructors[0];
    }catch(error){
        console.log(error);
    }
}

async function fetchConstructorChampionships(constructorId){
    try{
        const api_resp = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}/constructorstandings/1.json?limit=10000`);
        const response = await api_resp.json();
        return response.MRData;
    }catch(error){
        console.log(error)
    }
}

async function fetchConstructorYearsInF1(constructorId){
    try{
        const api_response = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}/seasons.json?limit=1000`);
        const response = await api_response.json();
        return response.MRData.SeasonTable.Seasons;
    }catch(error){
        console.log(error)
    }
}

async function fetchConstructorWinsAllTime(constructorId){
    try{
        const api_response = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}/results/1.json?limit=10000`);
        const response = await api_response.json();
        return response.MRData.RaceTable.Races;
    }catch(error){
        console.log(error)
    }
}

async function fetchAllDriversForConstructor(constructorId){
    try{
        const api_res = await fetch(`https://ergast.com/api/f1/constructors/${constructorId}/drivers.json?limit=10000`);
        const response = await api_res.json();
        return response.MRData.DriverTable.Drivers;
    }catch(error){
        console.log(error)
    }
}

export async function getDriverStandingsEndOfSeason(year){
    const standingslist = await fetchDriverStandingsEndOfSeason(year);
    let response = {}
    standingslist.DriverStandings.forEach((driver) => {
        let name = driver.Driver.givenName + " " + driver.Driver.familyName;
        response[name] = parseFloat(driver.points)
    })
    return response;
}

export async function getConstructorStandingsEndOfSeason(year){
    const standingslist = await fetchConstructorStandingsEndOfSeason(year);
    let response = {}
    standingslist.forEach((constructor) => {
        let name = constructor.Constructor.name;
        response[name] = parseFloat(constructor.points)
    })
    return response;
}

export async function getAllRaces(year){
    const races = await fetchAllRacesFromSeason(year);
    return races.map(race => race.raceName)
}

export async function getAllRaceCountries(year){
    const races = await fetchAllRacesFromSeason(year);
    return races.map(race => race.Circuit.Location.country);
}

export async function getHighestPointsInAYear(year){
    const standings = await fetchDriverStandingsEndOfSeason(year)
    return standings.DriverStandings[0].points
}

export async function getHighestPointsAfterRound(year, round){
    const standings = await fetchDriverStandingsAfterRound(year, round);
    return parseFloat(standings[0].points)
}

export async function getDriverPointsOverSeason(year){
    const drivers = await fetchAllDriversFromSeason(year);
    const yearresults = await fetchYearResults(year);
    let response = []
    drivers.forEach((driver) => {
        let currentdriver = {};
        currentdriver["id"] = driver.givenName + " " + driver.familyName;
        currentdriver["values"] = {};
        currentdriver["totalpoints"] = 0;
        response.push(currentdriver)
    })
    yearresults.forEach((race) => {
        let racename = race.raceName;
        race.Results.forEach((result)=>{
            let driverid = result.Driver.givenName + " " + result.Driver.familyName;
            let points = parseFloat(result.points);//result of the current race
            let driver = response.find(driver => driver.id === driverid)
            points += driver["totalpoints"]
            driver["totalpoints"] = points
            driver["values"][racename] = points
        })
    })
    return response;
}

export async function getRaceResults(year, round){
    const results = await fetchRaceResults(year, round);
    let response = {};
    results.Results.forEach((driver) => {
        let drivername = driver.Driver.givenName + " " + driver.Driver.familyName;
        response[drivername] = parseFloat(driver.points)
    })
    return response
}

export async function getDriverStandingsAfterRound(year, round){
    const standings = await fetchDriverStandingsAfterRound(year, round);
    let response = {}
    standings.forEach((driver) =>{
        let drivername = driver.Driver.givenName + " " + driver.Driver.familyName;
        response[drivername] = parseFloat(driver.points)
    })
    return response;
}

export async function getRoundInfo(year, round){
    const roundinfo = await fetchRaceResults(year, round);
    return roundinfo;
}

export async function getSeasonInfo(year){
    const seasoninfo = await fetchDriverStandingsEndOfSeason(year);
    return seasoninfo;
}

export async function getAllDrivers(){
    return await fetchAllDrivers();
}

export async function getDriverInformation(driverId){
    return await fetchDriverInformation(driverId);
}

export async function getAllDriverWins(driverId){
    let wins = await fetchDriverFinishingPositions(driverId,1)
    return parseInt(wins.total);
}

export async function getTotalDriverWDC(driverId){
    const response = await fetchAllDriverWDC(driverId);
    return parseInt(response.total);
}

export async function getDriverWDCYears(driverId){
    const data = await fetchAllDriverWDC(driverId);
    let response = [];
    if(data.SeasonTable.Seasons.length > 0){
        data.SeasonTable.Seasons.forEach(season => {
            response.push(season.season);
        })
    }
    return response;
}

export async function getAllDriverPoles(driverId){
    return await fetchAllDriverPolePositions(driverId);
}

export async function getAllDriverPodiums(driverId){
    const wins = await getAllDriverWins();
    let second = await fetchDriverFinishingPositions(driverId,2);
    let third = await fetchDriverFinishingPositions(driverId,3);
    second = parseInt(second.total);
    third = parseInt(third.total);
    return wins + second + third;
}

export async function getDriverPointsPerSeason(driverId){
    const years = await fetchAllDriverYearsInF1(driverId);
    let response = {};
    for(const year of years){
        let points = await getPointsPerSeason(driverId, year);
        response[year] = points
    }
    return response
}

//helper function for getDriverPointsPerSeason that counts total points
async function getPointsPerSeason(driverId, year){
    const response = await fetchDriverSeasonResults(year, driverId);
    let total = 0
    response.forEach(race => {
        let points = race.Results[0].points;
        total += parseFloat(points)
    })
    return total;
}

async function getWinsPerSeason(driverId, year){
    const response = await fetchDriverSeasonResults(year, driverId);
    let totalwins = 0
    response.forEach(race => {
        if(race.Results[0].position === "1"){
            totalwins++
        }
    })
    return totalwins;
}

export async function getDriverWinsPerSeason(driverId){
    const years = await fetchAllDriverYearsInF1(driverId);
    let response = {};
    for(const year of years){
        let winsperyear = await getWinsPerSeason(driverId,year);
        response[year] = winsperyear
    }
    return response
}

export async function getAllConstructors(){
    return await fetchAllConstructors();
}

export async function getBasicConstructorInfo(constructorId){
    return await fetchBasicConstructorInfo(constructorId);
}

export async function getTotalConstructorChampionships(constructorId){
    const response = await fetchConstructorChampionships(constructorId);
    return response.total;
}

export async function getConstructorChampionships(constructorId){
    const api = await fetchConstructorChampionships(constructorId)
    let response = []
    api.StandingsTable.StandingsLists.forEach(year => {
        response.push(year.season)
    });
    return response;
}

export async function getConstructorYearsInF1(constructorId){
    let api_response = await fetchConstructorYearsInF1(constructorId);
    return api_response.map(year => year.season)
}

export async function getConstructorWinsPerSeason(constructorId){
    let response = {};
    const years = await fetchConstructorYearsInF1(constructorId);
    years.forEach(year => {
        response[year.season] = 0
    });
    const results = await fetchConstructorWinsAllTime(constructorId);
    results.forEach(race => {
        response[race.season] += 1
    });
    return response;
}

export async function getAllDriversForConstructor(constructorId){
    return await fetchAllDriversForConstructor(constructorId);
}
