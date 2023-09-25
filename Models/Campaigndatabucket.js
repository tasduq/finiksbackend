const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const campaignDataBucketSchema = new Schema({
  campaignId: { type: Schema.Types.ObjectId, ref: "Campaign" },
  campaignData: { type: Array },
});

module.exports = mongoose.model("Campaigndatabucket", campaignDataBucketSchema);
