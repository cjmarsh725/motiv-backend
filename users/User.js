const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 11;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  })
});

userSchema.methods.checkPassword = function(plainTextPW, callBack) {
  bcrypt.compare(plainTextPW, this.password, callBack);
};

module.exports = mongoose.model('User', userSchema);