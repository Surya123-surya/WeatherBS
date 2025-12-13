// to convert the first letter of the input to uppercase
function capitalizeFirstLetter(input) {
    let value = input.value;
    if (value.length > 0) {
      input.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
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
   
    document.querySelector("#dateTime").innerText=formattedDate[0];

    document.querySelector('#cityContent').innerText=`${cityName}, ${formattedDate[0]}, ${responseTime}`
}