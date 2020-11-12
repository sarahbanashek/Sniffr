const Smell = require('../models/Smell');

const smellController = {
    smellFeed: (req, res) => {
        Smell.find({})
        .sort({dateCreated: -1})
        .limit(30)
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
                res.render(process.cwd() + '/views/feed', {title: 'Feed', username: req.user.username, smellsArr: smellsArr});
            }
        });        
    }
}

module.exports = smellController;