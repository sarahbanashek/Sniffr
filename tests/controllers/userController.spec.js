const userController = require('../../controllers/userControllers');
const User = require('../../models/User');

describe('Controller: userController', () => {
    describe('Function: checkUserName', () => {
        it('sends an error if the User model throws an error', () => {
            // Setup
            const fakeSend = jest.fn();
            const fakeRequest = {
                params: {
                    username: 'user'
                }
            }
            const fakeResponse = {
                send: fakeSend
            }
            const expectedError = 'e';
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(expectedError);
            });

            // Act
            userController.checkUserName(fakeRequest, fakeResponse);

            // Assert
            expect(fakeSend).toHaveBeenCalledWith(expectedError);

        });
        it('sends {available: true} if the username is not found', () => {
            const fakeSend = jest.fn();
            const fakeRequest = {
                params: {
                    username: 'user'
                }
            }
            const fakeResponse = {
                send: fakeSend
            }
            const expectedSentObject = { available: true }
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, []);
            });


            userController.checkUserName(fakeRequest, fakeResponse);


            expect(fakeSend).toHaveBeenCalledWith(expectedSentObject);
        });
        it('sends {available: false} if the username already exists', () => {
            const fakeSend = jest.fn();
            const fakeRequest = {
                params: {
                    username: 'user'
                }
            }
            const fakeResponse = {
                send: fakeSend
            }
            const expectedSentObject = { available: false }
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, ['user']);
            });


            userController.checkUserName(fakeRequest, fakeResponse);


            expect(fakeSend).toHaveBeenCalledWith(expectedSentObject);
        });
    });
    describe('Function: userLogIn', () => {
        it('returns an error if the User model throws an error', () => {
            const done = jest.fn();
            const username = 'user';
            const password = 'password';
            const expectedError = 'error';
            jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
                callback(expectedError);
            });


            userController.userLogIn(username, password, done);

            
            expect(done).toHaveBeenCalledWith(expectedError);
        });
        it('returns false if the user is not found', () => {
            const done = jest.fn();
            const username = 'user';
            const password = 'password';
            const databaseResults = null;
            jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
                callback(null, databaseResults);
            });


            userController.userLogIn(username, password, done);

            expect(done).toHaveBeenCalledWith(null, false);
        });
        it('returns false if the password is incorrect', () => {
            const done = jest.fn();
            const username = 'user';
            const password = 'incorrect password';
            const databaseResults = {
                password: 'password'
            }
            jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
                callback(null, databaseResults);
            });


            userController.userLogIn(username, password, done);


            expect(done).toHaveBeenCalledWith(null, false);
        });
        it('returns the user if the passwords match', () => {
            const done = jest.fn();
            const username = 'user';
            const password = 'password';
            const databaseResults = {
                password: 'password'
            }
            jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
                callback(null, databaseResults);
            });


            userController.userLogIn(username, password, done);


            expect(done).toHaveBeenCalledWith(null, databaseResults);
        });
    });
});