const smellController = require('../../controllers/smellControllers');
const Smell = require('../../models/Smell');

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
});