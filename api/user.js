var express = require('express');
var user = express(); // the sub app

user.get('/:userId/', global.oauth.authorise(), function (req, res) {

    console.log(req)

    // TODO return user.
    res.send('User id: ' + req.params.userId);
});

user.put('/:userId', global.oauth.authorise(), function (req, res) {
    // TODO update user.
    res.send('user ' + req.params.userId + ' updated');
});

user.post('/', function (req, res) {
    if (!req.body) {
        return res.status(500).send('No data received.');
    }
    if (!req.body.email) {
        return res.status(500).send('Please give a valid email address.');
    }
    if (!req.body.password) {
        return res.status(500).send('Please give a valid email address.');
    }

    db.users.save({email: req.body.email, password: req.body.password}, function (err, inserted) {
        //the new record with the ID
        console.log('created: ', inserted)
    });

    // TODO Create user.
    res.send('user created');

});

module.exports = user;