const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  userid: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);