const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userid: {
    type: String,
  }
});

module.exports = mongoose.model('Reminder', reminderSchema);