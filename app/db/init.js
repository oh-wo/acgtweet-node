// @see https://github.com/robconery/massive-js
var massive = require('massive');
var DA = require('deasync');

// Use a global variable to prevent the database connection being initialized more than once.
global.db = global.db || init();
// module.exports = global.db;

module.exports = global.db;

function init() {
    var done = false;

    function wait() {
        DA.loopWhile(function () {
            return !done;
        });
        done = false;
    }

    // Connect synchronously.
    var connectionString = require('./connectionString');
    var db = massive.connectSync({connectionString, scripts: './app/db/scripts'});
    console.log('Connected to database: ' + connectionString);
    if (!db['shared_sequences']) {

        db.install(function (err) {
            console.log('Database installed');
            done = true;
        });

        wait();

        db.preload(function (err) {
            console.log('Database preloaded.')
            done = true;
        });

        wait();

        // Refresh database connection.
        db = massive.connectSync({connectionString, scripts: './app/db/scripts'});

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