const express = require("express");
const verifyToken = require("../middlewares/auth"); // Import the middleware

const listController = require("../controllers/list-controllers");

const router = express.Router();

router.post("/querydata", verifyToken, listController.queryData);
router.post("/savelist", verifyToken, listController.saveList);
router.post("/getlists", verifyToken, listController.getLists);
// router.post(
//   "/getlistsforlisting",
//   listController.getListsForlisting
// );
// router.post("/updatelist", listController.updateList);
// router.post("/editlist", listController.editList);
// router.post("/deletelist", listController.deleteList);

module.exports = router;
