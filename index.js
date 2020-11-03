const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const configureRoutes = require('./routes');

// Load environment variables
require('dotenv').config();

const app = express();
require('./db').connectToDb();

app.use(flash());
app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
 }));
require('./config/passport.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
configureRoutes(app, passport.authenticate('local', { successRedirect: '/feed', failureRedirect: '/', failureFlash: true }));


app.listen(3000, () => console.log('app listening on port 3000'));
