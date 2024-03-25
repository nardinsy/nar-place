const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: mongoose.Types.ObjectId, ref: "PlacePicture" },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  // creator: { type: String, required: true, ref: "User" },
});

module.exports = mongoose.model("Place", placeSchema);
