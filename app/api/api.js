var express = require('express');
var api = express(); // the sub app

api.use('/token', require('./token'));

api.use('/me', require('./me'));

api.use('/user', require('./user'));

api.use('/sequence', global.oauth.authorise(), require('./sequence'));

module.exports = api;