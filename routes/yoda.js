var express = require('express');
var request = require('request');
var Slack = require('node-slack');

var mashupKey = require('../secrets').keys.yoda.mashup;
var slackKey = require('../secrets').keys.yoda.slack;

var slack = new Slack('screeninteraction', slackKey);
var router = express.Router();

router.post('/', function(req, res) {

  var text = req.body.text.split(' ').join('+');

  var options = {
    url: 'https://yoda.p.mashape.com/yoda?sentence=' + text,
    headers: {
      'User-Agent': 'request',
      "X-Mashape-Key": mashupKey,
      "Accept": "text/plain"
    }
  };

  request(options, function(err, response, html) {
    if (err) return res.send(config.errorMsg);

    // No more integrations available at the moment, need to
    // pay for Slack in order to be able to send JSON
    var reply = slack.respond(req.body, function(hook) {
      return {
        text: response.body,
        username: 'Yoda (' + hook.user_name + ')',
        icon_emoji: 'yoda',
      };
    });

    // res.json(reply);
    res.send(response.body);
  });
});

module.exports = router;
