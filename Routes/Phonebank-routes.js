const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const phonebankController = require("../controllers/phonebank-controllers");

const router = express.Router();

router.post("/queryphonebank", verifyToken, phonebankController.queryPhonebank);
router.post("/saverecord", verifyToken, phonebankController.saveRecord);
router.post("/updaterecord", verifyToken, phonebankController.updateRecord);
router.post("/getrecords", verifyToken, phonebankController.getRecords);
router.post(
  "/getcampaignteammembers",
  verifyToken,
  phonebankController.getCampaignTeammembers
);
router.post(
  "/getlistsforphonebanking",
  verifyToken,
  phonebankController.getListsForPhonebanking
);
router.post("/updatelist", verifyToken, phonebankController.updateList);
router.post("/editlist", verifyToken, phonebankController.editList);
router.post("/deletelist", verifyToken, phonebankController.deleteList);

module.exports = router;
