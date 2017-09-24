'use strict';
// set up ======================================================================
var MongoClient  = require('mongodb').MongoClient;
var logger       = require('./modules/logger_weather.js');
var save_data = require('./modules/persist_data.js');

// load config ======================================================================
var config = require('./config/config.json');


// Handle errors ======================================================================
process.on('uncaughtException', (err) => {

  var timestamp = new Date();

  // Stop modules
  logger.stop();
  save_data.stop();

  // Log the error
  console.error(err + ' ' + timestamp);
  console.error(err);
  // Kill the process
  process.exit(1);
});

// Global ======================================================================
var dataWeather = [];
var datasaved = false;


//=======================
// Looger Loop
//=======================
setInterval(function () {

    if (datasaved) {
        dataWeather = [];   // clear buffer
        datasaved = false;
    }

    dataWeather = logger.start(dataWeather);

}, config.logger );

//=======================
// Save Loop
//=======================
setInterval(function () {

   datasaved = save_data.save(dataWeather);

}, config.persist );






