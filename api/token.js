var express = require('express');
var oauthServer = require('oauth2-server');
var token = express(); // the sub app

// Initialize the oAuth sever, passing in our custom model options.
var oneYear = 60 * 60 * 24 * 7 * 52;
global.oauth = new oauthServer({
    model: require('../oauth/model'),
    grants: ['password', 'refresh_token'],
    // Attempt to set to one year.
    accessTokenLifetime: oneYear,
    refreshTokenLifetime: oneYear
});

// Login by getting an access token.
token.post('/', oauth.grant());

// TODO Implement the delete method to log out.
token.delete('/', oauth.grant());

module.exports = token;

