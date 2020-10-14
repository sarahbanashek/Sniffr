const userController = require('../../controllers/userControllers');
const User = require('../../models/User');

describe('Controller: userController', () => {
    describe('Function: checkUserName', () => {
        const fakeRequest = {
            params: {
                username: 'user'
            }
        }
        const fakeResponse = {}
        test('sends an error if the User model throws an error', () => {
            fakeResponse.send = jest.fn();
            const expectedError = 'error';
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(expectedError);
            });

            userController.checkUserName(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedError);

        });
        test('sends {available: true} if the username is not found', () => {
            fakeResponse.send = jest.fn();
            const expectedSentObject = { available: true }
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, []);
            });

            userController.checkUserName(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedSentObject);
        });
        test('sends {available: false} if the username already exists', () => {
            fakeResponse.send = jest.fn();
            const expectedSentObject = { available: false }
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, ['user']);
            });

            userController.checkUserName(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedSentObject);
        });
    });
    describe('Function: welcomeUser', () => {
        let fakeRequest;
        let fakeResponse = {};
        beforeEach(() => {
            fakeRequest = {
                body: {
                    firstName: 'First',
                    lastName: 'Last',
                    username: 'username',
                    password: 123,
                    confirmpassword: 123
                }
            }
        });
        test('sends a message if passwords do not match', () => {
            fakeRequest.body.confirmpassword = 456;
            fakeResponse.send = jest.fn();
            const expectedSentMessage = 'Passwords do not match!';

            userController.welcomeUser(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedSentMessage);
        });
        test('sends an error if User.find throws an error', () => {
            fakeResponse.send = jest.fn();
            const expectedError = 'error';
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(expectedError);
            });

            userController.welcomeUser(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedError);
        });
        test('sends an error if newUser.save throws an error', () => {
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, []);
            });
            const expectedError = 'error';
            fakeResponse.send = jest.fn();
            jest.spyOn(User.prototype, 'save').mockImplementation((callback) => {
                callback(expectedError);
            });

            userController.welcomeUser(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedError);
        });
        test('renders the welcome page if the username is available', () => {
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, []);
            });
            const userDoc = {
                username: 'username'
            }
            const expectedResObject = {
                title: 'Welcome New User',
                username: userDoc.username
            }
            fakeResponse.render = jest.fn();
            jest.spyOn(User.prototype, 'save').mockImplementation((callback) => {
                callback(null, userDoc);
            });
            jest.spyOn(process, 'cwd').mockReturnValue('');

            userController.welcomeUser(fakeRequest, fakeResponse);

            expect(fakeResponse.render).toHaveBeenCalledWith('/views/welcome', expectedResObject);
        });
        test('sends a message if username is already in use', () => {
            jest.spyOn(User, 'find').mockImplementation((_, callback) => {
                callback(null, ['username']);
            });
            const expectedSentMessage = 'Please choose a different username';
            fakeResponse.send = jest.fn();

            userController.welcomeUser(fakeRequest, fakeResponse);

            expect(fakeResponse.send).toHaveBeenCalledWith(expectedSentMessage);
        });
    });
    // describe('Function: userLogIn', () => {
    //     it('returns an error if the User model throws an error', () => {
    //         const done = jest.fn();
    //         const username = 'user';
    //         const password = 'password';
    //         const expectedError = 'error';
    //         jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
    //             callback(expectedError);
    //         });


    //         userController.userLogIn(username, password, done);

            
    //         expect(done).toHaveBeenCalledWith(expectedError);
    //     });
    //     it('returns false if the user is not found', () => {
    //         const done = jest.fn();
    //         const username = 'user';
    //         const password = 'password';
    //         const databaseResults = null;
    //         jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
    //             callback(null, databaseResults);
    //         });


    //         userController.userLogIn(username, password, done);

    //         expect(done).toHaveBeenCalledWith(null, false);
    //     });
    //     it('returns false if the password is incorrect', () => {
    //         const done = jest.fn();
    //         const username = 'user';
    //         const password = 'incorrect password';
    //         const databaseResults = {
    //             password: 'password'
    //         }
    //         jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
    //             callback(null, databaseResults);
    //         });


    //         userController.userLogIn(username, password, done);


    //         expect(done).toHaveBeenCalledWith(null, false);
    //     });
    //     it('returns the user if the passwords match', () => {
    //         const done = jest.fn();
    //         const username = 'user';
    //         const password = 'password';
    //         const databaseResults = {
    //             password: 'password'
    //         }
    //         jest.spyOn(User, 'findOne').mockImplementation((_, callback) => {
    //             callback(null, databaseResults);
    //         });


    //         userController.userLogIn(username, password, done);


    //         expect(done).toHaveBeenCalledWith(null, databaseResults);
    //     });
    // });
});