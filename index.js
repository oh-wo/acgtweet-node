var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');
var session = require('./session.js');
var oauthServer = require('oauth2-server');


require('./db/init');

setTimeout(start, 2000);


function start() {
    var app = express();


    var port = process.env.PORT || 3000;

    // Enable url encoded posts.
    app.use(bodyParser.urlencoded({extended: true}));

    // Parse the JSON body of incoming HTTP requests..
    app.use(bodyParser.json());


    // Initialize the oAuth sever, passing in our custom model options.
    var oneYear = 60 * 60 * 24 * 7 * 52;
    global.oauth = new oauthServer({
        model: require('./oauth/model'),
        grants: ['password', 'refresh_token'],
        // Attempt to set to one year.
        accessTokenLifetime: oneYear,
        refreshTokenLifetime: oneYear
    });

    app.post('/oauth/token', oauth.grant());

    app.get('/secret', global.oauth.authorise(), function (req, res) {
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