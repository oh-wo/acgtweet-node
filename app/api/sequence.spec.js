// TODO Consider extending with chai or Expect.js
// expect seems to be very similar to jasmine.
// @see http://webapplog.com/tdd/

var request = require('supertest');

describe('/api/v1/sequence', function () {
    var app;
    var db;

    // NB: Calling `request(URL)` can be used to test a remote URL, for platform tests.
    // Here we test the app directly so that the tests will run on a remote server we don't know the address or port of.
    var app = require('../../index');

    beforeEach(function () {

        // Connect to the database.
        // TODO Specify a test database?
        db = require('../db/init');

    });

    describe('GET /sequence', function () {
        it('should require an access token', function (done) {
            request(app).get('/api/v1/sequence').expect(500, done)
        });

        it('should return all sequences for a user',function(done){

            done();
        })
    });
});
