var expect = require('expect.js');
var request = require('supertest');
require('../db/init');

describe('/api/v1/sequence', function () {
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
            done();
        });
    }

    before(done => {
        login(done);
    });

    function getAuthorized(path) {
        return request(app).get(path)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + AUTH_TOKEN);
    }

    describe('GET /sequence', function () {
        it('should require an access token', function (done) {
            request(app).get('/api/v1/sequence').expect(500);
            getAuthorized('/api/v1/sequence').expect(200, done);
        });

        it('should return all sequences for a user', function (done) {

            var expectations = [4, 3, 2, 1];

            getAuthorized('/api/v1/sequence')
                .expect(function (req, res) {
                    expectations.forEach((expected, index) => {
                        expect(req.body[index].id).to.equal(expected);
                    })
                })
                .expect(200, done);

        });

        it('should be sortable by text content', function (done) {

            function bodyToBeSorted(req, res) {
                var expectations = [
                    "acgtaatgat",
                    "acgtagtgctagcatgat",
                    "acgtagtgctagcatgat",
                    "acgtattttttttttaaa"];
                expectations.forEach(function (expected, index) {
                    expect(req.body[index].content).to.equal(expected);
                })
            }

            getAuthorized('/api/v1/sequence?sort=content')
                .expect(bodyToBeSorted)
                .expect(200, done)
        });


    });
});
