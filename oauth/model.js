// Implementation of required oauth2 methods.
// @see https://github.com/oauthjs/node-oauth2-server/wiki/Model-specification

module.exports = {
    /*
     * Get access token.
     */
    getAccessToken: function (bearerToken) {
        console.log('getAccessToken called')
        // TODO Implement.
        return {
            accessToken: 50,
            clientId: 10,
            expires: new Date(),
            userId: 1
        }
    },

    /**
     * Get client.
     */
    getClient: function (clientId, clientId, done) {
        console.log('getClient called')
        // TODO Implement.

        var error = false;
        done(error, 'works!');
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

        done(false, {
            username: 'obodley@gmail.com'
        })

    },

    /**
     * Save token.
     */
    saveAccessToken: function (accessToken, clientId, expires, user, done) {
        console.log('saveAccessToken called', accessToken, clientId, expires, user);

        var error = false;
        done(error)
    },

    saveRefreshToken: function (refreshToken, clientId, expires, user, done) {
        console.log('saveRefreshToken called', refreshToken, clientId, expires, user);

        var error = false;
        done(error)
    },

    grantTypeAllowed: function (clientId, grantType, done) {
        var allowed = true;
        var error = false;
        done(error, allowed);
    }

}
;