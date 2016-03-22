'use strict';

/**
 * Module dependencies.
 */
let should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	request = require('supertest'),
	app = require('../../server'),
	agent = request.agent(app);

/**
 * Globals
 */
let user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', () => {
	before(done => {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', () => {
		it('should begin with no users', done => {
			User.find({}, (err, users) => {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', done => {
			user.save(done);
		});

		it('should fail to save an existing user again', done => {
			user.save(() => {
				user2.save(err => {
					should.exist(err);
					done();
				});
			});
		});

		it('should be able to show an error when try to save without first name', done => {
			user.firstName = '';
			return user.save(err => {
				should.exist(err);
				done();
			});
		});
	});

	let originalPassword = '',
		restToken = '',
		mockUser = {
			email: 'test@test.com'
		};

	describe('Forgot password Unit Test', () => {
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
			let newPassword = {
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
