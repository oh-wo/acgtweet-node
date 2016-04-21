var expect = require('expect.js');
var request = require('supertest');


describe('/api/v1/users', function () {
    // NB: Calling `request(URL)` can be used to test a remote URL, for platform tests.
    // Here we test the app directly so that the tests will run on a remote server we don't know the address or port of.
    var app = require('../../index');
    var AUTH_TOKEN = 'f379e7a023616300b75552626dbd171b7db7438f';


    function login(done) {
        var oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
        db.oauth_tokens.save({
            access_token: AUTH_TOKEN,
            access_token_expires_on: oneHourFromNow,
            client_id: 'xxxxx',
            refresh_token: '1495d561ea31a7caba8db96971e0993bbb970e37',
            refresh_token_expires_on: oneHourFromNow,
            user_id: 1
        }, function (error, result) {
            console.log('err:', error)
            done();
        });
    }

    before(done => {
        require('../db/init')(_db => {
            // Refresh database object.
            db = _db;
            login(done);
        });
    });

    function getAuthorized(path) {
        return request(app).get(path)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + AUTH_TOKEN);
    }

    describe('/all', function () {

        it('should return a list of all the current users', function (done) {
            function correctData(req, res) {
                var expectations = [
                    "owen@biomatters.com",
                    "bob@biomatters.com"];
                expectations.forEach(function (expected, index) {
                    console.log('expected', expected);
                    expect(req.body[index].first_name).to.equal(expected);
                })
            }

            getAuthorized('/api/v1/users/all')
                .expect(correctData)
                .expect(200, done);
        })
    })
});