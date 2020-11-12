const User = require('../models/User');

console.log('controller being evaluated');

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
    }
}

/*
const stub = (object, propertyname) => {
    object[propertyname] = {
        calls: 0,
        calledWith: [],
        callsFake: (fn) => object.propertyname = (args) => {
            calls++;
            calledWith.push(args)
            fn(args)
        }
    }
}

// Setup
const expectedErrorString = 'someerrorstring';
const fakeResponse = {};
const sendStub = stub(fakeResponse, 'send').callsFake(() => {})
stub(User, 'find').callsFake((_, callback) => {
    callback(expectedErrorString);
})

// Act
userController.checkUserName(_, fakeResponse);

// Assert
expect(sendStub.calledWith[0]).toEqual('someerrorstring');


res.send
*/

module.exports = userController;