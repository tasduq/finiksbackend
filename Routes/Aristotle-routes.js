const express = require("express");
const multer = require("multer");
let multerInstance = multer();
const verifyToken = require("../middlewares/auth"); // Import the middleware

const aristotleController = require("../controllers/aristotle-controllers");

const router = express.Router();

router.post(
  "/getaristotledata",
  verifyToken,
  aristotleController.getAristotledata
);
router.post(
  "/addaristotledata",
  multerInstance.single("file"),
  aristotleController.addAristotleData
);
router.post("/editvoter", verifyToken, aristotleController.editVoter);

module.exports = router;
