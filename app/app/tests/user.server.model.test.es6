'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    request = require('supertest'),
    app = require('../../server'),
    agent = request.agent(app);

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
	before(function (done) {
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

	describe('Method Save', function () {
		it('should begin with no users', function (done) {
			User.find({}, function (err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function (done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function (done) {
			user.save(function () {
				user2.save(function (err) {
					should.exist(err);
					done();
				});
			});
		});

		it('should be able to show an error when try to save without first name', function (done) {
			user.firstName = '';
			return user.save(function (err) {
				should.exist(err);
				done();
			});
		});
	});

	var originalPassword = '',
	    restToken = '',
	    mockUser = {
		email: 'test@test.com'
	};

	describe('Forgot password Unit Test', function () {
		it('should generate reset password token', function (done) {
			agent.post('/auth/forgot').send(mockUser).expect(200).end(function () {
				User.findOne(mockUser, function (err, dbUser) {
					originalPassword = dbUser.password;
					restToken = dbUser.resetPasswordToken;

					should.not.exist(err);
					should.exist(dbUser.resetPasswordToken);

					done();
				});
			});
		});

		it('password should be changed', function (done) {
			var newPassword = {
				newPassword: 'newPassword',
				verifyPassword: 'newPassword'
			};

			agent.post('/auth/reset/' + restToken).send(newPassword).expect(200).end(function () {
				User.find(mockUser, function (err, dbUser) {
					should.not.exist(err);
					should.notEqual(dbUser.password, originalPassword);

					done();
				});
			});
		});
	});

	after(function (done) {
		User.remove().exec(done);
	});
});
