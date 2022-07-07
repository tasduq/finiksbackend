const express = require("express");

const canvassingController = require("../controllers/canvassing-controllers");

const router = express.Router();

router.post("/querycanvassing", canvassingController.queryCanvassing);
router.post("/savelist", canvassingController.saveList);
router.post("/getlists", canvassingController.getLists);
router.post(
  "/getlistsforcanvassing",
  canvassingController.getListsForCanvassing
);
router.post("/updatelist", canvassingController.updateList);
router.post("/editlist", canvassingController.editList);
router.post("/deletelist", canvassingController.deleteList);

module.exports = router;
