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
        })
        .catch(err=> {
            console.log('Error getting sequences for user:')
            console.log(err);
            res.status(500).send("Couldn't get that data!")
        })
});

/**
 * Create a new sequence.
 */
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
 * Get all users who have been shared this sequence.
 *
 * @param sequenceId {Number} Sequence id.
 * @returns users {Array} Users who have been shared this sequence.
 *                        These users will see the sequence in their sequences list.
 */
sequence.get('/:sequenceId/share/', function (req, res) {
    db.promise(done => db.getUsersSharedWithSequence(req.params.sequenceId, done))
        .then(users => res.send(users.map(function (user) {
            delete user.password;
            return user;
        })))
        .catch(error => res.status(500).send('Failed to get users for that sequence.'))
});

/**
 * Shares a sequence with a user.
 *
 * For example, to share a sequence of id 5 with user 1,
 * /api/v1/sequence/5/share/1
 *
 */
sequence.post('/:sequenceId/share/:userId', function (req, res) {
    console.log(`sharing sequenceId:${req.params.sequenceId}, userId:${req.params.userId}`)
    var errorMessage = false;

    // Prevent users from sharing sequences with themselves.
    if (req.user.id == req.params.userId) {
        res.status(406).send('Can not share with yourself.');
        return;
    }

    // Prevent users from sharing sequences with the sequence's author.
    var ownsPromise =
        db.promise(done=>db.sequences.findOne({id: req.params.sequenceId}, done))
            .then(sequence=> {
                if (sequence.author_id == req.params.userId) {
                    errorMessage = "That user is the owner. Can't share with someone already owning it.";
                }
            })
            .catch(()=>errorMessage = "Sequence not found.");

    // Shared_sequences values, used to check there is no existing record first,
    // and then to insert afterwards if no existing record exists.
    var data = {
        sequenceid: req.params.sequenceId,
        userid: req.params.userId
    };

    // Prevent users from sharing sequences with someone the sequence is already shared with.
    var alreadyShared =
        db.promise(done=>db.shared_sequences.findOne(data, done))
            .then(found => {
                if (found) {
                    errorMessage = "Already shared with that user."
                }
            })
            .catch(error => errorMessage = error);

    // Share the sequence if all is ok.
    Promise.all([alreadyShared, ownsPromise])
        .then(() => {
            console.log('errorMessage', errorMessage)
            if (errorMessage) {
                console.log('there was an error');
                res.status(406).send(errorMessage);
            } else {
                db.promise(done => db.shared_sequences.insert(data, done))
                    .then(() => res.send('Successfully shared.'))
                    .catch(() => res.status(406).send('Failed to share.'));
            }
        })
});

module.exports = sequence;