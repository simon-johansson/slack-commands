var express = require('express');
var request = require('request');

var config = require('../config.js');
var apiKey = require('../secrets').keys.trains;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var helenelundSiteID = '9507';
  var url = 'http://api.sl.se/api2/realtimedepartures.json?key=' + apiKey + '&siteid=' + helenelundSiteID;

  request(url, function(err, response, html) {
    if (err) return res.send(config.errorMsg);

    var data = JSON.parse(response.body).ResponseData.Trains;
    var south = '*Southbound*\n'; var north = '\n*Northbound*\n';
    var departures = data.map(function(el, i) {
      var train = el.DisplayTime + ' - ' + el.Destination + '\n';
      if (el.JourneyDirection === 1) south += train;
      else north += train;
    });

    res.send(south + north);

  });
});

module.exports = router;
