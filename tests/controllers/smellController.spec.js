const smellController = require('../../controllers/smellControllers');
const Smell = require('../../models/Smell');
const mongoose = require('mongoose');

describe('Controller: smellController', () => {
    describe('Function: createSmell', () => {
        let fakeRequest;
        let fakeResponse;
        beforeEach(() => {
            fakeRequest = {
                user: 'id',
                body: {
                    postContent: '',
                    imageContent: ''
                }
            }
            fakeResponse = {}
        });
        it('redirects to "back" if post & image content are both empty', () => {
            fakeResponse.redirect = jest.fn();
            const expectedRedirect = 'back';
            
            smellController.createSmell(fakeRequest, fakeResponse);

            expect(fakeResponse.redirect).toHaveBeenCalledWith(expectedRedirect);
        });
        it('sends an error if the Smell model throws an error when saving', () => {
            fakeRequest.body.postContent = 'content';
            fakeResponse.send = jest.fn();
            const expectedError = 'error';
            jest.spyOn(Smell.prototype, 'save').mockImplementation((callback) => {
                callback(expectedError);
            });

            smellController.createSmell(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedError);
        });
        it('redirects to "back" if the Smell model does not throw an error when saving', () => {
            fakeRequest.body.postContent = 'content';
            fakeResponse.redirect = jest.fn();
            const expectedRedirect = 'back';
            jest.spyOn(Smell.prototype, 'save').mockImplementation((callback) => {
                callback(null);
            });

            smellController.createSmell(fakeRequest, fakeResponse);

            expect(fakeResponse.redirect).toHaveBeenCalledWith(expectedRedirect);
        });
    });
    describe('Function: smellFeed', () => {
        let fakeRequest;
        let fakeResponse;
        beforeEach(() => {
            fakeRequest = {
                user: {
                    username: 'username'
                }
            }
            fakeResponse = {}
        });
        it('sends an error if the Smell model throws an error', () => {
            const expectedError = 'error';
            fakeResponse.send = jest.fn();
            jest.spyOn(mongoose.Query.prototype, 'exec').mockImplementation((callback) => {
                callback(expectedError);
            });

            smellController.smellFeed(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedError);
        });
        it('renders the smell feed with the appropriate data', () => {
            const docs = [{
                _id: 5,
                uplick: [ {username: 'uplick user1'}, {username: 'uplick user2'} ],
                downpoop: [ {username: 'downpoop user1'}, {username: 'downpoop user2'} ]
            }];
            const expectedSmellsArr = [{
                _id: 5,
                uplick: [ {username: 'uplick user1'}, {username: 'uplick user2'} ],
                downpoop: [ {username: 'downpoop user1'}, {username: 'downpoop user2'} ],
                uplickUrl: '/uplick/5',
                downpoopUrl: '/downpoop/5',
                kickUrl: '/kick/5',
                deleteUrl: '/deleteSmell/5',
                uplickers: 'uplick user1, uplick user2',
                downpoopers: 'downpoop user1, downpoop user2'
            }];
            jest.spyOn(process, 'cwd').mockReturnValue('');
            const expectedResObject = {
                title: 'Feed',
                username: 'username',
                smellsArr: expectedSmellsArr
            }
            fakeResponse.render = jest.fn();
            jest.spyOn(mongoose.Query.prototype, 'exec').mockImplementation((callback) => {
                callback(null, docs);
            });


            smellController.smellFeed(fakeRequest, fakeResponse);

            expect(fakeResponse.render).toHaveBeenCalledWith('/views/feed', expectedResObject);
        });
    });
});