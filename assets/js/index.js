// to convert the first letter of the input to uppercase
function capitalizeFirstLetter(input) {
    let value = input.value;
    if (value.length > 0) {
      input.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  }
// to display input value on pressing enter
document.getElementById("searchInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        fetchData();
    }
});

function changeBackground(condition,temp){
    let bodyElement = document.getElementById("Weatherbody");
    let backgroundImage = "";
    if(temp<10){
        const snowImages = [
              "url(./assets/images/snow.jpg)",
              "url(./assets/images/snow2.jpg)",
              "url(./assets/images/snow3.jpg)",
              "url(./assets/images/snow4.jpg)",
              "url(./assets/images/snow5.jpg)",
              "url(./assets/images/snow6.jpg)",
              "url(./assets/images/snow7.jpg)",
            ];
            backgroundImage = snowImages[Math.floor(Math.random() * snowImages.length)];
        bodyElement.style.backgroundImage = backgroundImage;
        return;
    }
    switch(condition){
        case "Clear":
           const clearImages = [
              "url(./assets/images/Clearsky_Day.jpg)",
              "url(./assets/images/clear2.jpg)",
              "url(./assets/images/clear3.jpg)",
              "url(./assets/images/clear4.jpg)",
              "url(./assets/images/clear5.jpg)",
            ];
            backgroundImage = clearImages[Math.floor(Math.random() * clearImages.length)];
            break;
        case "Clouds":
            const cloudImages = [
              "url(./assets/images/Cloud_day.jpg)",
              "url(./assets/images/cloud2.jpg)",
              "url(./assets/images/cloud3.jpg)",
              "url(./assets/images/cloud4.jpg)",
              "url(./assets/images/cloud5.jpg)",
              "url(./assets/images/cloud6.jpg)",
              "url(./assets/images/cloud7.jpg)",
            ];
            backgroundImage = cloudImages[Math.floor(Math.random() * cloudImages.length)];
            break;
        case "Rain":
        case "Drizzle":
            const rainImages = [
              "url(./assets/images/rain.jpg)",
              "url(./assets/images/rain2.jpg)",
              "url(./assets/images/rain3.jpg)",
              "url(./assets/images/rain4.jpg)"
            ];
            backgroundImage = rainImages[Math.floor(Math.random() * rainImages.length)];
            break;
        case "Thunderstorm":
            backgroundImage = "url(./assets/images/ThunderAtNight.jpg)";
            break;  
        case "Snow":
            backgroundImage = "url(./assets/images/Cold+winter_nyt.jpg)";
            break;  
        case "Mist":
        case "Fog":
            backgroundImage = "url(./assets/images/Foggy_Day.jpg)";
            break;
        default:
            backgroundImage = "url(./assets/images/Default_Day.jpg)";
    }
    bodyElement.style.backgroundImage = backgroundImage;
}
function nextDate(curts) {
  const d = curts+86400; // add 86400 seconds (1 day)
  return d;
}
function next3Hours(curts) {
  const d = curts+10800; // add 10800 seconds (3 hours)
  return d;
}
//forecasted data for next 5 days
function nextDateForecast(date, month, year) {
    // month is 0-based (Jan = 0)
    let d = new Date(year, month-1, date);
    // add one day
    d.setDate(d.getDate() + 1);

    let timestamp = Math.floor(d.getTime() / 1000);
    // console.log(timestamp);
    return timestamp;
}


  //fetching data
  async function fetchData(){
   let cityName=document.querySelector(".searchInput").value;
   console.log(cityName)
   let fetchedData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=be7e823e3e8bc54ee185434db33dc3cb`);
   let formattedData = await fetchedData.json();
   //temp section
    let responseCityTemp=(formattedData.list[0].main.temp-273.15 ).toFixed(2);
    let responseFeelsLike=(formattedData.list[0].main.feels_like-273.15 ).toFixed(2);
    let responseCityHighTemp=(formattedData.list[0].main.temp_max-273.15).toFixed(2) ;
    let responseCityLowTemp=(formattedData.list[0].main.temp_min-273.15 ).toFixed(2);
    document.getElementById('cityTemp').innerText=responseCityTemp;
    document.querySelector('#cityTemp2').innerText=responseCityTemp;
    document.querySelector('#feelsLike').innerText=responseFeelsLike;
    document.querySelector('#cityHighTemp').innerText=responseCityHighTemp;
    document.querySelector('#cityLowTemp').innerText=responseCityLowTemp;

    //rain section
    if(formattedData.list[0].pop==0 && formattedData.list[0].main.rain == undefined){
        document.querySelector("#popRain").innerText=0;
        document.querySelector("#mm").innerText=0;

    }
    else if(formattedData.list[0].main.rain == undefined){
      document.querySelector("#mm").innerText=0;
      let responsePop=(formattedData.list[0].pop)*100;
      document.querySelector("#popRain").innerText=responsePop;
    }
    else{
        let responsePop=(formattedData.list[0].pop)*100;
        let response3h=formattedData.list[0].rain['3h'];
        document.querySelector("#popRain").innerText=responsePop;
        document.querySelector("#mm").innerText=response3h;
    }
    

    // climate description
    let responseMain= formattedData.list[0].weather[0].main;
    let responseIconCode= formattedData.list[0].weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${responseIconCode}@2x.png`;

    let imgElement = document.createElement("img");
    imgElement.src = iconUrl;
    imgElement.alt = "Weather icon";
    
    let responseDescription = formattedData.list[0].weather[0].description;
    document.querySelector("#condition").innerText = responseMain;
    document.querySelector("#description").innerText = responseDescription;

    document.getElementById("condition").appendChild(imgElement);

    //wind description
    let responseWindSpeed=formattedData.list[0].wind.speed;
    let responseWindDeg=formattedData.list[0].wind.deg;
    let responseWindGust=formattedData.list[0].wind.gust;
    document.querySelector("#windspeed").innerText=responseWindSpeed;
    document.querySelector("#windgust").innerText=responseWindGust;
    let arrow=document.querySelector("#directionArrow")
    arrow.style.transform=`rotate(${responseWindDeg+180}deg)`;
    arrow.style.transition = 'transform 0.5s ease';

    //date and time
    let responsedateTime=formattedData.list[0].dt_txt;
    let formattedDate=responsedateTime.split(" ");
    let responseTime=formattedDate[1];
   
    const [year, month, day] = formattedDate[0].split("-");
    document.querySelector("#dateTime").innerText = `${day}/${month}/${year}`;

    document.querySelector('#cityContent').innerText=`${cityName}, ${formattedDate[0]}`
    
    //change background
    changeBackground(responseMain,responseCityTemp);

    //forecast section
    // let nextDatets=nextDate(formattedData.list[0].dt);
    // console.log(nextDatets);
    // let forecastData=formattedData.list.filter(item => item.dt == nextDatets);
    // console.log(forecastData);
    // console.log(nextDatets);
    // for next day forecast
  // console.log(forecastData[0].main.temp)
  for(let i=0;i<5;i++){
    let nextDatets=nextDate(formattedData.list[0].dt+(i-1)*86400);
    let forecastData=formattedData.list.filter(item => item.dt == nextDatets);
    // console.log(forecastData);
    let responsedatetime=forecastData[0].dt_txt;
    let forecastDate=responsedatetime.split(" ");   
    const [year, month, day] = forecastDate[0].split("-");
    console.log(`${day}/${month}/${year}`);
    //min and max temp
    let forecastCurTemp=(forecastData[0].main.temp-273.15).toFixed(2);
    let forecastMaxTemp=(forecastData[0].main.temp_max-273.15).toFixed(2);
    let forecastMinTemp=(forecastData[0].main.temp_min-273.15).toFixed(2);
    let responseIconCode= forecastData[0].weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${responseIconCode}@2x.png`;
    switch(i){
        case 0:
          let imgElement0 = document.querySelector("#todayIcon");
          imgElement0.src = iconUrl;
          imgElement0.alt = "Weather icon";
            document.querySelector("#date1").innerText = `${day}/${month}/${year}`;
            document.querySelector("#todayAvg").innerText = forecastCurTemp;
            document.querySelector("#todayHigh").innerText = forecastMaxTemp;
            document.querySelector("#todayLow").innerText = forecastMinTemp;
            break;
        case 1:
          let imgElement1 = document.querySelector("#day2Icon");
          imgElement1.src = iconUrl;
          imgElement1.alt = "Weather icon";
            document.querySelector("#date2").innerText = `${day}/${month}/${year}`;
            document.querySelector("#day2Avg").innerText = forecastCurTemp;
            document.querySelector("#day2High").innerText = forecastMaxTemp;
            document.querySelector("#day2Low").innerText = forecastMinTemp;
            break;
        case 2:
          let imgElement2 = document.querySelector("#day3Icon");
          imgElement2.src = iconUrl;
          imgElement2.alt = "Weather icon";
            document.querySelector("#date3").innerText = `${day}/${month}/${year}`;
            document.querySelector("#day3Avg").innerText = forecastCurTemp;
            document.querySelector("#day3High").innerText = forecastMaxTemp;
            document.querySelector("#day3Low").innerText = forecastMinTemp;
            break;    
        case 3:
          let imgElement3 = document.querySelector("#day4Icon");
          imgElement3.src = iconUrl;
          imgElement3.alt = "Weather icon";
            document.querySelector("#date4").innerText = `${day}/${month}/${year}`; 
            document.querySelector("#day4Avg").innerText = forecastCurTemp;
            document.querySelector("#day4High").innerText = forecastMaxTemp;
            document.querySelector("#day4Low").innerText = forecastMinTemp;
            break;  
        case 4:
          let imgElement4 = document.querySelector("#day5Icon");
          imgElement4.src = iconUrl;
          imgElement4.alt = "Weather icon";
            document.querySelector("#date5").innerText = `${day}/${month}/${year}`;
            document.querySelector("#day5Avg").innerText = forecastCurTemp;
            document.querySelector("#day5High").innerText = forecastMaxTemp;
            document.querySelector("#day5Low").innerText = forecastMinTemp;
            break;
    }
  }
  for(let i=0;i<5;i++){
    let nextDatets=next3Hours(formattedData.list[0].dt+(i)*10800);
    let forecastData=formattedData.list.filter(item => item.dt == nextDatets);
    console.log(forecastData);
    // console.log(forecastData);
    // let responsedatetime=forecastData[0].dt_txt;
    // let forecastDate=responsedatetime.split(" ");   
    // const [year, month, day] = forecastDate[0].split("-");
    // console.log(`${day}/${month}/${year}`);
    //min and max temp
    let forecastCurTemp=(forecastData[0].main.temp-273.15).toFixed(2);
    let forecastMaxTemp=(forecastData[0].main.temp_max-273.15).toFixed(2);
    let forecastMinTemp=(forecastData[0].main.temp_min-273.15).toFixed(2);
    let responseIconCode= forecastData[0].weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${responseIconCode}@2x.png`;
    switch(i){
        case 0:
          let imgElement0 = document.querySelector("#nowIcon");
          imgElement0.src = iconUrl;
          imgElement0.alt = "Weather icon";
          // document.querySelector("#date1").innerText = `${day}/${month}/${year}`;
          document.querySelector("#nowAvg").innerText = forecastCurTemp;
          document.querySelector("#nowHigh").innerText = forecastMaxTemp;
            document.querySelector("#nowLow").innerText = forecastMinTemp;
            break;
        case 1:
          let imgElement1 = document.querySelector("#nxt3hoursIcon");
          imgElement1.src = iconUrl;
          imgElement1.alt = "Weather icon";
            // document.querySelector("#date2").innerText = `${day}/${month}/${year}`;
            document.querySelector("#nxt3hoursAvg").innerText = forecastCurTemp;
            document.querySelector("#nxt3hoursHigh").innerText = forecastMaxTemp;
            document.querySelector("#nxt3hoursLow").innerText = forecastMinTemp;
            break;
        case 2:
          let imgElement2 = document.querySelector("#nxt6hoursIcon");
          imgElement2.src = iconUrl;
          imgElement2.alt = "Weather icon";
            // document.querySelector("#date3").innerText = `${day}/${month}/${year}`;
            document.querySelector("#nxt6hoursAvg").innerText = forecastCurTemp;
            document.querySelector("#nxt6hoursHigh").innerText = forecastMaxTemp;
            document.querySelector("#nxt6hoursLow").innerText = forecastMinTemp;
            break;    
        case 3:
          let imgElement3 = document.querySelector("#nxt9hoursIcon");
          imgElement3.src = iconUrl;
          imgElement3.alt = "Weather icon";
            // document.querySelector("#date4").innerText = `${day}/${month}/${year}`; 
            document.querySelector("#nxt9hoursAvg").innerText = forecastCurTemp;
            document.querySelector("#nxt9hoursHigh").innerText = forecastMaxTemp;
            document.querySelector("#nxt9hoursLow").innerText = forecastMinTemp;
            break;  
        case 4:
          let imgElement4 = document.querySelector("#nxt12hoursIcon");
          imgElement4.src = iconUrl;
          imgElement4.alt = "Weather icon";
            // document.querySelector("#date5").innerText = `${day}/${month}/${year}`;
            document.querySelector("#nxt12hoursAvg").innerText = forecastCurTemp;
            document.querySelector("#nxt12hoursHigh").innerText = forecastMaxTemp;
            document.querySelector("#nxt12hoursLow").innerText = forecastMinTemp;
            break;
    }
  }
  
  }
