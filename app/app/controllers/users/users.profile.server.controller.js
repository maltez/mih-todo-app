'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user,
		body = req.body;

	// For security measurement we remove the roles from the req.body object
	delete body.roles;

	if (user) {
		User.findById(req.user.id, function (err, user) {
			if (!err && user) {
				if (body.newPassword || body.currentPassword || body.verifyPassword) {
					if (user.authenticate(body.currentPassword)) {
						if (body.newPassword === body.verifyPassword) {
							body.password = body.newPassword;

							delete body.currentPassword;
							delete body.newPassword;
							delete body.verifyPassword;
						} else {
							return res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						return res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				}

				// Merge existing user
				user = _.extend(user, body);
				user.displayName = user.firstName + ' ' + user.lastName;

				user.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						req.login(user, function(err) {
							if (err) {
								res.status(400).send(err);
							} else {
								res.json(user);
							}
						});
					}
				});
			} else {
				res.status(400).send({
					message: 'User is not found'
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
