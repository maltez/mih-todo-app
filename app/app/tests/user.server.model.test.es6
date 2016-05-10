'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

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
			firstName: 'User',
			lastName: 'Model',
			displayName: 'User Model',
			email: 'User@Model.com',
			username: 'UserModel',
			password: 'UserModel',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'User',
			lastName: 'Model',
			displayName: 'User Model',
			email: 'User@Model.com',
			username: 'UserModel',
			password: 'UserModel',
			provider: 'local'
		});

		done();
	});

	describe('Method Save', () => {

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

	after(function (done) {
		User.remove().exec(done);
	});
});
