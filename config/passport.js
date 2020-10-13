const LocalStrategy = require('passport-local');
const User = require('../models/User')

module.exports = function(passport) {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    });

// TODO: render an error message when login fails
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username, password: password }, (err, user) => {
            // console.log(`User ${username} attempted to log in`);
            if (err) {
                return done(err);
            }
            if (!user) {
                // console.log('username does not exist');
                return done(null, false);
            }
            if (user.password !== password) {
                // console.log('incorrect password');
                return done(null, false)
            }
            return done(null, user);
        });
    }));
};