const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  userId: { type: String },
});

module.exports = mongoose.model("Picture", pictureSchema);
