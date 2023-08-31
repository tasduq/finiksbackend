const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  db: process.env.DB,
  JWTKEY: process.env.JWT,
  cloudName: process.env.CLOUDNAME,
  cloudinaryApiKey: process.env.CLOUDINARYAPIKEY,
  cloudinaryApiSecret: process.env.CLOUDINARYAPISECRET,
};
