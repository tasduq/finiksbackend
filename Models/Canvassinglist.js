const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const canvassingSchema = new Schema({
  listName: { type: String, required: true },
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
  voters: { type: Array, required: true },
  canvasserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  canvasserName: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  active: { type: String, default: "Active" },
});

module.exports = mongoose.model("Canvassing", canvassingSchema);
