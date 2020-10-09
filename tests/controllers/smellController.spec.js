const smellController = require('../../controllers/smellControllers');
const Smell = require('../../models/Smell');

describe('Controller: smellController', () => {
    describe('Function: createSmell', () => {
        it('redirects to "back" if post & image content are both empty', () => {
            const fakeRedirect = jest.fn();
            const fakeRequest = {
                body: {
                    postContent: '',
                    imageContent: ''
                }
            }
            const fakeResponse = {
                redirect: fakeRedirect
            }
            const expectedRedirect = 'back';
            
            
            smellController.createSmell(fakeRequest, fakeResponse);


            expect(fakeRedirect).toHaveBeenCalledWith(expectedRedirect);
        });
        it('sends an error if the Smell model throws an error when saving', () => {
            const fakeSend = jest.fn();
            const fakeRequest = {
                user: 'id',
                body: {
                    postContent: 'content',
                    imageContent: ''
                }
            }
            const fakeResponse = {
                send: fakeSend
            }
            const expectedError = 'error';
            jest.spyOn(Smell.prototype, 'save').mockImplementation((callback) => {
                callback(expectedError);
            });


            smellController.createSmell(fakeRequest, fakeResponse);


            expect(fakeSend).toHaveBeenCalledWith(expectedError);
        });
        it('redirects to "back" if the Smell model does not throw an error when saving', () => {
            const fakeRedirect = jest.fn();
            const fakeRequest = {
                user: 'id',
                body: {
                    postContent: 'content',
                    imageContent: ''
                }
            }
            const fakeResponse = {
                redirect: fakeRedirect
            }
            const expectedRedirect = 'back';
            jest.spyOn(Smell.prototype, 'save').mockImplementation((callback) => {
                callback(null);
            });


            smellController.createSmell(fakeRequest, fakeResponse);


            expect(fakeRedirect).toHaveBeenCalledWith(expectedRedirect);
        });
    });
});