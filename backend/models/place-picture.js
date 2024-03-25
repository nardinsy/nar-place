const mongoose = require("mongoose");

const placePictureSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  placeId: { type: String },
});

module.exports = mongoose.model("PlacePicture", placePictureSchema);
