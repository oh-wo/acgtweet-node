
// Initialize the oAuth sever, passing in our custom model options.
var oneYear = 60 * 60 * 24 * 7 * 52;
global.oauth = new oauthServer({
    model: require('./oauth/model'),
    grants: ['password', 'refresh_token'],
    // Attempt to set to one year.
    accessTokenLifetime: oneYear,
    refreshTokenLifetime: oneYear
});

app.post('/oauth/token', oauth.grant());
// TODO Implement the delete method to log out.
app.delete('/oauth/token', oauth.grant());

app.get('/secret', global.oauth.authorise(), function (req, res) {
    // Will require a valid access_token.
    res.send('Secret area');
});

