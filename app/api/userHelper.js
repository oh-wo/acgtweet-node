module.exports = {
    search: function (query) {
        return db.promise(done => db.users.search(query, done))
                    .then(function (users) {
                        return users.map(user=> {
                            delete user.password;
                            return user;
                        })
                    });
    }
};