const mongoose = require('mongoose');

// Schema for system_state and login_state
const stateSchema = new mongoose.Schema({
  system_state: {
    type: String,
    enum: ["INIT", "PAUSED", "RUNNING", "SHUTDOWN", "FAILURE"],
    default: "INIT"
  },
  login_state: {
    type: Boolean,
    default: false
  }
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
