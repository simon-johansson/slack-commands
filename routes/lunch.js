
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var s = require("underscore.string");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

  var uppereastURL = 'http://uppereast.kvartersmenyn.se/';
  var sabisURL = 'http://www.sabis.se/nordic-forum/dagens-lunch-v9/';
  var today = new Date().getDay() - 1;

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

    var sabis = cheerio.load(results[1]);
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

    var upper = cheerio.load(results[0]);
    var upperMenu = "*Upper East*\n";
    upper('.menyn td > p').first().filter(function() {
      var menu = upper(this).text();
      var days = [ [], [], [], [], [] ];
      menu = s(menu).words(/MÅNDAG|TISDAG|ONSDAG|TORSDAG|FREDAG/)[0];
      menu = menu
              .split('Caesarsallad med kyckling, skaldjur eller varmrökt lax')
              .join('')
              .split(')');

      menu.forEach(function(el, i) {
        el = el.trim();
        if (!el) return;
        if (i <= 2) days[0].push(el + ')');
        else if (i > 2 && i <= 5) days[1].push(el + ')');
        else if (i > 5 && i <= 8) days[2].push(el + ')');
        else if (i > 8 && i <= 11) days[3].push(el + ')');
        else if (i > 11) days[4].push(el + ')');
      });

      upperMenu += days[today] ?
        days[today].join('\n') + '\nCaesarsallad med kyckling, skaldjur eller varmrökt lax' :
        'No lunch today';
    });

    res
      .header("Content-Type", "application/json; charset=utf-8")
      .send(upperMenu + '\n\n' + sabisMenu + '\n');

  });
});

module.exports = router;
