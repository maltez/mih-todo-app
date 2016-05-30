'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Day = mongoose.model('Day');

export class DaysServerController {
	constructor() {}

	static list(req, res) {
		Day.find({date: {$gte: req.query.startDate, $lte: req.query.endDate}}).exec((err, days) => {
			if(err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(days);
			}
		})
	}

	static create(req, res) {
		Object.keys(req.body).forEach(key => {
			var day = new Day(req.body[key]);
			day.user = req.user;

			day.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: err
					});
				} else {
					res.jsonp(day);
				}
			});
		});
	}

	static read(req, res) {

	}

	static update(req, res) {

	}

	static remove(req, res) {

	}

	static hasAuthorization(req, res, next) {
		if (req.day.user.id !== req.user.id) {
			return res.status(403).send('User is not authorized');
		}
		next();
	};
}
