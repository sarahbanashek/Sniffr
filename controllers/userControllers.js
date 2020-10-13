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
    welcomeUser: (req, res) => {
        if (req.body.password !== req.body.confirmpassword) {
            res.send('Passwords do not match!'); 
        } else {
            User.find({ username: req.body.username }, (err, docs) => {
                if (err) {
                    res.send(err);
                } else {
                    if (docs.length === 0) {
                        const newUser = new User({
                            firstName: req.body.firstname,
                            lastName: req.body.lastname,
                            username: req.body.username,
                            password: req.body.password
                        });
                        console.dir(req.body);
                        newUser.save((err, userDoc) => {
                            if (err) {
                                res.send(err)
                            } else {
                                res.render(process.cwd() + '/views/welcome', {title: 'Welcome New User', username: userDoc.username});
                            }
                        });
                    } else {
                        res.send('Please choose a different username');
                    }
                }
            })
        }
    },
    // TODO: render an error message when login fails
    userLogIn: (username, password, done) => {
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
    },
    // TODO: Find a better spot for this
    passportDeserializeUser: (id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
    }
}


module.exports = userController;