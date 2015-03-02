
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var s = require("underscore.string");

var config = require('../config.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var uppereastURL = 'http://uppereast.kvartersmenyn.se/';
  var scandicURL = 'http://victoriatower.kvartersmenyn.se/';
  var sabisURL = 'http://www.sabis.se/nordic-forum/dagens-lunch-v9/';
  var today = new Date().getDay() - 1;

  async.series([
    function(callback) {
      request(uppereastURL, function(err, response, html) {
        callback(err, html);
      });
    },
    function(callback) {
      request(scandicURL, function(err, response, html) {
        callback(err, html);
      });
    },
    function(callback) {
      request(sabisURL, function(err, response, html) {
        callback(err, html);
      });
    }
  ],
  function(err, results) {
    if (err) return res.send(config.errorMsg);

    var upper = cheerio.load(results[0]);
    var upperMenu = "*Upper East*\n";
    upper('.menyn td > p').first().filter(function() {
      var data = upper(this).text();
      var days = [];
      menu = s(data).words(/Måndag|Tisdag|Onsdag|Torsdag|Fredag/)[0];
      menu = menu
              .split('Caesarsallad med kyckling, skaldjur eller varmrökt lax')
              .join('')
              .split(')');

      menu.forEach(function(el, i) {
        el = el.trim() + ')';
        if (!el) return;
        if (i >= 0 && i >= (today * 3) && i <= (today * 3) + 2) days.push(el);
      });

      upperMenu += days.length ?
        days.join('\n') + '\nCaesarsallad med kyckling, skaldjur eller varmrökt lax' :
        'No lunch today';
    });

    var scandic = cheerio.load(results[1]);
    var scandicMenu = "*Scandic Victoria Tower*";
      scandic('.menyn td').first().filter(function() {
        var data = scandic(this);
        var days = [];
        data.find('p').each(function(i, el) {
          try {
            var string = scandic(this).html().split('<br>').join('\n');
            var cleaned = s(scandic(string).text())
                            .words(/Måndag|Tisdag|Onsdag|Torsdag|Fredag/)
                            .join('');
            days.push(cleaned);
          } catch (err){
            console.log(err);
          }
        });

        if (!days.length) {
          scandicMenu += '\nSomething went wrong, could not get menu';
        } else {

          // Remove first item, which for the time being is "AFFÄRSLUNCH 295:- ..."
          days.shift();
          // Limit to five days
          days.length = 5;

          scandicMenu += days[today] ?
            days[today] :
            '\nNo lunch today';
        }
      });

    var sabis = cheerio.load(results[2]);
    var sabisMenu = "*Nordic Forum (Sabis)*\n";
    sabis('.lunch-data').filter(function() {
      var data = sabis(this).find('.lunch-day-dishes');
      var days = [];
      data.map(function(i, el) {
        var day = [];
        sabis(this).find('li').each(function(i, el) {
          day.push(sabis(this).text());
        });
        days.push(day);
      });

      sabisMenu += days[today] ?
        days[today].join('\n') :
        'No lunch today';
    });

    res.send(upperMenu + '\n\n' + scandicMenu + '\n\n' + sabisMenu + '\n');

  });
});

module.exports = router;
