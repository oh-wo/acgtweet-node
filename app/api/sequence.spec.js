// TODO Consider extending with chai or Expect.js
// expect seems to be very similar to jasmine.
// @see http://webapplog.com/tdd/

var request = require('supertest');


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

    function getSequencesAuthorized() {
        return request(app).get('/api/v1/sequence')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + AUTH_TOKEN);
    }

    describe('GET /sequence', function () {
        it('should require an access token', function (done) {
            request(app).get('/api/v1/sequence').expect(500);
            getSequencesAuthorized().expect(200, done);
        });

        it('should return all sequences for a user', function (done) {

            var expected = [
                // The following are authored by the current user.
                {
                    "author_id": 1,
                    "content": "acgtagtgctagcatgat",
                    "id": 1,
                    "ispublic": true
                },
                {
                    "author_id": 1,
                    "content": "acgtaatgat",
                    "id": 2,
                    "ispublic": false
                },
                {
                    "author_id": 1,
                    "content": "acgtagtgctagcatgat",
                    "id": 3,
                    "ispublic": false
                },
                // The following have been shared with the user.
                {
                    "author_id": 2,
                    "content": "acgtattttttttttaaa",
                    "id": 4,
                    "ispublic": false,
                    "sequenceid": 4,
                    "userid": 1
                }
            ];

            getSequencesAuthorized().expect(200, expected, done);

        })
    });
});
