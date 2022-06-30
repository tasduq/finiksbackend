const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const surveySchema = new Schema({
  surveyName: { type: String, required: true },
  surveyPreview: { type: String, required: true },
  active: { type: Boolean, default: true },
  surveyQuestion: {
    type: String,
    required: true,
  },
  color: { type: Object },
  surveyAnswer: { type: Array },
});

module.exports = mongoose.model("Survey", surveySchema);
