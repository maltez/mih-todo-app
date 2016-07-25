'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ObjectId = require("mongodb").ObjectID,
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	Notification = mongoose.model('Activity'),
	User = mongoose.model('User'),
	smtpTransport = nodemailer.createTransport(config.mailer.options),
	schedule = require('node-schedule')
;

exports.scheduleExpirationReminderFor_OneTask = function (taskNewOrFromDB) {

	User.findOne({"_id": taskNewOrFromDB.user}, (err, dbUser) => {
		schedule.scheduleJob(taskNewOrFromDB.days.endTime, function () {
			// deadline has arrived - task is overdue
			_emailExpiredTaskToEmail(taskNewOrFromDB, dbUser.email);
		});
	});
};

exports.scheduleExpirationReminderFor_AllKnownFutureTasks = function () {

	Notification
		.find({
			'type': 'task',
			'days.endTime': {
				$gt: new Date()
			}
		})
		.sort('-days.endTime')
		.exec(function (err, futureTasks) {
			futureTasks.forEach( futureTask => {
				exports.scheduleExpirationReminderFor_OneTask(futureTask);
			});
		});

};

function _emailExpiredTaskToEmail (overdueActivityToRemind, emailTo) {
	var mailOptions = {
		to: emailTo,
		from: config.mailer.from,
		// TODO: clarify requirements regarding email content
		subject: `TODO: Overdue Activity - ${overdueActivityToRemind.title}`,
		html: `<p>TODO: Please track progress on your overdue Activity <b>'${overdueActivityToRemind.title}'</b></p>
							<p>- it was due on: <b>${overdueActivityToRemind.days.endTime}</b></p>`
	};
	smtpTransport.sendMail(mailOptions, function (err) {
		if (err) {
			return;
		}
		overdueActivityToRemind.save(function (err) {
			if (err) {
				console.error("ERROR! save failed");
				return;
			}
			console.log(`An email NOTIFICATION has been sent to ${emailTo} with further instructions.`);
		});
	});
}
