var express = require('express');

var sequence = express(); // the sub app

/**
 * Get all sequences for this user.
 */
sequence.get('/', function (req, res) {
    console.log('userid', req.user.id)

    // Get sequences this user owns.
    var owned = db.promise(done => db.sequences.find({author_id: req.user.id}, done));

    // Get sequences shared with this user.
    var sharedWithUser = db.promise(done => db.run('select * from sequences,shared_sequences where shared_sequences.userid=$1;', [req.user.id], done));

    Promise.all([owned, sharedWithUser]).then(result => {
        // Combine sequences returned from each promise into a single array.
        var all = [].concat.apply([], result);
        res.send(all);
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