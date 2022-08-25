const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const aristotleDataSchema = new Schema({
  apiId: { type: String, required: true },
  FIRSTNAME: { type: String, required: true },
  middleInt: { type: String },
  LASTNAME: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: String, required: true },
  partyCode: { type: String, required: true },
  regisDate: { type: String, required: true },
  absantee: { type: String, required: true },
  status: { type: String, required: true },
  ethnic_cod: { type: String, required: true },
  ethnic_code: { type: String, required: true },
  ethnic_infer: { type: String, required: true },
  ethnicgrp: { type: String, required: true },
  voterId: { type: String, required: true },
  language: { type: String, required: true },
  mrtlStatus: { type: String, required: true },
  occupation: { type: String, required: true },
  presenChld: { type: String, required: true },
  religion: { type: String, required: true },
  MOBILE_NUM: { type: String, required: true },
  PHONE_NUM: { type: String, required: true },
  EMAIL: { type: String, required: true },
  email2: { type: String },
  email3: { type: String },
  stateCont: { type: String, required: true },
  st_up_hous: { type: String, required: true },
  st_lo_hous: { type: String, required: true },
  cong_dist: { type: String, required: true },
  ai_county_name: { type: String, required: true },
  city_dist: { type: String, required: true },
  cnty_dist: { type: String, required: true },
  cward_prec: { type: String, required: true },
  educ_dist: { type: String, required: true },
  dma_name: { type: String, required: true },
  municipality: { type: String, required: true },
  prec_no1: { type: String, required: true },
  prec_part: { type: String, required: true },
  schl_brd: { type: String },
  ADDRESS: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  maddress: { type: String, required: true },
  mcity: { type: String, required: true },
  mstate: { type: String, required: true },
  mzip: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  home_seq: { type: String, required: true },
  vot_pref: { type: String, required: true },
  vp_gen: { type: String, required: true },
  vp_oth: { type: String, required: true },
  vp_ppp: { type: String, required: true },
  vp_pri: { type: String, required: true },
  vtr_ppp12: { type: String },
  vtr_ppp16: { type: String },
  vtr_ppp20: { type: String },
  vtr_gen12: { type: String },
  vtr_gen16: { type: String },
  vtr_gen20: { type: String },
  prfl_2ndame: { type: String },
  prfl_active_mil: { type: String },
  prfl_amzn_prime: { type: String },
  prfl_anml_rights: { type: String },
  prfl_biden_support: { type: String },
  prfl_blm_support: { type: String },
  prfl_border_security: { type: String },
  prfl_choicelife: { type: String },
  prfl_clinton_support: { type: String },
  prfl_conservative_news: { type: String },
  prfl_education: { type: String },
  prfl_environment: { type: String },
  prfl_evangelical: { type: String },
  prfl_fence_sitter: { type: String },
  prfl_gun_control: { type: String },
  prfl_healthcare_reform: { type: String },
  prfl_healthcare: { type: String },
  prfl_immigration_reform: { type: String },
  prfl_influencer: { type: String },
  prfl_insurance: { type: String },
  prfl_labor: { type: String },
  prfl_lgbt_support: { type: String },
  prfl_liberal_news: { type: String },
  prfl_marijuana_reform: { type: String },
  prfl_marriage_equality: { type: String },
  prfl_metoo_support: { type: String },
  prfl_mil_support: { type: String },
  prfl_minwage: { type: String },
  prfl_obama: { type: String },
  prfl_persuadable_voter: { type: String },
  prfl_political_ideology: { type: String },
  prfl_sanders_support: { type: String },
  prfl_taxes: { type: String },
  prfl_teachers_union: { type: String },
  prfl_teaparty: { type: String },
  prfl_trump_support: { type: String },
  prfl_veteran: { type: String },
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Aristotledata", aristotleDataSchema);
