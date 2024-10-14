const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  content: { 
    type: String, 
    required: function() { return !this.imageUrl; }  
  },
  imageUrl: String,
  userProfileImage: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);