const LocalStrategy = require('passport-local').Strategy;
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

    passport.use(new LocalStrategy({passReqToCallback : true}, (_, username, password, done) => {
        User.findOne({ username: username, password: password }, (err, user) => {
            // console.log(`User ${username} attempted to log in`);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: `Login failed. Remember: usernames and passwords are case sensitive!` });
            }
            return done(null, user);
        });
    }));
};