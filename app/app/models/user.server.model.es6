'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	taskTemplate = require('./activity.server.model').taskTemplate,
	eventTemplate = require('./activity.server.model').eventTemplate;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function validateLocalStrategyProperty(property) {
	return this.provider !== 'local' && !this.updated || property.length;
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function validateLocalStrategyPassword(password) {
	return this.provider !== 'local' || password && password.length >= 6;
};

var WorkDay = function(dayName, dayIndex) {
	return {
		start: {
			type: String,
			default: '09:00',
			required: 'Please fill in a working day start time'
		},

		end: {
			type: String,
			default: '18:00',
			required: 'Please fill in a working day end time'
		},

		isWorkingDay: {
			type: Boolean,
			default: (dayName != 'sun' && dayName != 'sat')
		},

		dayIndex: {
			type: Number,
			default: dayIndex
		}
	}
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		unique: 'Email already registered'
	},
	username: {
		type: String,
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	profileImageURL: {
		type: String,
		default: './modules/users/img/profiles/default.jpg'
	},
	predefinedSettings: {
		booked: [{
			startTime: {
				type: String,
				required: 'Please fill in a booked time start'
			},
			endTime: {
				type: String,
				required: 'Please fill in a booked time end'
			}
		}],

		workingHours: {
			'mon': new WorkDay('mon', 1),
			'tue': new WorkDay('tue', 2),
			'wed': new WorkDay('wed', 3),
			'thu': new WorkDay('thu', 4),
			'fri': new WorkDay('fri', 5),
			'sat': new WorkDay('sat', 6),
			'sun': new WorkDay('sun', 7)
		},

		reminder: {
			type: Number,
			default: 15,
			required: 'Please fill in a reminder time'
		}
	},
	taskTemplates: [taskTemplate],
	eventTemplates : [eventTemplate],
	/*system fields*/
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
	//TODO: Fix hash checking by creating new password_hash field
	if (
		this.password &&
		!/==/.test(this.password) //Check, if password wasn't hashed
	) {
		this.salt = crypto.randomBytes(16).toString('base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function (err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
