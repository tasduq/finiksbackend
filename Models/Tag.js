const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  tagName: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
  type: { type: String, required: true },
  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  ownerName: { type: String, required: true },
  users: { type: Array },
  creatorName: { type: String, required: true },
});

module.exports = mongoose.model("Tag", tagSchema);
