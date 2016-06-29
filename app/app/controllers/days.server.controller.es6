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
		var promises = [];

		Object.keys(req.body).forEach(key => {
			var day = req.body[key],
				query = {_id: mongoose.Types.ObjectId(day._id)},
				options = { upsert: true, new: true, setDefaultsOnInsert: true };

			delete day.__v;
			promises.push(new Promise(resolve => {
				Day.findOneAndUpdate(query, day, options, (error, result) => {
					error ? resolve(false) : resolve(true);
				});
			}));
		});
		Promise.all(promises).then(result => {
			if (result.indexOf(false) == -1) {
				return res.status(200).send({});
			} else {
				return res.status(400).send({
					message: err
				});
			}
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
