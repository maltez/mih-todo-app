'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	ObjectId = require("mongodb").ObjectID,
	nodemailer = require('nodemailer'),
	config = require('../../config/config'),
	Slot = mongoose.model('Slot'),
	SERVER_BOOTUP_DATE = new Date(),	// store initial datetime, when not provided through 'req'
	User = mongoose.model('User'),
	smtpTransport = nodemailer.createTransport(config.mailer.options),
	schedule = require('node-schedule')
;

export class EmailSlots {
	constructor() {
		// console.log("SlotEmailNotificationCtrl constructor()");
		let _class = EmailSlots;

		_class._handleOverdueIncompleteSlotsForAllUsers();
		_class._handleAllFutureIncompleteSlotsForAllUsers();
	}

	static _handleOverdueIncompleteSlotsForAllUsers() {
		let _class = this;

		_class._getOverdueIncompleteSlotsForAllUsers()
			.exec(function (err, overdueSlotsForAllUsers) {
				// console.log("exec STARTED _handleOverdueIncompleteSlotsForAllUsers()");
				if (err) {
					// todo
					return;
				}

				overdueSlotsForAllUsers.forEach( overdueSlot => {
					console.log("overdueSlot", overdueSlot.title, overdueSlot.end);
					if (!overdueSlot.userId) return;

					User.findOne({"_id": overdueSlot.userId}, (err, dbUser) => {
						console.log("overdueSlot.userId:", overdueSlot.userId);

						//	TODO: how to handle repeated notifications when server restarts -> introduce 'lastCalled' flag?
						_class._sendEmailReminderOfOverdueSlot(overdueSlot, dbUser.email);
					});
				});
			});
	}

	static _getOverdueIncompleteSlotsForAllUsers() {
		// console.log("_getOverdueIncompleteSlotsForAllUsers()");
		return (
			Slot
				.find({
					'isComplete': false,
					'end': {
						// $lt: new Date(/*req.query.time*/)
						$lt: SERVER_BOOTUP_DATE
					}
				})
				.sort('-created').populate('user', 'displayName')
		);
	}

	/*
	 * collect all future slots,
	 * schedule email Expiration Reminder
	 * */
	static _handleAllFutureIncompleteSlotsForAllUsers() {
		let _class = this;
		_class._getFutureIncompleteSlotsQueryResult()
			.exec(function (err, futureSlots) {
				if (err) {
					// todo
					return;
				}

				// console.log(`  exec STARTED _handleAllFutureIncompleteSlotsForAllUsers`);
				futureSlots.forEach(futureSlot => {
					console.log("futureSlot", futureSlot.title, futureSlot.end);
					_class.doScheduleEmailForFutureSlot(futureSlot);
				});
			});
	}

	static _getFutureIncompleteSlotsQueryResult() {
		// console.log("_getFutureIncompleteSlotsQueryResult()");
		return (
			Slot
				.find({
					'isComplete': false,
					'end': {
						// $gt: new Date(/*req.query.time*/)
						$gt: SERVER_BOOTUP_DATE
					}
				})
				.sort('-created').populate('user', 'displayName')
		);
	}

	static doScheduleEmailForFutureSlot(futureSlot) {
		// console.log("doScheduleEmailForFutureSlot()");

		let incorrectInput = (
			// we rely on userId to find proper user email
			!futureSlot.userId ||

			// do not schedule future notification, when slot is already in the past
			// but during server restart, email will still be sent
			futureSlot.end < new Date()
		);
		if (incorrectInput) {
			console.error("doScheduleEmailForFutureSlot: incorrect input");
			return;
		}

		let _class = this;
		User.findOne({"_id": futureSlot.userId}, (err, dbUser) => {
			//	TODO: for demo, use line below instead - show that email is registered and will be sent in 10secs
			// schedule.scheduleJob(new Date(new Date().valueOf() + 10 * 1000), function () {
			schedule.scheduleJob(futureSlot.end, () => {
				_class._sendEmailReminderOfOverdueSlot(futureSlot, dbUser.email);
			});
			console.log(
				`SLOT WAS SCHEDULED TO EMAIL: ${futureSlot.title},
				expected to be received at: ${new Date(futureSlot.end)}`
			);
		});
	}

	static _sendEmailReminderOfOverdueSlot(overdueSlot, emailTo) {
		// console.log("_sendEmailReminderOfOverdueSlot()");

		// TODO: move this to user settings
		let MAX_EMAIL_REMINDERS_AFTER_SERVER_RESTART = 1;
		overdueSlot.emailStats.timesSentCounter = overdueSlot.emailStats.timesSentCounter || 0;

		if (overdueSlot.emailStats.timesSentCounter >= MAX_EMAIL_REMINDERS_AFTER_SERVER_RESTART) {
			// stop - maximum emails
			console.log("MAX_EMAIL_REMINDERS_AFTER_SERVER_RESTART for", overdueSlot.title);
			return;
		}

		let emailTemplate = `<p>TODO: Please track progress on your overdue slot: </p>
				<p>(${overdueSlot.duration} hours) for Activity <b>'${overdueSlot.title}'</b></p>
				<p>- it was due on: <b>${overdueSlot.end}</b></p>
				<p>- Please visit: <a href="http://mih.epam.com/">http://mih.epam.com/</a></p>`

		var mailOptions = {
			to: emailTo,
			from: config.mailer.from,
			// TODO: clarify requirements regarding email content
			subject: `TODO: Overdue Activity - ${overdueSlot.title}`,
			html: emailTemplate
		};
		smtpTransport.sendMail(mailOptions, function (err) {
			if (err) {
				// todo
				return;
			}
			console.log(`An email NOTIFICATION has been sent to ${emailTo} with further instructions.
			time: ${new Date()}`);
			overdueSlot.emailStats.timesSentCounter++;
			overdueSlot.save(function (err) {
				if (err) {
					console.error('smtpTransport.sendMail: error');
				}
			});
		});
	}
}
