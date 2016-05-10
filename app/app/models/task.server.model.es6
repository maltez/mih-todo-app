'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var taskTemplate = {
	title: {
		type: String,
		default: '',
		required: 'Please fill Task title',
		trim: true
	},
	priority: {
		type: Number,
		required: 'Please choose Task priority',
		default: ''
	},
	notes: {
		type: String,
		default: '',
		trim: true
	},
	estimation: {
		type: Number,
		default: ''
	}
};

/**
 * Task Schema
 */
var TaskSchema = new Schema(_.extend({
	id:{
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
	days:	{
		startDate: {
			type: Date,
			default: ''
		},
		endDate : {
			type: Date,
			default: ''
		}
	},
	parentTaskId: {
		type: Date,
		default: ''
	},
	deadline: {
		type: Date,
		default: ''
	},
	tags: [],
	progress: {
		type: Number,
		default: ''
	},
	status: {
		type: String,
		default: ''
	},
	summary: {
		type: String,
		default: '',
		trim: true
	},
	performer: {
		type: Number,
		default: ''
	},
	location: {
		type: String,
		default: '',
		trim: true
	},
	isRepeatable: {
		type: Number,
		default: ''
	},
	attendees: [],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, taskTemplate));

mongoose.model('Task', TaskSchema);

exports.taskTemplate = taskTemplate;
