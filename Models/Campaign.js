const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  email: { type: String },
  campaignName: { type: String, required: true },
  password: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  election: { type: String },

  state: { type: String },
  level: { type: String },
  district: { type: Array },
  active: { type: Boolean, default: true },
  role: { type: String },
  campaignDates: { type: Object },
  campaignLogo: { type: String },
  campaignCode: { type: String },
  teamMembers: { type: Array },
  invitedTeamMembers: { type: Array },
  invitedVoters: { type: Array },
  county: { type: Array },
  countyCommission: { type: Array },
  city: { type: Array },
  emailVerificationCode: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
});

module.exports = mongoose.model("Campaign", campaignSchema);
