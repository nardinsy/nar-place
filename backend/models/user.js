const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  picture: { type: mongoose.Types.ObjectId, ref: "Picture" },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
