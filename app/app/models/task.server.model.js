'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	id:{
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		default: '',
		trim: true
	},
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
	days:	{
		startTime: {
			type: Date,
			required: 'Please fill start date',
			default: ''
		},
		endTime : {
			type: Date,
			required: 'Please fill end date',
			default: ''
		}
	},
	notes: {
		type: String,
		default: '',
		required: 'Please fill end date',
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
	}
});

mongoose.model('Task', TaskSchema);




























