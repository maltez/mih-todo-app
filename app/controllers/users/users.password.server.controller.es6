'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    config = require('../../../config/config'),
    nodemailer = require('nodemailer'),
    async = require('async'),
    crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
	async.waterfall([
	// Generate random token
	function (done) {
		crypto.randomBytes(20, function (err, buffer) {
			var token = buffer.toString('hex');
			done(err, token);
		});
	},
	// Lookup user by email
	function (token, done) {
		if (req.body.email) {
			User.findOne({
				email: req.body.email
			}, '-salt -password', function (err, user) {
				if (!user) {
					return res.status(400).send({
						message: 'No account with that email has been found'
					});
				} else if (user.provider !== 'local') {
					return res.status(400).send({
						message: 'It seems like you signed up using your ' + user.provider + ' account'
					});
				} else {
					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function (err) {
						done(err, token, user);
					});
				}
			});
		} else {
			return res.status(400).send({
				message: 'Username field must not be blank'
			});
		}
	}, function (token, user, done) {
		res.render('templates/reset-password-email', {
			name: user.username,
			appName: config.app.title,
			url: 'http://' + req.headers.host + '/auth/reset/' + token
		}, function (err, emailHTML) {
			done(err, emailHTML, user);
		});
	},
	// If valid email, send reset email using service
	function (emailHTML, user, done) {
		var mailOptions = {
			to: user.email,
			from: config.mailer.from,
			subject: 'Password Reset',
			html: emailHTML
		};
		smtpTransport.sendMail(mailOptions, function (err) {
			if (!err) {
				res.send({
					message: 'An email has been sent to ' + user.email + ' with further instructions.'
				});
			} else {
				return res.status(400).send({
					message: 'Failure sending email'
				});
			}

			done(err);
		});
	}], function (err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function (err, user) {
		if (!user) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([function (done) {
		User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: {
				$gt: Date.now()
			}
		}, function (err, user) {
			if (!err && user) {
				if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
					user.password = passwordDetails.newPassword;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save(function (err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							req.login(user, function (err) {
								if (err) {
									res.status(400).send(err);
								} else {
									// Return authenticated user
									res.json(user);

									done(err, user);
								}
							});
						}
					});
				} else {
					return res.status(400).send({
						message: 'Passwords do not match'
					});
				}
			} else {
				return res.status(400).send({
					message: 'Password reset token is invalid or has expired.'
				});
			}
		});
	}, function (user, done) {
		res.render('templates/reset-password-confirm-email', {
			name: user.username,
			appName: config.app.title
		}, function (err, emailHTML) {
			done(err, emailHTML, user);
		});
	},
	// If valid email, send reset email using service
	function (emailHTML, user, done) {
		var mailOptions = {
			to: user.email,
			from: config.mailer.from,
			subject: 'Your password has been changed',
			html: emailHTML
		};

		smtpTransport.sendMail(mailOptions, function (err) {
			done(err, 'done');
		});
	}], function (err) {
		if (err) return next(err);
	});
};