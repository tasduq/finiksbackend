const express = require("express");

const phonebankController = require("../controllers/phonebank-controllers");

const router = express.Router();

router.post("/queryphonebank", phonebankController.queryPhonebank);
router.post("/savelist", phonebankController.saveList);
router.post("/getlists", phonebankController.getLists);
router.post(
  "/getlistsforphonebanking",
  phonebankController.getListsForPhonebanking
);
router.post("/updatelist", phonebankController.updateList);
router.post("/editlist", phonebankController.editList);
router.post("/deletelist", phonebankController.deleteList);

module.exports = router;
