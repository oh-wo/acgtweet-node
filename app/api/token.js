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


/**
 * Handle errors.
 */
token.use(function logErrors(err, req, res, next) {
    console.error('error handled:', err.stack);
    next(err);
});

token.post('/', oauth.grant());

token.delete('/', () => {
    // db.oauth_tokens.destroy({})
});

// token.use(function (err, req, res, next) {
//     // Pass on to the next handler if exists.
//     if (!err) return next();
//     res.status(err.code).send(err.message);
// });

module.exports = token;

