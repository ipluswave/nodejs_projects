var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  created_at: { type: Date, default: Date.now },
  age: Number
});

module.exports = mongoose.model('User', userSchema);