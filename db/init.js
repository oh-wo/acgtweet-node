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
        console.log('db already installed.')
    }

    return db;
}