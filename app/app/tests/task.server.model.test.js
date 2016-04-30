'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Task = mongoose.model('Task');

/**
 * Globals
 */
var user, task;

/**
 * Unit tests
 */
describe('Task Model Unit Tests:', function() {
	beforeEach(function(done) {
		task = new Task({
			title: 'Task Name',
			priority: 1,
			user: user
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return task.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			task.title = '';

			return task.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Task.remove().exec();
		User.remove().exec();

		done();
	});
});
