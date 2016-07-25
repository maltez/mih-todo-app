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
	overlap: false
});

mongoose.model('Slot', SlotSchema);
