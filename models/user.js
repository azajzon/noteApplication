// models/User.js
const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
});

// Create a model from the schema
const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;