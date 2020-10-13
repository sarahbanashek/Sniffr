const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// Load environment variables
require('dotenv').config();

const app = express();
require('./db').connectToDb();

const userController = require('./controllers/userControllers');
const smellController = require('./controllers/smellControllers');


app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.session_secret,
    resave: true,
    saveUninitialized: true
 }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(userController.passportDeserializeUser);

passport.use(new LocalStrategy(userController.userLogIn));

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

app.post('/welcome', userController.welcomeUser);

app.get('/feed', ensureAuthenticated, smellController.smellFeed);
   
app.post('/createSmell', ensureAuthenticated, smellController.createSmell);

app.post('/kick/:smellID', ensureAuthenticated, smellController.kickSmell);

app.get('/uplick/:smellID', ensureAuthenticated, smellController.uplick);

app.get('/downpoop/:smellID', ensureAuthenticated, smellController.downpoop);

app.get('/deleteSmell/:smellID', ensureAuthenticated, smellController.deleteSmell);

app.get('/profile', ensureAuthenticated, smellController.profileFeed);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(3000, () => console.log('app listening on port 3000'));
