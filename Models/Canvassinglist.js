const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const canvassingSchema = new Schema({
  recordName: { type: String, required: true },
  totalNumbers: { type: Number, required: true },
  knocked: { type: Number, defaultValue: 0 },
  reached: { type: Number, defaultValue: 0 },
  surveyed: { type: Number, defaultValue: 0 },
  scriptId: {
    type: Schema.Types.ObjectId,
    ref: "Script",
  },
  scriptName: { type: String },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  active: { type: String, default: "Active" },
  list: {
    type: Schema.Types.ObjectId,
    ref: "List",
  },
  walkBooks: { type: Array },
});

module.exports = mongoose.model("Canvassing", canvassingSchema);
