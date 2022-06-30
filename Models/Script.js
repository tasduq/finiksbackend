const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const scriptSchema = new Schema({
  scriptName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean },
  script: {
    type: String,
    required: true,
  },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
});

module.exports = mongoose.model("Script", scriptSchema);
