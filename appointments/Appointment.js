const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);