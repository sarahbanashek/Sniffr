const db = require('../db').db;

const Smell = db.model('Smell', 
    new db.Schema({
        textContent: String,
        imageContent: String,
        creator: { type: db.Schema.Types.ObjectId, ref: 'User' },
        dateCreated: Date,
        uplickCount: Number,
        uplick: [{ type: db.Schema.Types.ObjectId, ref: 'User' }],
        downpoopCount: Number,
        downpoop: [{ type: db.Schema.Types.ObjectId, ref: 'User' }],
        kickedFrom: { type: db.Schema.Types.ObjectId, ref: 'User' },
        originalId: db.Schema.Types.ObjectId
    })
);

module.exports = Smell;