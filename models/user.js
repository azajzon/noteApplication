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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Include any other fields you want for your users
});

// Create a model from the schema
const User = mongoose.model('users', UserSchema, 'users');

module.exports = User;