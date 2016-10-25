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
		let _class = EmailSlots;

		_class._handleOverdueIncompleteSlotsForAllUsers();
		_class._handleAllFutureIncompleteSlotsForAllUsers();
	}

	static _handleOverdueIncompleteSlotsForAllUsers() {
		let _class = this;

		_class._getOverdueIncompleteSlotsForAllUsers()
			.exec(function (err, overdueSlotsForAllUsers) {
				if (err) {
					// todo
					return;
				}

				overdueSlotsForAllUsers.forEach(overdueSlot => {
					if (!overdueSlot.userId) return;

					User.findOne({"_id": overdueSlot.userId}, (err, dbUser) => {
						//	TODO: how to handle repeated notifications when server restarts -> introduce 'lastCalled' flag?
						_class._sendEmailReminderOfOverdueSlot(overdueSlot, dbUser.email);
					});
				});
			});
	}

	static _getOverdueIncompleteSlotsForAllUsers() {
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

				futureSlots.forEach(futureSlot => {
					_class.doScheduleEmailForFutureSlot(futureSlot);
				});
			});
	}

	static _getFutureIncompleteSlotsQueryResult() {
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
		if (!futureSlot.userId) {
			// we rely on userId to find proper user email
			console.error("doScheduleEmailForFutureSlot: not found - futureSlot.userId. cannot send email");
			return;
		}

		let _class = this;
		User.findOne({"_id": futureSlot.userId}, (err, dbUser) => {
			if (futureSlot.end < new Date()) {
				// TODO: refactor fn calls, so this scenario never happens (but it does, currently).
				// do not schedule future notification, when slot is already in the past
				console.error("doScheduleEmailForFutureSlot: slot is already in the past. \n " +
					"send email immediately, so that it is not sent during server restart");
				_class._sendEmailReminderOfOverdueSlot(futureSlot, dbUser.email);
				return;
			}

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
		// TODO: move this to user settings
		let MAX_EMAIL_REMINDERS_FOR_SLOT = 1;
		overdueSlot.emailStats.timesSentCounter = overdueSlot.emailStats.timesSentCounter || 0;

		if (overdueSlot.emailStats.timesSentCounter >= MAX_EMAIL_REMINDERS_FOR_SLOT) {
			// stop - maximum emails
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
