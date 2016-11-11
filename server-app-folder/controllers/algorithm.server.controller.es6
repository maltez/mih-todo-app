'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Slot = mongoose.model('Slot'),
	_ = require('lodash');

var weekMap = {0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'};
var formatDateForKey = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
var timeToMinutes = time=> time.split(':').reduce((prev, cur) => ((parseInt(prev, 10)) * 60) + parseInt(cur, 10));

var getSlotDuration = (start, end) => (end - start) / 3600000;

export class AlgorithmServerController {
	static getFreeTime(req, res) {
		var start = new Date(req.query.start),
			end = new Date(req.query.end);

		start.setHours(0, 0, 0);
		end.setHours(23, 59, 0);

		Slot.find({
			start: {$gte: start.toUTCString()},
			end: {$lte: end.toUTCString()},
			userId: req.user._id
		}).exec((err, slots) => {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}

			var slotsRange = {};

			//Create day maps
			var startDate = new Date(start);

			while (startDate < end) {
				let dayOptions = req.user.predefinedSettings.workingHours[weekMap[startDate.getDay()]];

				if (dayOptions.isWorkingDay) {
					let start = new Date(startDate);
					start.setMinutes(timeToMinutes(dayOptions.start));

					let end = new Date(startDate);
					end.setMinutes(timeToMinutes(dayOptions.end));

					slotsRange[formatDateForKey(startDate)] = [{
						start: start,
						end: end,
						duration: getSlotDuration(start, end)
					}];
				}

				startDate = new Date(startDate.setDate(startDate.getDate() + 1));
			}

			//Calculate free time left for days
			slots.forEach(slot => {
				let dayTime = slotsRange[formatDateForKey(slot.start)];
				let slotFound = false;

				dayTime.forEach((time, index) => {
					//Set Date to ISODate
					slot.start = new Date(slot.start);
					slot.end = new Date(slot.end);

					if (!slotFound && time.start <= slot.start && time.end >= slot.end) {
						slotFound = true;

						if (slot.start.toString() == time.start.toString() && slot.end.toString() == time.end.toString()) { //No time left in slot
							dayTime.splice(index, 1);
						} else if (time.start < slot.start && time.end > slot.end) { //There are free time in both start and end of slot
							dayTime[index] = {
								start: time.start,
								end: slot.start,
								duration: getSlotDuration(time.start, slot.start)
							};
							dayTime.splice(index, 0, {
								start: slot.end,
								end: time.end,
								duration: getSlotDuration(slot.end, time.end)
							});
						} else if (time.start < slot.start) { //There is free time left in the start of slot
							dayTime[index] = {
								start: time.start,
								end: slot.start,
								duration: getSlotDuration(time.start, slot.start)
							};
						} else if (slot.end < time.end) { //There is free time left in the end of slot
							dayTime[index] = {
								start: slot.end,
								end: time.end,
								duration: getSlotDuration(slot.end, time.end)
							};
						}
					}
				});

				if (!dayTime.length) { //Delete day, if there is no empty slots left
					delete slotsRange[formatDateForKey(slot.start)];
				}
			});
			res.json({data: slotsRange});
		});
	}
}
