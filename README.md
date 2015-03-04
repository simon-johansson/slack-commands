#Customised integrations for [Slack](https://slack.com/)

Collection of slash and Slackbot commands.

##Available commands

| Commands in Slack app           | Description   |
| ------------------------------- |:-------------:|
| ``/lunch``                      | Displays todays menus at Upper East, Nordic Forum and Scandic Victora Tower.                   |
| ``/trains``                     | Displays upcoming train departures from Helenelund.                                            |
| ``/yoda [sentence to Yodafy]``  | Translates users input sentence to Yodaspeak. WIP, should display message to all in chat room. |


##Development

###Installation
```
npm install -g grunt-cli
npm install
```


###Starting local server
```
npm start
```
Site now available on [http://localhost:22666](http://localhost:22666), port can be cahnged in ``config.js``.

##Deployment
Rename ``secrets.json.example`` to ``secrets.json`` and fill it with your secrets.

##Integrate with Slack

##Tests

##License
MIT
