'use strict';

import {EmailSlots as SlotEmailNotificationCtrl} from './notifications-by-email.server.controller';
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	moment = require('moment'),
	Slot = mongoose.model('Slot'),
	_ = require('lodash');

// TODO: where to place this call - to be called once (as is here)?
// TODO: figure out if require() of the module calls fn twice
new SlotEmailNotificationCtrl();

export class SlotsServerController {
	static list(req, res) {
		Slot.find({
			start: {$gte: new Date(req.query.start).toUTCString()},
			end: {$lte: new Date(req.query.end).toUTCString()},
			userId: req.user._id
		}).exec((err, slots) => {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(slots);
			}
		})
	}

	static create(req, res) {
		var promises = [],
			workingHours = req.user.predefinedSettings.workingHours,
			timeForSlot,
			workingDay,
			hoursForSlot,
			minutesForSlot;

		Object.keys(req.body).forEach(function (key) {
			promises.push(new Promise(function (resolve) {
				var newSlot = new Slot(req.body[key]);
				newSlot.save(function (error) {
					if (error) {
						resolve(false)
					} else {
						if (newSlot.eventId) {
							resolve(true);
							return;
						}
						Slot.find({
							start: {$gte: new Date(newSlot.start.toUTCString())},
							end: {$lte: new Date(newSlot.end.toUTCString())},
							userId: req.user._id
						}).sort({priority: 1}).exec(function (err, slots) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								workingDay = moment(newSlot.start).format('dddd').toLowerCase().slice(0, 3);
								timeForSlot = workingHours[workingDay].start.split(":"),
									hoursForSlot = parseInt(timeForSlot[0], 10),
									minutesForSlot = parseInt(timeForSlot[1], 10);
								slots.forEach(function (slot) {
									slot.start = newSlot.start.setHours(hoursForSlot, minutesForSlot);
									slot.end = newSlot.end.setHours(hoursForSlot + slot.duration, minutesForSlot + slot.duration % 1 * 60);
									slot.save(function (err) {
										if (err) {
											return res.status(400).send({
												message: err
											});
										}
									});
									hoursForSlot += parseInt(slot.duration, 10);
									minutesForSlot = (minutesForSlot + slot.duration % 1 * 60) % 60;
								});
								SlotEmailNotificationCtrl.doScheduleEmailForFutureSlot(newSlot);
								resolve(true);
							}
						});
					}
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
		var slot = req.slot;

		slot = _.extend(slot, req.body);

		slot.save(function (err) {
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
			req.slot = slot;
			next();
		});
	}
}
