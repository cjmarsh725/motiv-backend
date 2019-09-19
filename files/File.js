const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },
  fileStructure: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('File', fileSchema);