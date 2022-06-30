const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const campaignSurveySchema = new Schema({
  campaignName: { type: String, required: true },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  surveyTaken: { type: Array },
});

module.exports = mongoose.model("Campaignsurvey", campaignSurveySchema);
