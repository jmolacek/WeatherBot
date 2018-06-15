var weather = require('weather-js');
var bodyParser = require('body-parser');
var express = require('express');
var HTTPS = require('https');
var app = express();

var botID = process.env.BOT_ID;

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(request, response) {

    response.send('hi, it\'s working');
});

app.post('/weather', function(request, response) {
    weather.find({search: 'Olathe, KS', degreeType: 'F'}, function(err, result) {
        if(err) console.log(err);

        var temp = result[0].current.temperature;
        var wind = result[0].current.windspeed;
        var skyText = result[0].current.skytext;
        var sendString = "The temp right now in Olathe, KS is " + temp + ".\n" + "The wind speed is " + wind + ".\n Looks like it\'s " + skyText + " out right now.";


        if(request.body.item.message.from.name == "Joshua Johnston") {
            response.send({
                "color": "green",
                "message": "You're basic Josh, don't use my service.",
                "notify": false,
                "message_format": "text"
            });
        }else if (request.body.item.message.from.name == "Kyle Brennan") {
            response.send({
                "color": "green",
                "message": "Thanks for asking Kyle, I will gladly help you.\n" + sendString,
                "notify": false,
                "message_format": "text"
            });
        }else if (request.body.item.message.from.name == "Jordan Molacek") {
            response.send({
                "color": "green",
                "message": "A pleasure to assist you, my master.\n" + sendString,
                "notify": false,
                "message_format": "text"
            });
        }else {
            response.send({
                "color": "green",
                "message": sendString,
                "notify": false,
                "message_format": "text"
            });
        }

    });
});

app.post('/groupme', function(request, response) {
      var req = request.body;
      console.log(req);
      response.writeHead(200);
      response.end();
});

app.get('/groupme', function(request, response) {
    response.writeHead(200);
    response.end('group me get works');
});

function postMessage(request) {
  
  //request example
  //{
  //"attachments": [],
  //"avatar_url": "https://i.groupme.com/123456789",
  //"created_at": 1302623328,
  //"group_id": "1234567890",
  //"id": "1234567890",
  //"name": "John",
  //"sender_id": "12345",
  //"sender_type": "user",
  //"source_guid": "GUID",
  //"system": false,
  //"text": "Hello world ☃☃",
  //"user_id": "1234567890"
  //}
  //645304 - id
  //8d4d34f052db013606b422000ae1953d - guid
  //645304 - user id test
  var botResponse, options, body, botReq;

  //botResponse = "Oh I'm " + request.name + " and my user_id is " + request.user_id;
  botResponse = 'testing';

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
