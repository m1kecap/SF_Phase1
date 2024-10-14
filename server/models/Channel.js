const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  groupId: { type: Number, ref: 'Group' }
});

module.exports = mongoose.model('Channel', ChannelSchema);