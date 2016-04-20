// @see https://github.com/robconery/massive-js
var massive = require('massive');

// Use a global variable to prevent the database connection being initialized more than once.
global.db = global.db || init();
module.exports = global.db;

function init() {
    // Connect synchronously.
    var db = massive.connectSync({connectionString: require('./connectionString')});
    console.log('Connected to database.');

    if (!db['shared_sequences']) {
        console.log('Installing database.')
        // Call install.sql.
        db.install(function (err, db) {
            if (err) {
                console.log('error: ', err)
            } else {
                console.log('Database installed.')
            }
        });
    } else {
        console.log('Database already installed.')
    }

    /**
     * Allows db queries to run as promises.
     *
     * All errors (e.g. query, database) are ignored because they are in a promise.  Use the second .then() parameter or
     * .catch() to handle them.
     *
     * The author of Massive JS will not support promises.
     * @see https://github.com/robconery/massive-js/issues/142
     *
     * @param query {Function} A function to run the query on `db`.  It is passed single parameter `done` which must be
     *                          passed to Massive JS as the result handler.  See usages for examples.
     * @returns {Promise}      A promise that only resolves with the result object if Massive returns a result.
     */
    db.promise = function (query) {
        return new Promise((resolve, reject) => {
            query((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    return db;
}