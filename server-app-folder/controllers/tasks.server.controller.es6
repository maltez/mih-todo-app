'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	ObjectId = require("mongodb").ObjectID,
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Activity'),
	Slot = mongoose.model('Slot'),
	_ = require('lodash');

/**
 * Create a Task
 */
exports.create = function(req, res) {
	var task = new Task(req.body);
	task.user = req.user;

	// TODO: temp hack for demo - move deadline few seconds forward into future
	task.days.endTime = new Date( +task.days.endTime + 20/*s*/ * 1000/*ms*/ );

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
	res.jsonp(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
	var task = req.task ;

	task = _.extend(task , req.body);

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
	var task = req.task ;

	task.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * List of Tasks
 */
exports.list = function(req, res) {
	Task.find({'user': ObjectId(req.user._id), 'type': 'task'}).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tasks);
		}
	});
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) {
	Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
		if (err) return next(err);
		if (! task) return next(new Error('Failed to load Task ' + id));
		req.task = task ;
		next();
	});
};

exports.getSlotsByTask = function (req, res, next) {
	Slot.find({taskId: req.query.taskId}).exec(function (err, slots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {			
			res.jsonp(slots);
		}
	});
};
exports.deleteSlotsByTask = function (req, res, next) {
	Slot.find({taskId: req.query.taskId}).remove().exec(function (err, slots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(slots);
		}
	});	
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.task.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
