const Smell = require('../models/Smell');

const smellController = {
    createSmell: (req, res) => {
        if (req.body.postContent === '' && req.body.imageContent === '') {
            res.redirect('back');
        } else {
            const newSmell = new Smell({
                textContent: req.body.postContent,
                imageContent: req.body.imageContent,
                creator: req.user._id,
                dateCreated: Date.now(),
                uplickCount: 0,
                downpoopCount: 0
            });
            newSmell.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.redirect('back');
                }
            });
        }
    },
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
    },
    kickSmell: (req, res) => {
        Smell.findById(req.params.smellID, (err, data) => {
            if (err) {
                res.json({error: err});
            } else {
                
                const newSmell = new Smell({
                    textContent: data.textContent,
                    imageContent: data.imageContent,
                    creator: req.user._id,
                    dateCreated: Date.now(),
                    uplickCount: 0,
                    downpoopCount: 0,
                    kickedFrom: data.creator,
                    originalId: req.params.smellID
                });
                newSmell.save(err => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.redirect('back');
                    }
                })
            }
        });
    },
    uplick: (req, res) => {
        Smell.findById(req.params.smellID, (err, data) => {
            if (err) {
                res.json({error: err});
            }
            const hasUserUplicked = data.uplick.includes(req.user._id);
            const updateObject = hasUserUplicked 
                ? { $inc: {uplickCount: -1 }, $pull: {uplick: req.user._id} }
                : { $inc: {uplickCount: 1 }, $push: {uplick: req.user._id} };
    
            Smell.findByIdAndUpdate(req.params.smellID, updateObject, {new: true})
                .populate('uplick', 'username -_id')
                .exec((err, data) => {
                if (err) {
                    res.send(err);
                }
                res.json(data);
            });
        });
    }
}

module.exports = smellController;