const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  email: { type: String },
  token: { type: String, required: true },
  expired: { type: Boolean, default: false },
});

module.exports = mongoose.model("Session", sessionSchema);
