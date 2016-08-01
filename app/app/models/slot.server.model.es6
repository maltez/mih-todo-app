'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SlotSchema = new Schema({
	taskId: String,
	title: String,
	priority : Number,
	duration : Number,
	startTime: Date,
	endTime: Date,
	isComplete: false,
	overlap: false
});

mongoose.model('Slot', SlotSchema);
