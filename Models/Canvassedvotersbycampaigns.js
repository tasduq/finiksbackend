const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const canvassedVotersByCampaignSchema = new Schema({
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  surveyedVotersList: { type: Array },
});

module.exports = mongoose.model(
  "Canvassedvotersbycampaign",
  canvassedVotersByCampaignSchema
);
