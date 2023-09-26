const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const finiksController = require("../controllers/finiks-controllers");

const router = express.Router();

router.post("/getfiniksdata", verifyToken, finiksController.getFiniksdata);
// router.post("/addfiniksdata", finiksController.addfiniksData);
router.post("/editvoter", verifyToken, finiksController.editVoter);
router.get(
  "/getfinikstotalcount",
  verifyToken,
  finiksController.getFiniksDataTotalCount
);
module.exports = router;
