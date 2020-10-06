const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// Load environment variables
require('dotenv').config();

const app = express();
require('./db').connectToDb();


// const databaseUrl = process.env.DB_CONNECTION_STRING;
// const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true };
const userController = require('./controllers/userControllers');
const smellController = require('./controllers/smellControllers');


app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'the poop is king',
    resave: true,
    saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

// mongoose.set('useFindAndModify', false);
// mongoose.connect(databaseUrl, dbOptions)
//  .then(() => console.log('Connected to MongoDB'))
//  .catch(err => console.error('Connection error', err));
// const Smell = mongoose.model('Smell', 
//     new mongoose.Schema({
//         textContent: String,
//         imageContent: String,
//         creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         dateCreated: Date,
//         uplickCount: Number,
//         uplick: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//         downpoopCount: Number,
//         downpoop: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//         kickedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         originalId: mongoose.Schema.Types.ObjectId
//     })
// );

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(userController.passportDeserializeUser);
//     (id, done) => {
//     User.findById(id, (err, user) => {
//       done(err, user);
//     });
// });

passport.use(new LocalStrategy(userController.userLogIn));
    // (username, password, done) => {
    //     User.findOne({ username: username, password: password }, (err, user) => {
    //         console.log(`User ${username} attempted to log in`);
    //         if (err) {
    //             return done(err);
    //         }
    //         if (!user) {
    //             console.log('username does not exist');
    //             return done(null, false);
    //         }
    //         if (user.password !== password) {
    //             console.log('incorrect password');
    //             return done(null, false)
    //         }
    //         return done(null, user);
    //     });
    // }


const ensureAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

app.get('/', (_, res) => {
    res.render(process.cwd() + '/views/login', {title: 'Login'});
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (_, res) => {
    res.redirect('/feed');
});

app.route('/register')
    .get((_, res) => {
        res.render(process.cwd() + '/views/register', {title: 'Register'});
    });

app.get('/checkUsername/:username', userController.checkUserName);

app.route('/welcome')
    .post((req, res) => {
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
                                res.render(process.cwd() + '/views/welcome', {title: 'Welcome New User', username: userDoc.username});
                            }
                        });
                    } else {
                        res.send('Please choose a different username');
                    }
                }
            })
        }
    });

app.get('/feed', ensureAuthenticated, smellController.smellFeed);
    // (req, res) => {
    // Smell.find({})
    //     .sort({dateCreated: -1})
    //     .limit(30)
    //     .populate('creator', 'username -_id')
    //     .populate('uplick', 'username -_id')
    //     .populate('downpoop', 'username -_id')
    //     .populate('kickedFrom', 'username -_id')
    //     .exec((err, docs) => {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         const smellsArr = docs;
    //         smellsArr.forEach(smell => {
    //             smell.uplickUrl = '/uplick/' + smell._id;
    //             smell.downpoopUrl = '/downpoop/' + smell._id;
    //             smell.kickUrl = '/kick/' + smell._id;
    //             smell.deleteUrl = '/deleteSmell/' + smell._id;
    //             smell.uplickers = smell.uplick.map(x => x.username).join(', ');
    //             smell.downpoopers = smell.downpoop.map(x => x.username).join(', ');
    //         });
    //         res.render(process.cwd() + '/views/feed', {title: 'Feed', username: req.user.username, smellsArr: smellsArr});
    //     }
    // });        
// });

app.post('/createSmell', ensureAuthenticated, smellController.createSmell);
// (req, res) => {
//     if (req.body.postContent === '' && req.body.imageContent === '') {
//         res.redirect('back');
//     } else {
//         const newSmell = new Smell({
//             textContent: req.body.postContent,
//             imageContent: req.body.imageContent,
//             creator: req.user._id,
//             dateCreated: Date.now(),
//             uplickCount: 0,
//             downpoopCount: 0
//         });
//         newSmell.save(err => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.redirect('back');
//             }
//         });
//     }
// });

