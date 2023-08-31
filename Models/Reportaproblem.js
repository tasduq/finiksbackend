const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const reportaproblemSchema = new Schema({
  email: { type: String, required: true },
  issue: { type: String, required: true },
  issueDetail: { type: String, required: true },
  screenShots: { type: Array },
});

module.exports = mongoose.model("Reportaproblem", reportaproblemSchema);
