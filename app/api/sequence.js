var express = require('express');
var sequence = express(); // the sub app
var sequenceHelper = require('./sequenceHelper');

/**
 * Get all sequences for this user.
 */
sequence.get('/', function (req, res) {
    console.log('userid', req.user.id)

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
        });
});

sequence.post('/', function (req, res) {
    console.log('body:', req.body)

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
sequence.post('/:sequenceId/share/:userId', function (req, res) {
    db.sequences.find({author_id: req.user.id}, function (err, sequences) {
        console.log('sequences:', sequences)
        res.send(sequences)
    });
});


module.exports = sequence;