app.post('/kick/:smellID', ensureAuthenticated, smellController.kickSmell);
// (req, res) => {
//     Smell.findById(req.params.smellID, (err, data) => {
//         if (err) {
//             res.json({error: err});
//         } else {
            
//             const newSmell = new Smell({
//                 textContent: data.textContent,
//                 imageContent: data.imageContent,
//                 creator: req.user._id,
//                 dateCreated: Date.now(),
//                 uplickCount: 0,
//                 downpoopCount: 0,
//                 kickedFrom: data.creator,
//                 originalId: req.params.smellID
//             });
//             newSmell.save(err => {
//                 if (err) {
//                     res.send(err);
//                 } else {
//                     res.redirect('back');
//                 }
//             })
//         }
//     });
// })

app.get('/uplick/:smellID', ensureAuthenticated, smellController.uplick);
// (req, res) => {
//     Smell.findById(req.params.smellID, (err, data) => {
//         if (err) {
//             res.json({error: err});
//         }
//         const hasUserUplicked = data.uplick.includes(req.user._id);
//         const updateObject = hasUserUplicked 
//             ? { $inc: {uplickCount: -1 }, $pull: {uplick: req.user._id} }
//             : { $inc: {uplickCount: 1 }, $push: {uplick: req.user._id} };

//         Smell.findByIdAndUpdate(req.params.smellID, updateObject, {new: true})
//             .populate('uplick', 'username -_id')
//             .exec((err, data) => {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(data);
//         });
//     });
// });

app.get('/downpoop/:smellID', ensureAuthenticated, (req, res) => {
    Smell.findById(req.params.smellID, (err, data) => {
        if (err) {
            res.send(err);
        }
        const hasUserDownpooped = data.downpoop.includes(req.user._id);
        const updateObject = hasUserDownpooped 
            ? { $inc: {downpoopCount: -1 }, $pull: {downpoop: req.user._id} }
            : { $inc: {downpoopCount: 1 }, $push: {downpoop: req.user._id} };

        Smell.findByIdAndUpdate(req.params.smellID, updateObject, {new: true})
            .populate('downpoop', 'username -_id')
            .exec((err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    });
});

app.get('/deleteSmell/:smellID', ensureAuthenticated, (req, res) => {
    Smell.findById(req.params.smellID)
        .populate('creator', 'username -_id')
        .exec((err, doc) => {
            if (err) {
                res.send(err);
            } 
            if (doc.creator.username === req.user.username) {
                doc.remove(err => {
                    if(err) {
                        res.send(err);
                    } else {
                        res.redirect('back');
                    }
                })
            } else {
                res.send('You do not have permission to remove this smell.');
            }
        });
});

app.get('/profile', ensureAuthenticated, (req, res) => {
    Smell.find({ creator: req.user._id })
        .sort({dateCreated: -1})
        .limit(10)
        .populate('creator', 'username -_id')
        .populate('uplick', 'username -_id')
        .populate('downpoop', 'username -_id')
        .populate('kickedFrom', 'username -_id')
        .exec((err, docs) => {
            if (err) {
                res.send(err);
            } else {
                const smellsArr = docs;
                smellsArr.forEach(smell => {
                smell.uplickUrl = '/uplick/' + smell._id;
                smell.downpoopUrl = '/downpoop/' + smell._id;
                smell.kickUrl = '/kick/' + smell._id;
                smell.deleteUrl = '/deleteSmell/' + smell._id;
                smell.uplickers = smell.uplick.map(x => x.username).join(', ');
                smell.downpoopers = smell.downpoop.map(x => x.username).join(', ');
                });
                res.render(process.cwd() + '/views/profile', {title: 'Profile', username: req.user.username, smellsArr: smellsArr});
            }
    }); 
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000, () => console.log('app listening on port 3000'));

// module.exports = { 
//     // databaseUrl,
//     // dbOptions,
//     // User,
//     // Smell 
// };