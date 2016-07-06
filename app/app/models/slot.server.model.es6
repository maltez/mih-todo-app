'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var SlotSchema = new Schema({
	taskId: String,
	title: String,
	start: Date,
	end: Date,
	overlap: false
});

mongoose.model('Slot', SlotSchema);
