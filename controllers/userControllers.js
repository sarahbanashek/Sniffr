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
    }
}


module.exports = userController;