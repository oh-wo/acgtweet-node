var express = require('express');
var me = express(); // the sub app

me.get('/', global.oauth.authorise(), function (req, res) {
    db.users.findOne({id: req.user.id}, function (err, user) {
        if (err) {
            res.status(406).send('Could not find you.')
        } else {
            delete user.password;
            console.log('got user', user)
            res.send(user);
        }
    });
});

module.exports = me;
