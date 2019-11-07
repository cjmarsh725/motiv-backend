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
  },
  id: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);