const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const listSchema = new Schema({
  listName: { type: String, required: true },
  totalNumbers: { type: Number, required: true },

  campaignOwnerId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
  },
  campaignName: { type: String },
  voters: { type: Array, required: true },
});

module.exports = mongoose.model("List", listSchema);
