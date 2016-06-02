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
var credentials, user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
	before(function (done) {
		credentials = {
			email: 'User@Model.com',
			username: 'UserModel',
			password: 'UserModel',
			provider: 'local',
			'predefinedSettings': {
				'reminder': 15,
				'workingHours': { 'mon': { 'dayIndex': 1, 'isWorkingDay': true, 'start': '09:00', 'end': '18:00' }},
				'booked': [{ 'startTime': '14:00', 'endTime': '15:00'}]
			}
		};

		user = new User(credentials);
		user2 = new User(credentials);

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

		it('should be able to show an error when try to save without username name', function (done) {
			user.username = '';
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
