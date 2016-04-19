var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');
var session = require('./session.js');
var oauthserver = require('oauth2-server');


start();

function start() {
    var app = express();


    require('./db/init');

    var port = process.env.PORT || 3000;
    
    // Configure session storage.
    app.use(session);

    // Enable url encoded posts.
    app.use(bodyParser.urlencoded({ extended: true }));

    // Parse the JSON body of incoming HTTP requests..
    app.use(bodyParser.json());

    // Load the api.
    app.use('/api/v1', require('./api/api.js'));

    // Homepage so we know the server is working.
    app.get('/', function (req, res) {
        res.send('Welcome to ACGTweet');
    });

    var server = app.listen(port, function () {
        var host = server.address().address;
        console.log('ACGTweet listening on http://%s:%s', host, port);
    });
}