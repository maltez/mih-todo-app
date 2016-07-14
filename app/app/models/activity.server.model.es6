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
 * Activity Schema
 */
var ActivitySchema = new Schema(_.extend({
	id:{
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		default: '',
		trim: true,
		required: 'Type of activity is not specified'
	},
	title: {
		type: String,
		default: '',
		required: 'Please fill the Title',
		trim: true
	},
	priority: {
		type: Number,
		default: ''
	},
	days:	{
		startTime: {
			type: Date,
			default: ''
		},
		endTime : {
			type: Date,
			default: ''
		}
	},
	notes: {
		type: String,
		default: '',
		trim: true
	},
	parentTaskId: {
		type: Date,
		default: ''
	},
	deadline: {
		type: Date,
		default: ''
	},
	estimation: {
		type: Number,
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
	},
	isATemplate : {
		type : Boolean,
		default : false
	},
	withOutDates : {
		type : Boolean,
		default : false
	}
}, taskTemplate));

mongoose.model('Activity', ActivitySchema);
exports.taskTemplate = taskTemplate;
