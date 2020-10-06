const db = require('../db').db;

const User = db.model('User', 
    new db.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
    })
);

module.exports = User;