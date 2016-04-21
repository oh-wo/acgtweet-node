var express = require('express');
var sequence = express(); // the sub app
var sequenceHelper = require('./sequenceHelper');

/**
 * Get all sequences for this user.
 */
sequence.get('/', function (req, res) {
    // Get sequences shared with this user.
    db.promise(done => db.mineAndTheirs([req.user.id], done))
        .then(all => {
            var organised = all.map(result => {
                return {
                    id: result.id,
                    content: result.content,
                    author_id: result.author_id,
                    ispublic: result.ispublic,
                    sharedBy: {
                        first_name: result.first_name,
                        last_name: result.last_name,
                        email: result.email
                    }
                }
            });
            // Sort parameters are optional.
            if (req.query.sort) {
                organised = sequenceHelper.sort(organised, req.query.sort);
            }
            res.send(organised);
        }).catch(err=> {
        res.status(500).send("Couldn't get that data!")
    })
});

sequence.post('/', function (req, res) {
    db.sequences.insert({content: req.body.content, author_id: req.user.id}, function (err, sequence) {
        if (err) {
            console.log('Error saving sequence, ', err)
            res.status(406).send('There was an error.');
        } else {
            res.send('Saved ok');
        }
    })
});

/**
 * Shares a sequence with a user.
 *
 * For example, to share a sequence of id 5 with user 1,
 *
 * /api/v1/sequence/5/share/1
 *
 */
sequence.post('/:sequenceId/user/:userId', function (req, res) {
    console.log(`sharing sequenceId:${req.params.sequenceId}, userId:${req.params.userId}`)

    // TODO Check sequence.author_id doesnt own the sequence.
    // TODO Check that it's not already shared with them.

    db.shared_sequences.insert({
        sequenceId: req.params.sequenceId,
        userId: req.params.userId
    }, function (err, result) {
        if (!err) {
            res.send('Saved!')
        }
    })
});


module.exports = sequence;