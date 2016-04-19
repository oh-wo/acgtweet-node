var express = require('express');
var api = express(); // the sub app


api.use('/user', require('./user'));

module.exports = api;