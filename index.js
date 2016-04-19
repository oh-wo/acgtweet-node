var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');
var session = require('./session.js');
var oauthServer = require('oauth2-server');


start();

function start() {
    var app = express();

    require('./db/init');

    var port = process.env.PORT || 3000;

    // Enable url encoded posts.
    app.use(bodyParser.urlencoded({extended: true}));

    // Parse the JSON body of incoming HTTP requests..
    // app.use(bodyParser.json());


    // Initialize the oAuth sever, passing in our custom model options.
    var oauth = new oauthServer({
        model: require('./oauth/model'),
        grants: ['password', 'refresh_token']
    });

    app.post('/oauth/token', oauth.grant());

    app.get('/secret', oauth.authorise(), function (req, res) {
        // Will require a valid access_token.
        res.send('Secret area');
    });


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