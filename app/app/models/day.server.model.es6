'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var DaySchema = new Schema({
	date: Date,

	bookedSlots: [{
		taskId: String,
		duration: Number,
		priority : Number
	}],

	freeTime: Number
});

mongoose.model('Day', DaySchema);
