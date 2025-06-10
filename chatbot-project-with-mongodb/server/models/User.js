const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique: true       --> for show email exist error
  },


createdAt: {
  type: String,
  default: () => new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
}

});

module.exports = mongoose.model('User', userSchema);









