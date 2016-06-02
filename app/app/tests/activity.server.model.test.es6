'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Task = mongoose.model('Activity'),
	Event = mongoose.model('Activity');

/**
 * Globals
 */
var user, task, event;

/**
 * Unit tests
 */
describe('Activity Model Unit Tests:', function() {
	beforeEach(function(done) {
		task = new Task({
			title: 'Task Name',
			priority: 1,
			estimation : 8,
			type : 'task',
			user: user
		});
		event = new Event ({
			title: 'Event Name',
			type : 'event',
			notes : 'some notes here',
			user: user
		});
		done();
	});

	describe('Method Save', function() {
		it('should be able to save task without problems', function(done) {
			return task.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to save event without problems', function(done) {
			return event.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save task without title', function(done) {
			task.title = '';
			return task.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save task without type', function(done) {
			task.type = '';
			return task.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save event without title', function(done) {
			event.title = '';
			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save event without type', function(done) {
			event.type = '';
			return event.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Task.remove().exec();
		Event.remove().exec();
		User.remove().exec();
		done();
	});
});
