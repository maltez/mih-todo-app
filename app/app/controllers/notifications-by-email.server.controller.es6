'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ObjectId = require("mongodb").ObjectID,
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	Notification = mongoose.model('Activity');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

exports.emailOverdueTasks = function (req, res) {
	// TODO: clarify max number of emails sent to user
	const MAX_EMAILS_PER_TASK = 2;

	// save timestamp: in order to avoid lag between request to DB,
	// so that next timer schedules correctly
	let plannedTimeToSendEmail = new Date(req.query.time);

	Notification
		.find({
			'user': ObjectId(req.user._id),
			'type': 'task',
			'days.endTime': {
				$lt: new Date(req.query.time)
			},
			$or: [
				{
					'overdueEmailStats.sentCounter': { $exists: false }
				},
				{
					'overdueEmailStats.sentCounter': { $lt: MAX_EMAILS_PER_TASK }
				}
			]
		})
		.sort('-created')
		.populate('user', 'displayName')
		.exec(function (err, overdueActivitiesToRemind) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				if (!overdueActivitiesToRemind.length) {
					// abort early, if empty
					res.send(overdueActivitiesToRemind);
					return;
				}

				overdueActivitiesToRemind.forEach(function (overdueActivityToRemind, i) {
					var mailOptions = {
						to: req.user.email,
						from: config.mailer.from,
						// TODO: clarify requirements regarding email content
						subject: `TODO: Overdue Activity - ${overdueActivityToRemind.title}`,
						html: `<p>TODO: Please track progress on your overdue Activity <b>'${overdueActivityToRemind.title}'</b></p>
							<p>- it was due on: <b>${overdueActivityToRemind.days.endTime}</b></p>`
					};
					if (overdueActivityToRemind.overdueEmailStats.sentCounter + 1 >= MAX_EMAILS_PER_TASK) {
						mailOptions.html += `<h3>WARNING: <em>this is last email warning for this task!</em><h3>`;
					}
					smtpTransport.sendMail(mailOptions, function (err) {
						if (err) {
							return;
						}
						overdueActivityToRemind.overdueEmailStats.sentAt = plannedTimeToSendEmail;
						overdueActivityToRemind.overdueEmailStats.sentCounter++;
						if (overdueActivityToRemind.overdueEmailStats.sentCounter >= MAX_EMAILS_PER_TASK) {
							console.warn(`
									WARNING: you reached limit for email notifications for this task.
									No more reminders for task '${overdueActivityToRemind.title}' will be sent.
								`);
						}
						overdueActivityToRemind.save(function (err) {
							if (err) {
								console.error("ERROR! save failed");
								return;
							}
							console.log(`An email NOTIFICATION has been sent to ${req.user.email} with further instructions.`);
						});
					});

				});

				res.send(overdueActivitiesToRemind);
			}
		});

};
