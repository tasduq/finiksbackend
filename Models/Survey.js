const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const surveySchema = new Schema({
  campaignName: { type: String, required: true },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  surveyQuestions: { type: Array },
});

module.exports = mongoose.model("Survey", surveySchema);
