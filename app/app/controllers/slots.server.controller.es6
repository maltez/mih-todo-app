'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Slot = mongoose.model('Slot'),
	_ = require('lodash');

export class SlotsServerController {
	static list(req, res) {
		Slot.find({
			start: {$gte: new Date(req.query.start)},
			end: {$lte: new Date(req.query.end)}
		}).exec((err, days) => {
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
			promises.push(new Promise(resolve => {
				let newSlot = new Slot(req.body[key]);

				newSlot.save(error => {
					error ? resolve(false) : resolve(true);
				});
			}));
		});
		Promise.all(promises).then(result => {
			if (result.indexOf(false) == -1) {
				return res.status(200).send();
			} else {
				return res.status(400).send();
			}
		});
	}

	static read(req, res) {

	}

	static update(req, res) {
		var slot = req.slot ;

		slot = _.extend(slot , req.body);

		slot.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(slot);
			}
		});
	}

	static remove(req, res) {

	}

	static slotByID(req, res, next, id) {
		Slot.findById(id).exec((err, slot) => {
			if (err) return next(err);
			if (!slot) return next(new Error('Failed to load Slot ' + id));
			req.slot = slot ;
			next();
		});
	}
}
