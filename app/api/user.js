var express = require('express');
var userHelper = require('./userHelper');
var user = express(); // the sub app

/**
 * Search for a user.
 */
user.get('/', global.oauth.authorise(), function (req, res) {
    var query = {
        columns: ["first_name"],
        term: req.query.search
    };
    // Only search for users if there is a search term.
    if (query.term) {
        userHelper.search(query)
            .then(users=> res.send(users))
            .catch(err => {
                console.log('error', err)
                res.status(406).send("Couldn't find that user")
            })
    } else {
        // TODO This isn't currently called.
        db.promise(db.users.find(users=> {
            res.send(users)
        }));
    }
});

/**
 * Update an existing user.
 */
user.put('/:userId', global.oauth.authorise(), function (req, res) {
    // TODO update user.
    res.send('user ' + req.params.userId + ' updated');
});

/**
 * Create a new user.
 */
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