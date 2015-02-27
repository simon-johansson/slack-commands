var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var s = require("underscore.string");

var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {

  // request(uppereast, function(err, response, html) {
  //   if (err) {
  //     throw new Error(err);
  //   }
  //   var $ = cheerio.load(html);

  //   $('.menyn td > p').first().filter(function() {
  //     var data = $(this);
  //     var menu = data.text();
  //     menu = s(data.text()).words(/MÅNDAG|TISDAG|ONSDAG|TORSDAG|FREDAG/)[0];
  //     menu = menu
  //       .split('Caesarsallad med kyckling, skaldjur eller varmrökt lax')
  //       .join('')
  //       .split(')');

  //     days = [
  //       [],
  //       [],
  //       [],
  //       [],
  //       []
  //     ];

  //     menu.forEach(function(el, i) {
  //       if (!el) return;
  //       if (i <= 2) days[0].push(el + ')');
  //       else if (i > 2 && i <= 5) days[1].push(el + ')');
  //       else if (i > 5 && i <= 8) days[2].push(el + ')');
  //       else if (i > 8 && i <= 11) days[3].push(el + ')');
  //       else if (i > 11) days[4].push(el + ')');
  //     });

  //     console.log(days[new Date().getDay() - 1]);

  //     menu = days[new Date().getDay() - 1] ?
  //       days[new Date().getDay() - 1].join('\n') :
  //       'Ingen lunch idag';

      // res.send('\n' + menu);

  //   });
  // });
// });

module.exports = router;


uppereastURL = 'http://uppereast.kvartersmenyn.se/';
sabisURL = 'http://www.sabis.se/nordic-forum/dagens-lunch-v9/'

async.series([
  function(callback) {
    request(uppereastURL, function(err, response, html) {
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
  if (err) console.log(err);
  var uppereast = cheerio.load(results[0]);
  var sabis = cheerio.load(results[1]);

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
    console.log(days);
  });

});
