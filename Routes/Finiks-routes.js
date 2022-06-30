const express = require("express");

const finiksController = require("../controllers/finiks-controllers");

const router = express.Router();

router.post("/getfiniksdata", finiksController.getFiniksdata);
// router.post("/addfiniksdata", finiksController.addfiniksData);
router.post("/editvoter", finiksController.editVoter);

module.exports = router;
