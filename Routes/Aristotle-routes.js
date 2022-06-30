const express = require("express");
const multer = require("multer");
let multerInstance = multer();

const aristotleController = require("../controllers/aristotle-controllers");

const router = express.Router();

router.post("/getaristotledata", aristotleController.getAristotledata);
router.post(
  "/addaristotledata",
  multerInstance.single("file"),
  aristotleController.addAristotleData
);
router.post("/editvoter", aristotleController.editVoter);

module.exports = router;
