const express = require("express");

const listController = require("../controllers/list-controllers");

const router = express.Router();

router.post("/querydata", listController.queryData);
router.post("/savelist", listController.saveList);
router.post("/getlists", listController.getLists);
// router.post(
//   "/getlistsforlisting",
//   listController.getListsForlisting
// );
// router.post("/updatelist", listController.updateList);
// router.post("/editlist", listController.editList);
// router.post("/deletelist", listController.deleteList);

module.exports = router;
