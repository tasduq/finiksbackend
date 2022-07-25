const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const phonebanklistSchema = new Schema({
  recordName: { type: String, required: true },
  totalNumbers: { type: Number, required: true },
  totalCalled: { type: Number, defaultValue: 0 },
  numbersLeft: { type: Number, defaultValue: 0 },
  scriptId: {
    type: Schema.Types.ObjectId,
    ref: "Script",
  },
  scriptName: { type: String },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  // voters: { type: Array },
  // phoneBankerId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  // phoneBankerName: {
  //   type: String,
  // },
  teamMembers: { type: Array },
  list: {
    type: Schema.Types.ObjectId,
    ref: "List",
  },
  active: { type: String, default: "Active" },
});

module.exports = mongoose.model("Phonebanklist", phonebanklistSchema);
