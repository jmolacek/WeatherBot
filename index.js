var weather = require('weather-js');

var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.all('/weather', function(request, response) {
    weather.find({search: 'Olathe, KS', degreeType: 'F'}, function(err, result) {
        if(err) console.log(err);

        var temp = result[0].current.temperature;
        var wind = result[0].current.windspeed;
        var skyText = result[0].current.skytext;
        var sendString = "The temp right now in Olathe, KS is " + temp + ".\n" + "The wind speed is " + wind + ".\n Looks like its " + skyText + " out right now.";

        response.send({
            "color": "green",
            "message": sendString,
            "notify": false,
            "message_format": "text"
        });
    });
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
