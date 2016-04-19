var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

module.exports = session({
    store: new pgSession({
        // Use global pg-module
        pg: pg,

        // Disable built in functionality to delete sessions as they're not needed.
        pruneSessionInterval: false,

        // Connect using something else than default DATABASE_URL env variable
        conString: require('./db/connectionString'),

        // The name of the table (defaults to singular "session").
        tableName: 'sessions'
    }),

    secret: process.env.COOKIE_SECRET || 'TuGxUeeB4ZGKMmGVzG9AJuFMgEbmP',

    // Attempt to have cookies valid for a year.  Most browser truncate this to ~30 days.
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},

    // Do not save the session if not modified.
    resave: false,

    // Do not create session until something stored.
    saveUninitialized: true
});