'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Slot = mongoose.model('Slot'),
	Task = mongoose.model('Activity'),
	async = require('async');

/**
 * List of Overdue Slots and Tasks
 */
exports.list = (req, res) => {
	async.parallel({
		tasks: (callback) => {
			Slot.find({
				'isComplete': false,
				'end': {
					$lt: new Date(req.query.time)
				}
			}).distinct('taskId', (err, taskIds) => {
				if (err) return callback(err);
				Task.find({'_id': {$in: taskIds}}).exec((err, task) => {
					if (err) return callback(err);
					callback(null, task);
				});
			});
		},
		slots: (callback) => {
			Slot.find({
				'isComplete': false,
				'end': {
					$lt: new Date(req.query.time)
				}
			}).exec((err, overdueSlots) => {
				if (err) return callback(err);
				callback(null, overdueSlots);
			});
		}
	}, (err, result) => {
		if (err) return next(err);
		res.jsonp(result);
	});
};
