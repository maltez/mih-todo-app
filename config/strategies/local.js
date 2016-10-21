'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			User.findOne({
				email: email
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Please check your email and password and try again'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Please check your email and password and try again'
					});
				}

				return done(null, user);
			});
		}
	));
};
