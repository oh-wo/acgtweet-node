// Implementation of required oauth2 methods.
// @see https://github.com/oauthjs/node-oauth2-server/wiki/Model-specification

module.exports = {
    /*
     * Get access token.
     * @param bearerToken {String} is an access token, could also be refresh perhaps??
     */
    getAccessToken: function (bearerToken, done) {

        db.oauth_tokens.findOne({access_token: bearerToken}, function (err, oauthToken) {
            console.log('found oauth:', oauthToken);

            oauthToken.expires = oauthToken.access_token_expires_on;

            done(err, oauthToken)
        });
    },

    /**
     * Get client.
     */
    getClient: function (clientId, clientSecret, done) {
        // TODO Save client id and secrets to the database. For now any id / secret over 3 characters will work.

        done(false, {clientId: clientId, clientSecret: clientSecret});
    },

    /**
     * Get refresh token.
     */
    getRefreshToken: function (bearerToken) {
        console.log('getRefreshToken called')
        // TODO Implement.
        return 50
    },

    /*
     * Get user.
     */
    getUser: function (email, password, done) {
        db.users.findOne({email: email, password: password}, done);
    },

    /**
     * Save token.
     */
    saveAccessToken: function (accessToken, clientId, expires, user, done) {
        console.log('saveAccessToken called', accessToken, clientId, expires, user);
        db.oauth_tokens.insert({
            access_token: accessToken,
            access_token_expires_on: expires,
            client_id: clientId,
            user_id: user.id
        }, function (err, res) {
            error = err;
            console.log('err', err);
            done(err)
        });

    },

    /**
     * Save refresh token, called directly after creating the access token is saved.
     */
    saveRefreshToken: function (refreshToken, clientId, expires, user, done) {
        console.log('saveRefreshToken called', refreshToken, clientId, expires, user);

        db.oauth_tokens.update({client_id: clientId}, {
            refresh_token: refreshToken,
            refresh_token_expires_on: expires
        }, function (err, oauth_token) {
            done(err)
        })
    },

    grantTypeAllowed: function (clientId, grantType, done) {
        // Accept all grant types.
        var allowed = true;
        var error = false;
        done(error, allowed);
    }
}
;