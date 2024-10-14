const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  password: String,
  roles: [String],
  groups: [{ type: Number, ref: 'Group' }],
  profileImage: String
});

module.exports = mongoose.model('User', UserSchema);