const mongoose = require('mongoose');

// let db;

const connectToDb = () => {
    console.log('connecting to db')
    console.dir(process.env);
    const databaseUrl = process.env.DB_CONNECTION_STRING;
    const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true };

    mongoose.set('useFindAndModify', false);
    mongoose.connect(databaseUrl, dbOptions)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => console.error('Connection error', err));
   
};

module.exports = {
    connectToDb,
    db: mongoose
};