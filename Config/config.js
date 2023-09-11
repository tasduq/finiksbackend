const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  dbStage: process.env.DBStage,
  dbProd: process.env.DBProd,
  JWTKEY: process.env.JWT,
  cloudName: process.env.CLOUDNAME,
  cloudinaryApiKey: process.env.CLOUDINARYAPIKEY,
  cloudinaryApiSecret: process.env.CLOUDINARYAPISECRET,
  superAdminCode: process.env.SUPERADMINCODE,
  campaignManagerCode: process.env.CAMPAIGNMANAGER,
  teamCode: process.env.TEAM,
};
