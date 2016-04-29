'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	app = require('../../server'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials,
	user,
	_user;

describe('User CRUD tests', () => {

	before(done => {
		// Create user credentials
		credentials = {
			email: 'User@Routes.com',
			password: 'UserRoutes'
		};

		// Create a new user
		_user = {
			email: credentials.email,
			username: 'UserRoutes',
			password: credentials.password,
			provider: 'local'
		};

		user = new User(_user);

		// Save a user to the test db and create new article
		user.save(err => {
			should.not.exist(err);
			done();
		});
	});

	describe('Profile image tests', () => {

		it('should be able to change profile picture if signed in', done => {
			agent.post('/auth/signin')
				.send(credentials)
				.expect(200)
				.end((signinErr, signinRes) => {
					// Handle signin error
					if (signinErr) {
						return done(signinErr);
					}

					agent.post('/users/picture')
						.attach('newProfilePicture', './public/modules/users/img/profiles/default.jpg')
						.send(credentials)
						.expect(200)
						.end((userInfoErr, userInfoRes) => {
							// Handle change profile picture error
							if (userInfoErr) {
								return done(userInfoErr);
							}

							return done();
						});
				});
		});
	});

	describe('Forgot password Unit Test', () => {
		var originalPassword = '',
			restToken = '',
			mockUser = {
				email: 'User@Routes.com'
			};

		it('should generate reset password token', done => {
			agent.post('/auth/forgot')
				.send(mockUser)
				.expect(200)
				.end(() => {
					User.findOne(mockUser, (err, dbUser) => {
						originalPassword = dbUser.password;
						restToken = dbUser.resetPasswordToken;

						should.not.exist(err);
						should.exist(dbUser.resetPasswordToken);

						done();
					});
				});
		});

		it('password should be changed', done => {
			var newPassword = {
				newPassword: 'newPassword',
				verifyPassword: 'newPassword'
			};

			agent.post('/auth/reset/' + restToken)
				.send(newPassword)
				.expect(200)
				.end(() => {
					User.find(mockUser, (err, dbUser) => {
						should.not.exist(err);
						should.notEqual(dbUser.password, originalPassword);

						done();
					});
				});
		});
	});

	after(done => {
		User.remove().exec(done);
	});
});
