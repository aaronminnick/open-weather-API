import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

$(document).ready(function() {
  $('#weatherLocation').click(function() {
    const city = $('#location').val();
    const zip = $('#zip').val();
    $('#location').val("");
    $('#zip').val("");
    
    let request = new XMLHttpRequest();
    let maprequest = new XMLHttpRequest();
    const zoom = 3;
    let xTile = 0;
    let yTile = 0;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&zip=${zip}&appid=${process.env.API_KEY}`;
    let mapurl = "";
    
    request.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
        xTile = lon2tile(response.coord.lon, zoom);
        yTile = lat2tile(response.coord.lat, zoom);
        mapurl = `https://tile.openweathermap.org/map/precipitation_new/${zoom}/${xTile}/${yTile}.png?appid=${process.env.API_KEY}`;
        maprequest.open("GET", mapurl, true);
        maprequest.send();
      }
    };

    maprequest.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        // const mapJson = JSON.parse(this.responseText);
        console.log(this);
        // imageUrl = URL.createObjectURL(this.response);
        // mapJson.split();
        $("#map").prop("src", this.response);
      }
    };
    
    request.open("GET", url, true);
    request.send();
    
    function getElements(response) {
      $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
      $('.showTemp').text(`The temperature in Farenheit is ${kToF(response.main.temp)} degrees.`);
      $('.showDescription').text(`The weather is ${response.weather[0].description}.`);
      $('.showSpeed').text(`The wind speed is ${response.wind.speed} meters per second.`);
    }
  });
});

function lon2tile(lon,zoom) { 
  return (Math.floor((lon+180)/360*Math.pow(2,zoom))); 
}
function lat2tile(lat,zoom) { 
  return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); 
}

function kToF(k) {
  return Math.floor((k - 273.15) * (9/5) + 32);
}

//`http://api.openweathermap.org/data/2.5/weather?q=${city}&zip=${zip}&appid=${process.env.API_KEY}`