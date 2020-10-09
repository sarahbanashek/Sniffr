const User = require('../models/User');

console.log('user controller being evaluated');

const userController = {
    checkUserName: (req, res) => {
        User.find({ username: req.params.username }, (err, docs) => {
            if (err) {
                res.send(err);
            } else {
                if (docs.length === 0) {
                    res.send({ available: true });
                } else {
                    res.send({ available: false });
                }
            }
        })
    },
    // TODO: render an error message when login fails
    userLogIn: (username, password, done) => {
        User.findOne({ username: username, password: password }, (err, user) => {
            console.log(`User ${username} attempted to log in`);
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('username does not exist');
                return done(null, false);
            }
            if (user.password !== password) {
                console.log('incorrect password');
                return done(null, false)
            }
            return done(null, user);
        });
    },
    // TODO: Find a better spot for this
    passportDeserializeUser: (id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    }
}


module.exports = userController;