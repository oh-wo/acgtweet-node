var express = require('express');
var user = express(); // the sub app

user.get('/', global.oauth.authorise(), function (req, res) {


    db.users.findOne({id: req.user.id}, function (err, user) {
        if (err) {
            res.status(406).send('Could not find that user.')
        } else {
            delete user.password;
            console.log('Found user:', user)
            res.send(user);
        }
    });
});

user.put('/:userId', global.oauth.authorise(), function (req, res) {
    // TODO update user.
    res.send('user ' + req.params.userId + ' updated');
});

user.get('/all', global.oauth.authorise(), function (req, res) {
    console.log('search term:', req.query.search)
    db.users.search({
            columns: ["first_name"],
            term: req.query.search
        },
        function (err, users) {
            if (err) {
                res.status(500).send('Failed to get users.')
            }
            console.log('users', users);
            if (users) {
                users = users.map(user=> {
                    delete user.password;
                    return user;
                })
            }
            res.send(users);
        })
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
        console.log('created new user: ', inserted)
        res.send('user created');
    });
});

module.exports = user;