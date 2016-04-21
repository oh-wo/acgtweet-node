var express = require('express');
// var path = require('path');
var bodyParser = require('body-parser');

// Wait for the database to get installed and then start the app.
require('./app/db/init')(_db => {
    // Refresh database object.
    global.db = _db;
    start();
});

var app;
function start() {
    console.log('starting app');
    app = express();

    var port = process.env.PORT || 3000;

    // Enable url encoded posts.
    app.use(bodyParser.urlencoded({extended: true}));

    // Parse the JSON body of incoming HTTP requests..
    app.use(bodyParser.json());

    // Load the api.
    app.use('/api/v1', require('./app/api/api.js'));

    // Homepage so we know the server is working.
    app.get('/', function (req, res) {
        res.send('Welcome to ACGTweet');
    });

    var server = app.listen(port, function () {
        var host = server.address().address;
        console.log('ACGTweet listening on http://%s:%s', host, port);
    });
}

module.exports = app;