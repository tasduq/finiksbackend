const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  email: { type: String, required: true },
  campaignName: { type: String, required: true },
  password: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  election: { type: String },

  state: { type: String },
  level: { type: String },
  district: { type: String },
  active: { type: Boolean, default: true },
  role: { type: String },
  campaignDates: { type: Object },
  campaignLogo: { type: String },
  campaignCode: { type: String },
  teamMembers: { type: Array },
  invitedTeamMembers: { type: Array },
});

module.exports = mongoose.model("Campaign", campaignSchema);
