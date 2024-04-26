const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema({
    noteId: {
        type: String,
        required: true,
        unique: true,
        default: uuidv4
      },
  username: {
    type: String,
    required: true,
    ref: 'User', // Assuming the username is unique and can be used to link to the User model
    index: true
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: false, // Automatically calculated or user input, so it might not be required at creation
    default: function() {
      // If you want to auto-calculate based on content, you can do so here
      // Note: This simplistic calculation may not perfectly align with actual text length considerations (like multi-byte characters, etc.)
      return this.content.length;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to set the updatedAt before saving
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
