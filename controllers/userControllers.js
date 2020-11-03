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
    createUser: (req, res) => {
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
                        newUser.save((err, userDoc) => {
                            if (err) {
                                res.send(err)
                            } else {
                                res.render(process.cwd() + '/views/login', {title: 'Login', welcomeMessage: `Welcome to the pack, ${userDoc.username}! Log in to check out the latest smells!`});
                            }
                        });
                    } else {
                        res.send('Please choose a different username');
                    }
                }
            })
        }
    }
}


module.exports = userController;