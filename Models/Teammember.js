const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },

  active: { type: Boolean, default: true },
  permission: { type: String },
  campaignJoined: { type: Array },
  emailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String },
  campaignLogo: { type: String },
  image: { type: String },
  role: { type: String },
});

module.exports = mongoose.model("Teammember", teamMemberSchema);
