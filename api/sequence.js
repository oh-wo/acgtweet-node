var express = require('express');

var sequence = express(); // the sub app

/**
 * Get all sequences for this user.
 */
sequence.get('/', function (req, res) {
    console.log('userid', req.user.id)
    var all = [];
    db.sequences.find({author_id: req.user.id}, function (err, owned) {
        console.log('owned:', owned)
        if (owned) {
            all = all.concat(owned);
        }

        db.run('select * from sequences,shared_sequences where shared_sequences.userid=$1;', [req.user.id], function (err, shared) {
            console.log('shared', shared)
            if (shared) {
                all = all.concat(shared);
            }
            res.send(all)
        });
    });

});

/**
 * Shares a sequence with the given id
 */
sequence.post('/:sequenceId/share', function (req, res) {
    db.sequences.find({author_id: req.user.id}, function (err, sequences) {
        console.log('sequences:', sequences)
        res.send(sequences)
    });
});


module.exports = sequence;