const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  taskId    : String,
  eventId   : String,
  title     : String,
  priority  : Number,
  duration  : Number,
  start     : Date,
  end       : Date,
  className : Array,
  isComplete: {
    type   : Boolean,
    'default': false
  },
  userId    : {
    type: Schema.ObjectId,
    ref : 'User'
  },
  emailStats: {
    timesSentCounter: Number
  },
  overlap   : false
});

mongoose.model('Slot', SlotSchema);
