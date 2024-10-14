const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    id: Number,
    name: String,
    channels: [{
      id: Number,
      name: String
    }],
    admins: [{ type: Number, ref: 'User' }],
    members: [{ type: Number, ref: 'User' }],
    interestedUsers: [{ type: Number, ref: 'User' }]
  });

module.exports = mongoose.model('Group', GroupSchema);