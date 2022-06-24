const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String, unique: true },
  countryCode: { type: String },
  agreements: { type: Boolean }
});

module.exports = mongoose.model("user", userSchema);