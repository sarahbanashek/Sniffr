const userController = require('./controllers/userControllers');
const smellController = require('./controllers/smellControllers');
const ensureAuthenticated = require('./middlewares/ensureAuthenticated');

const configureRoutes = (app, authenticationMiddleware) => {
    app.get('/', (_, res) => {
        res.redirect('/login');
    })
    
    app.route('/login')
        .get((req, res) => {
            res.render(process.cwd() + '/views/login', {title: 'Login', errorMessage: req.flash('error')});
        })
        .post(authenticationMiddleware)

    app.route('/register')
        .get((_, res) => {
            res.render(process.cwd() + '/views/register', {title: 'Register'});
        })
        .post(userController.createUser);
    
    app.get('/checkUsername/:username', userController.checkUserName);
    
    app.get('/feed', ensureAuthenticated, smellController.smellFeed);
       
    app.post('/createSmell', ensureAuthenticated, smellController.createSmell);
    
    app.post('/kick/:smellID', ensureAuthenticated, smellController.kickSmell);
    
    app.post('/uplick/:smellID', ensureAuthenticated, smellController.uplick);
    
    app.post('/downpoop/:smellID', ensureAuthenticated, smellController.downpoop);
    
    app.delete('/deleteSmell/:smellID', ensureAuthenticated, smellController.deleteSmell);
    
    app.get('/mySmells', ensureAuthenticated, smellController.mySmellsFeed);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}

module.exports = configureRoutes;
