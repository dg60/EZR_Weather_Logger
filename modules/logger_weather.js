'use strict';

// set up ======================================================================
var http = require('http');
//==============================================================================
var output = "";
var _data = {};


module.exports = {
    start: function (data) {
        console.info('Logger run');

        //Data from heatarea
        var _dataWeather = {
            id:"weather",
            created: new Date(),
            offset: new Date().getTimezoneOffset(),
            temp: 0,
            pressure: 0,
            humidity: 0,
            wind_speed: 0.0,
            wind_deg: 0.0,
            weather_main : "",
            weather_description: ""
        };


        //Get the data from the controller
        http.get({
            hostname: 'api.openweathermap.org',
            port: 80,
            path: '/data/2.5/weather?q=Waldneukirchen,at&units=metric&APPID=152c41c954206ebded01a221e2ec1de5',
            headers: { 'Cache-Control': 'no-cache' },
            agent: false  
        }, (res) => {

            res.on('data', function (chunk) {
                output += chunk;
                
            });

            res.on('end', function () {
        
                let timestamp = new Date();

                try{
                    _data = JSON.parse(output);
                }catch (e){
                    console.error('Incorrect Data: ' + output);
                    console.error( e  + " " + timestamp);
                    
                }
                

                try{
                        // Main data
                        _dataWeather.temp = _data.main.temp;
                        _dataWeather.pressure = _data.main.pressure;
                        _dataWeather.humidity = _data.main.humidity;
                        _dataWeather.weather_main = _data.weather[0].main;
                        _dataWeather.weather_description = _data.weather[0].description;
                        //wind data
                        _dataWeather.wind_speed = _data.wind.speed;
                        _dataWeather.wind_deg = _data.wind.deg;
        
                        // Debug
                        console.log('Temp: ' + _dataWeather.temp);
                        console.log('Pressure: ' + _dataWeather.pressure);
                        console.log('Humidity: ' + _dataWeather.humidity);
                        console.log('Weather Main: ' + _dataWeather.weather_main);
                        console.log('Weather Description: ' + _dataWeather.weather_description);
                        console.log('Wind speed: ' + _dataWeather.wind_speed);
                        console.log('Wind deg: ' + _dataWeather.wind_deg);
                        console.log('Timestamp: ' + _dataWeather.created);
        
                        // Init
                        output = '';
                }catch (e){
                    console.error(timestamp + ' ' + 'Error _data Object:' + _data.main);
                    console.error( e  + " " + timestamp);
                    // Init
                    output = '';
                }
                    

                
            });
        });

        // Save the data
        data.push(_dataWeather);
        return data;

    },
    stop: function () {

    }
};