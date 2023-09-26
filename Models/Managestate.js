const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const manageState = new Schema({
  stateName: { type: String, required: true },
  stateKey: { type: String, required: true },
});

module.exports = mongoose.model("Managestate", manageState);
